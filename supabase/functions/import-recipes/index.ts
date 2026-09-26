// Supabase Edge Function: import-recipes
//
// Holt Rezepte von Spoonacular, uebersetzt Titel/Zutaten/Schritte
// via Claude (Haiku 4.5, guenstig + schnell), speichert in Supabase.
//
// Einmaliger Aufruf pro Import-Batch. Rezepte werden in Supabase gecached.
//
// Aufruf: POST mit { query?: string, count?: number, minProtein?: number }
// z.B. { "query": "high protein", "count": 40, "minProtein": 20 }
//
// Deploy: supabase functions deploy import-recipes
// Secrets: supabase secrets set SPOONACULAR_API_KEY=... ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from 'npm:@anthropic-ai/sdk@^0.127.0';
import { createClient } from 'npm:@supabase/supabase-js@2';

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '',
});

const SPOONACULAR_KEY = Deno.env.get('SPOONACULAR_API_KEY') ?? '';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface ImportRequest {
  query?: string;
  count?: number;
  minProtein?: number;
  maxCarbs?: number;
  diet?: string;
  skipDuplicates?: boolean;
}

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  extendedIngredients: Array<{
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  analyzedInstructions: Array<{
    steps: Array<{ step: string }>;
  }>;
  nutrition?: {
    nutrients: Array<{ name: string; amount: number; unit: string }>;
  };
  dishTypes?: string[];
  diets?: string[];
}

interface TranslatedRecipe {
  title_de: string;
  ingredients_de: Array<{ name: string; amount: number; unit: string }>;
  steps_de: string[];
  category_de: string;
  tags_de: string[];
}

const TRANSLATION_SYSTEM = `Du bist der Content-Editor der BodyShift Companion App (Deutsch/Oesterreich).
Uebersetze englische Rezepte auf klares, alltagstaugliches Deutsch. Kein AI-Sprech, kein Chef-Deutsch.
Wortwahl: BodyShift ist Premium-Wellness, keine Fitness-Bro-App. Motivierend, aber ruhig.

Antworte AUSSCHLIESSLICH mit validem JSON in genau diesem Format:
{
  "title_de": "Kurzer, appetitlicher Titel auf Deutsch",
  "ingredients_de": [
    { "name": "Zutat auf Deutsch", "amount": 200, "unit": "g" }
  ],
  "steps_de": [
    "Schritt 1 als kompletter Satz.",
    "Schritt 2 als kompletter Satz."
  ],
  "category_de": "Fruehstueck|Mittagessen|Abendessen|Snack|Suesses",
  "tags_de": ["eiweissreich", "schnell", "vegetarisch"]
}

Regeln:
- Einheiten in metrisch (g, ml, EL, TL, Stueck). Nie cups, tbsp, oz.
- Titel unter 45 Zeichen wenn moeglich.
- Tags aus dieser Liste waehlen: eiweissreich, low-carb, vegetarisch, vegan, schnell, meal-prep, suesses, herzhaft, gefuehl-satt, keto-friendly.`;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'POST erforderlich' }, 405);
  }

  const {
    query = 'healthy',
    count = 20,
    minProtein = 15,
    maxCarbs,
    diet,
    skipDuplicates = true,
  }: ImportRequest = await req.json().catch(() => ({}));

  if (!SPOONACULAR_KEY) {
    return json({ error: 'SPOONACULAR_API_KEY fehlt (in Supabase Secrets setzen)' }, 500);
  }

  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) {
    return json({ error: 'ANTHROPIC_API_KEY fehlt (in Supabase Secrets setzen)' }, 500);
  }

  try {
    // 1. Rezepte von Spoonacular ziehen
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_KEY,
      query,
      number: String(Math.min(count, 100)),
      addRecipeInformation: 'true',
      addRecipeNutrition: 'true',
      fillIngredients: 'true',
      instructionsRequired: 'true',
      minProtein: String(minProtein),
    });
    if (maxCarbs) params.set('maxCarbs', String(maxCarbs));
    if (diet) params.set('diet', diet);

    const spoonRes = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?${params}`
    );
    if (!spoonRes.ok) {
      const text = await spoonRes.text();
      return json({ error: `Spoonacular ${spoonRes.status}: ${text.slice(0, 300)}` }, 500);
    }
    const spoonData = await spoonRes.json();
    let recipes: SpoonacularRecipe[] = spoonData.results ?? [];

    if (recipes.length === 0) {
      return json({ imported: 0, skipped: 0, total: 0, message: 'Keine Rezepte gefunden' });
    }

    // Duplikate rausfiltern (bereits importierte Rezepte anhand source_id)
    let skipped = 0;
    if (skipDuplicates) {
      const sourceIds = recipes.map((r) => String(r.id));
      const { data: existing } = await supabase
        .from('recipes')
        .select('source_id')
        .in('source_id', sourceIds);
      const existingIds = new Set((existing ?? []).map((r) => r.source_id));
      const filtered = recipes.filter((r) => !existingIds.has(String(r.id)));
      skipped = recipes.length - filtered.length;
      recipes = filtered;
    }

    if (recipes.length === 0) {
      return json({ imported: 0, skipped, total: skipped, message: 'Alle Rezepte bereits importiert' });
    }

    // 2. Uebersetzen (seriell mit kurzer Pause gegen Rate-Limits)
    const results: Array<{ id: number; status: string; title?: string; error?: string }> = [];
    let firstError: string | null = null;

    for (const recipe of recipes) {
      try {
        const translated = await translateRecipe(recipe);
        const nutrients = extractNutrients(recipe);
        const slug = slugify(translated.title_de) + '-' + recipe.id;

        const { error } = await supabase.from('recipes').upsert(
          {
            slug,
            title: translated.title_de,
            category: translated.category_de,
            minutes: recipe.readyInMinutes,
            servings: recipe.servings,
            kcal: nutrients.kcal,
            protein_g: nutrients.protein,
            carbs_g: nutrients.carbs,
            fat_g: nutrients.fat,
            image_url: recipe.image,
            ingredients: translated.ingredients_de,
            steps: translated.steps_de,
            tags: translated.tags_de,
            source: 'spoonacular',
            source_id: String(recipe.id),
            is_published: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'slug' }
        );

        if (error) {
          results.push({ id: recipe.id, status: 'db-error', error: error.message });
          if (!firstError) firstError = `DB-Fehler bei "${translated.title_de}": ${error.message}`;
        } else {
          results.push({ id: recipe.id, status: 'imported', title: translated.title_de });
        }
      } catch (err) {
        const msg = (err as Error).message ?? String(err);
        results.push({ id: recipe.id, status: 'error', error: msg });
        if (!firstError) firstError = `Uebersetzung fehlgeschlagen bei ID ${recipe.id}: ${msg}`;

        // Bei Auth/Rate-Limit-Fehler abbrechen (macht keinen Sinn 40x zu versuchen)
        if (msg.includes('401') || msg.includes('403') || msg.includes('invalid_api_key')) {
          return json(
            {
              imported: results.filter((r) => r.status === 'imported').length,
              skipped,
              total: recipes.length,
              aborted: true,
              firstError: msg,
              hint: 'Anthropic-API-Key pruefen (Supabase Secrets > ANTHROPIC_API_KEY)',
              results,
            },
            500
          );
        }
      }

      // Kurze Pause gegen Rate-Limits (Anthropic Tier 1 = 50 RPM = 1200ms)
      await sleep(600);
    }

    const imported = results.filter((r) => r.status === 'imported').length;
    return json({
      imported,
      skipped,
      total: recipes.length,
      firstError,
      results,
    });
  } catch (err) {
    console.error('import-recipes error:', err);
    return json({ error: (err as Error).message ?? String(err) }, 500);
  }
});

async function translateRecipe(recipe: SpoonacularRecipe): Promise<TranslatedRecipe> {
  const ingredientsRaw = recipe.extendedIngredients
    .slice(0, 25)
    .map((i) => `- ${i.amount} ${i.unit} ${i.name} (${i.original})`)
    .join('\n');
  const stepsRaw = (recipe.analyzedInstructions[0]?.steps ?? [])
    .slice(0, 15)
    .map((s, i) => `${i + 1}. ${s.step}`)
    .join('\n');
  const dishTypes = (recipe.dishTypes ?? []).join(', ');
  const diets = (recipe.diets ?? []).join(', ');

  const userMsg = `Titel (englisch): ${recipe.title}
Dish-Types: ${dishTypes}
Diets: ${diets}

Zutaten:
${ingredientsRaw}

Zubereitungsschritte:
${stepsRaw}

Uebersetze auf klares Deutsch. Antworte nur mit dem JSON-Objekt, keine Markdown-Fences.`;

  // Haiku 4.5 - schnell, guenstig (~0,001 EUR pro Rezept), fuer Uebersetzung ausreichend
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    system: TRANSLATION_SYSTEM,
    messages: [{ role: 'user', content: userMsg }],
  });

  const block = response.content[0];
  if (!block || block.type !== 'text') {
    throw new Error('Unerwarteter Antworttyp von Claude');
  }
  const cleaned = block.text.replace(/```json\n?|```/g, '').trim();
  try {
    return JSON.parse(cleaned) as TranslatedRecipe;
  } catch {
    throw new Error('JSON-Parse fehlgeschlagen — Antwort: ' + cleaned.slice(0, 200));
  }
}

function extractNutrients(recipe: SpoonacularRecipe): {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  const nutrients = recipe.nutrition?.nutrients ?? [];
  const find = (name: string) =>
    Math.round(nutrients.find((n) => n.name === name)?.amount ?? 0);
  return {
    kcal: find('Calories'),
    protein: find('Protein'),
    carbs: find('Carbohydrates'),
    fat: find('Fat'),
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
