import { supabase } from './supabase';

export type WaterEntry = {
  id: string;
  logged_at: string;
  amount_ml: number;
};

export const DAILY_WATER_GOAL_ML = 2500;

/** Wasser-Eintraege fuer heute laden */
export async function getTodayWaterMl(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const start = `${today}T00:00:00.000Z`;
  const end = `${today}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from('water_entries')
    .select('amount_ml')
    .gte('logged_at', start)
    .lte('logged_at', end);

  if (error) return 0;
  return (data ?? []).reduce((s, e) => s + (e.amount_ml ?? 0), 0);
}

/** Wasser hinzufuegen */
export async function addWater(amountMl: number): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Nicht eingeloggt');

  const { error } = await supabase.from('water_entries').insert({
    user_id: userData.user.id,
    logged_at: new Date().toISOString(),
    amount_ml: amountMl,
  });
  if (error) throw new Error(`Wasser speichern fehlgeschlagen: ${error.message}`);
}
