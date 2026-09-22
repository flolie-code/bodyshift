import { supabase } from './supabase';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Meal = {
  id: string;
  logged_at: string;
  meal_type: MealType;
  name: string;
  amount_grams: number | null;
  kcal: number;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  source: 'manual' | 'barcode' | 'photo_ai' | 'voice' | 'recipe';
  photo_url: string | null;
  ai_confidence: number | null;
};

export type DayTotals = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

/** Alle Mahlzeiten für ein bestimmtes Datum laden */
export async function listMealsForDate(dateISO: string): Promise<Meal[]> {
  const start = `${dateISO}T00:00:00.000Z`;
  const end = `${dateISO}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .gte('logged_at', start)
    .lte('logged_at', end)
    .order('logged_at', { ascending: true });

  if (error) throw new Error(`Mahlzeiten laden fehlgeschlagen: ${error.message}`);
  return (data ?? []) as Meal[];
}

/** Neue Mahlzeit anlegen */
export async function addMeal(input: {
  name: string;
  mealType: MealType;
  kcal: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  amountGrams?: number;
  source?: Meal['source'];
}): Promise<Meal> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Nicht eingeloggt');

  const { data, error } = await supabase
    .from('meals')
    .insert({
      user_id: userData.user.id,
      logged_at: new Date().toISOString(),
      meal_type: input.mealType,
      name: input.name,
      kcal: input.kcal,
      protein_g: input.proteinG ?? null,
      carbs_g: input.carbsG ?? null,
      fat_g: input.fatG ?? null,
      amount_grams: input.amountGrams ?? null,
      source: input.source ?? 'manual',
    })
    .select()
    .single();

  if (error) throw new Error(`Speichern fehlgeschlagen: ${error.message}`);
  return data as Meal;
}

/** Mahlzeit löschen */
export async function deleteMeal(id: string): Promise<void> {
  const { error } = await supabase.from('meals').delete().eq('id', id);
  if (error) throw new Error(`Löschen fehlgeschlagen: ${error.message}`);
}

/** Summen für einen Tag berechnen */
export function calcDayTotals(meals: Meal[]): DayTotals {
  return meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + (m.kcal ?? 0),
      protein: acc.protein + (Number(m.protein_g) || 0),
      carbs: acc.carbs + (Number(m.carbs_g) || 0),
      fat: acc.fat + (Number(m.fat_g) || 0),
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/** Emoji-Icon für einen Meal-Type */
export function mealTypeIcon(type: MealType): string {
  return { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }[type];
}

/** Deutscher Name für Meal-Type */
export function mealTypeName(type: MealType): string {
  return { breakfast: 'Frühstück', lunch: 'Mittagessen', dinner: 'Abendessen', snack: 'Snack' }[type];
}

/** Meal-Type automatisch aus der aktuellen Uhrzeit ableiten */
export function suggestMealType(now = new Date()): MealType {
  const h = now.getHours();
  if (h < 10) return 'breakfast';
  if (h < 14) return 'lunch';
  if (h < 20) return 'dinner';
  return 'snack';
}
