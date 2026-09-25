// Supabase Edge Function: import-recipes
//
// Holt Rezepte von Spoonacular, übersetzt Titel/Zutaten/Schritte
// via Claude auf Deutsch (mit Bezug zu BodyShift-Vibe), speichert in Supabase.
//
// Einmaliger Aufruf pro Import-Batch. Rezepte danach in Supabase gecached.
//
// Aufruf: POST mit { query?: string, count?: number, minProtein?: number }
// z.B. { "query": "high protein", "count": 50, "minProtein": 25 }
//
// Deploy: supabase functions deploy import-recipes
// Secrets: supabase secrets set SPOONACULAR_API_KEY=... ANTHROPIC_API_KEY=sk-ant-...

import Anthropic from 'npm:@anthropic-ai/sdk@^0.127.0';
import { createClient } from 'npm:@supabase/supabase-js@2';

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY') ?? '',
});

const SPOONACULAR_KEY = Deno.env.get('SPOONACULAR_API_KEY') ?? '';

// Service-Role-Client — darf ohne RLS in `recipes` schreiben
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

const TRANSLATION_SYSTEM = `Du bist der Content-Editor der BodyShift Companion App (Deutsch/Österreich).
Übersetze englische Rezepte auf klares, alltagstaugliches Deutsch — kein AI-Sprech, kein "Chef-Deutsch".
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
  "category_de": "Frühstück|Mittagessen|Abendessen|Snack|Süßes",
  "tags_de": ["eiweißreich", "schnell", "vegetarisch"]
}

Regeln:
- Einheiten in metrisch (g, ml, EL, TL, Stück). Nie cups, tbsp, oz.
- Titel unter 45 Zeichen wenn möglich.
- Tags aus dieser Liste wählen: eiweißreich, low-carb, vegetarisch, vegan, schnell (≤15 Min), meal-prep, süßes, herzhaft, gefühl-satt, keto-friendly.`;

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
  }: ImportRequest = await req.json().catch(() => ({}));

  if (!SPOONACULAR_KEY) {
    return json({ error: 'SPOONACULAR_API_KEY fehlt (in Supabase Secrets setzen)' }, 500);
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
      throw new Error(`Spoonacular ${spoonRes.status}: ${await spoonRes.text()}`);
    }
    const spoonData = await spoonRes.json();
    const recipes: SpoonacularRecipe[] = spoonData.results ?? [];

    if (recipes.length === 0) {
      return json({ imported: 0, message: 'Keine Rezepte gefunden' });
    }

    // 2. Übersetzen + Nährwerte extrahieren + in Supabase upserten
    const results: Array<{ id: number; status: string; error?: string }> = [];

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

        results.push({
          id: recipe.id,
          status: error ? 'error' : 'imported',
          error: error?.message,
        });
      } catch (err) {
        results.push({
          id: recipe.id,
          status: 'error',
          error: (err as Error).message,
        });
      }
    }

    const imported = results.filter((r) => r.status === 'imported').length;
    return json({ imported, total: recipes.length, results });
  } catch (err) {
    console.error('import-recipes error:', err);
    return json({ error: (err as Error).message }, 500);
  }
});

async function translateRecipe(recipe: SpoonacularRecipe): Promise<TranslatedRecipe> {
  const ingredientsRaw = recipe.extendedIngredients
    .map((i) => `- ${i.amount} ${i.unit} ${i.name} (original: "${i.original}")`)
    .join('\n');
  const stepsRaw = (recipe.analyzedInstructions[0]?.steps ?? [])
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

Übersetze auf klares Deutsch. Antworte nur mit dem JSON-Objekt.`;

  // Sonnet 5 für hochwertige Übersetzung — ~0,01€ pro Rezept
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: 2048,
    system: TRANSLATION_SYSTEM,
    messages: [{ role: 'user', content: userMsg }],
  });

  const block = response.content[0];
  if (block.type !== 'text') {
    throw new Error('Unerwarteter Antworttyp');
  }
  const cleaned = block.text.replace(/```json\n?|```/g, '').trim();
  return JSON.parse(cleaned) as TranslatedRecipe;
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
