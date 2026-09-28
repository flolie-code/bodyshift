// Supabase Edge Function: generate-recipe-image
//
// Generiert per DALL-E 3 ein hochwertiges Rezept-Bild und speichert es
// im Storage-Bucket "recipe-images". Updated recipes.image_url.
//
// Aufruf: POST { recipeId?: string, batch?: number, force?: boolean }
//   recipeId: einzelnes Rezept regenerieren
//   batch: bis zu N Rezepte OHNE image_url oder mit Spoonacular-URL neu-generieren
//   force: auch Rezepte mit bereits ki-generiertem Bild neu machen
//
// Deploy: supabase functions deploy generate-recipe-image
// Secrets: OPENAI_API_KEY (fuer DALL-E 3)

import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';

interface RequestBody {
  recipeId?: string;
  batch?: number;
  force?: boolean;
}

interface RecipeRow {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  ingredients: Array<{ name: string }> | null;
  image_url: string | null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return json({ error: 'POST erforderlich' }, 405);
    }
    if (!OPENAI_KEY) {
      return json(
        {
          error: 'OPENAI_API_KEY fehlt. In Supabase Secrets setzen.',
          hint: 'Key holen auf https://platform.openai.com/api-keys',
        },
        500
      );
    }

    const body = (await req.json().catch(() => ({}))) as RequestBody;

    // Modus 1: einzelnes Rezept
    if (body.recipeId) {
      const { data: recipe, error } = await supabase
        .from('recipes')
        .select('id, slug, title, category, ingredients, image_url')
        .eq('id', body.recipeId)
        .single();
      if (error || !recipe) {
        return json({ error: `Rezept ${body.recipeId} nicht gefunden` }, 404);
      }
      const result = await generateForRecipe(recipe as RecipeRow);
      return json({ processed: 1, ...result });
    }

    // Modus 2: Batch — Rezepte die noch kein KI-Bild haben
    const batchSize = Math.min(body.batch ?? 5, 10);
    let query = supabase
      .from('recipes')
      .select('id, slug, title, category, ingredients, image_url')
      .limit(batchSize);

    if (!body.force) {
      // Nur Rezepte OHNE ki_image_url (also image_url zeigt noch auf externe URL wie spoonacular.com)
      // Wir markieren KI-Bilder durch das Storage-Bucket-Prefix
      query = query.not('image_url', 'like', '%/recipe-images/%');
    }

    const { data: recipes, error } = await query;
    if (error) return json({ error: error.message }, 500);
    if (!recipes || recipes.length === 0) {
      return json({ processed: 0, message: 'Keine Rezepte zum Verarbeiten' });
    }

    const results: Array<{ id: string; title: string; status: string; error?: string; url?: string }> = [];
    for (const r of recipes) {
      const result = await generateForRecipe(r as RecipeRow);
      results.push({ id: r.id, title: r.title, ...result });
      await sleep(1500); // sanftes Rate-Limit gegen OpenAI
    }

    const success = results.filter((r) => r.status === 'ok').length;
    return json({
      processed: recipes.length,
      success,
      failed: recipes.length - success,
      results,
    });
  } catch (err) {
    console.error('generate-recipe-image error:', err);
    return json({ error: (err as Error).message ?? String(err) }, 500);
  }
});

async function generateForRecipe(recipe: RecipeRow): Promise<{
  status: 'ok' | 'error';
  error?: string;
  url?: string;
}> {
  try {
    const prompt = buildFoodPrompt(recipe);

    // 1. DALL-E 3 Bild generieren
    const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'b64_json',
      }),
    });

    if (!dalleRes.ok) {
      const text = await dalleRes.text();
      return { status: 'error', error: `DALL-E ${dalleRes.status}: ${text.slice(0, 300)}` };
    }

    const dalleData = await dalleRes.json();
    const b64 = dalleData.data?.[0]?.b64_json;
    if (!b64) return { status: 'error', error: 'Keine Bild-Daten von DALL-E' };

    // 2. Base64 zu Uint8Array
    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 3. In Supabase Storage hochladen
    const path = `${recipe.slug}-${Date.now()}.png`;
    const { error: uploadErr } = await supabase.storage
      .from('recipe-images')
      .upload(path, bytes, {
        contentType: 'image/png',
        upsert: true,
      });
    if (uploadErr) return { status: 'error', error: `Upload: ${uploadErr.message}` };

    // 4. Public URL holen
    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    // 5. In recipes-Tabelle updaten
    const { error: updateErr } = await supabase
      .from('recipes')
      .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', recipe.id);
    if (updateErr) return { status: 'error', error: `Update: ${updateErr.message}` };

    return { status: 'ok', url: publicUrl };
  } catch (err) {
    return { status: 'error', error: (err as Error).message ?? String(err) };
  }
}

function buildFoodPrompt(recipe: RecipeRow): string {
  const cat = (recipe.category ?? '').toLowerCase();
  const ingredients = (recipe.ingredients ?? [])
    .slice(0, 4)
    .map((i) => i.name)
    .join(', ');

  // Stil-Anker: professionelle Food-Fotografie, konsistent ueber alle Bilder
  const styleAnchor =
    'Professional overhead food photography, natural daylight, minimalist ceramic plate, ' +
    'linen tablecloth in warm cream color, soft shadows, appetizing composition, ' +
    'high-end restaurant styling, magazine quality, shallow depth of field, no text, no watermark';

  let scene = recipe.title;
  if (ingredients) {
    scene += ` featuring ${ingredients}`;
  }

  // Kategorie-spezifische Feinabstimmung
  if (cat.includes('fruehstueck') || cat.includes('breakfast')) {
    scene += ', morning breakfast setting, coffee cup blurred in background';
  } else if (cat.includes('snack') || cat.includes('suesses')) {
    scene += ', small snack portion, elegant presentation';
  }

  return `${scene}. ${styleAnchor}.`;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
