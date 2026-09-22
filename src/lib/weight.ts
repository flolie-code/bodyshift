import { supabase } from './supabase';

export type WeightEntry = {
  id: string;
  recorded_on: string; // yyyy-mm-dd
  weight_kg: number;
  note: string | null;
};

/** Alle Gewichts-Eintraege des Users, aeltester zuerst */
export async function listWeightEntries(limit = 180): Promise<WeightEntry[]> {
  const { data, error } = await supabase
    .from('weight_entries')
    .select('*')
    .order('recorded_on', { ascending: true })
    .limit(limit);
  if (error) throw new Error(`Gewicht laden fehlgeschlagen: ${error.message}`);
  return (data ?? []) as WeightEntry[];
}

/** Neuer Eintrag; wenn bereits einer fuer heute existiert, wird er aktualisiert */
export async function upsertWeight(input: {
  weightKg: number;
  note?: string;
  dateISO?: string; // default heute
}): Promise<WeightEntry> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Nicht eingeloggt');

  const date = input.dateISO ?? new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('weight_entries')
    .upsert(
      {
        user_id: userData.user.id,
        recorded_on: date,
        weight_kg: input.weightKg,
        note: input.note ?? null,
      },
      { onConflict: 'user_id,recorded_on' }
    )
    .select()
    .single();

  if (error) throw new Error(`Speichern fehlgeschlagen: ${error.message}`);
  return data as WeightEntry;
}

export async function deleteWeight(id: string): Promise<void> {
  const { error } = await supabase.from('weight_entries').delete().eq('id', id);
  if (error) throw new Error(`Loeschen fehlgeschlagen: ${error.message}`);
}

export type WeightStats = {
  latest: number | null;
  start: number | null;
  delta7: number | null;
  delta30: number | null;
  totalDelta: number | null;
  min: number | null;
  max: number | null;
};

/** Wichtige Kennzahlen aus einer Reihe von Eintraegen (aufsteigend sortiert) */
export function calcWeightStats(entries: WeightEntry[]): WeightStats {
  if (entries.length === 0) {
    return { latest: null, start: null, delta7: null, delta30: null, totalDelta: null, min: null, max: null };
  }
  const first = entries[0].weight_kg;
  const last = entries[entries.length - 1].weight_kg;
  const now = new Date();
  const cutoff = (days: number) => {
    const d = new Date(now);
    d.setDate(now.getDate() - days);
    return d.toISOString().slice(0, 10);
  };
  const before7 = [...entries].reverse().find((e) => e.recorded_on <= cutoff(7));
  const before30 = [...entries].reverse().find((e) => e.recorded_on <= cutoff(30));

  const weights = entries.map((e) => e.weight_kg);
  return {
    latest: last,
    start: first,
    delta7: before7 ? +(last - before7.weight_kg).toFixed(1) : null,
    delta30: before30 ? +(last - before30.weight_kg).toFixed(1) : null,
    totalDelta: +(last - first).toFixed(1),
    min: Math.min(...weights),
    max: Math.max(...weights),
  };
}
