import { supabase } from './supabase';

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  minutes: number | null;
  kcal: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  servings: number | null;
  image_url: string | null;
  ingredients: Array<{ name: string; amount: number; unit: string }>;
  steps: string[];
  tags: string[];
  source: 'bodyshift' | 'spoonacular' | 'user_submitted';
};

/** Alle veröffentlichten Rezepte, optional nach Kategorie / Tag / Suche filtern. */
export async function listRecipes(opts: {
  category?: string;
  tag?: string;
  search?: string;
  limit?: number;
} = {}): Promise<Recipe[]> {
  let query = supabase
    .from('recipes')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 50);

  if (opts.category) query = query.eq('category', opts.category);
  if (opts.tag) query = query.contains('tags', [opts.tag]);
  if (opts.search) query = query.ilike('title', `%${opts.search}%`);

  const { data, error } = await query;
  if (error) throw new Error(`Rezepte laden fehlgeschlagen: ${error.message}`);
  return (data ?? []) as Recipe[];
}

export async function getRecipe(slug: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Recipe | null;
}
