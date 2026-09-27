import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  ts: string;
};

const STORAGE_KEY = 'bodyshift.coach.chat.v1';
const MAX_STORED = 60; // letzte 60 Nachrichten aufbewahren

/** Chat-Historie laden */
export async function loadChat(): Promise<ChatMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

/** Chat-Historie speichern */
export async function saveChat(messages: ChatMessage[]): Promise<void> {
  const trimmed = messages.slice(-MAX_STORED);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/** Kompletten Chat loeschen */
export async function clearChat(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export type ChatContext = {
  firstName?: string;
  age?: number;
  goalKg?: number;
  currentKg?: number;
  dailyTargetKcal?: number;
  consumedTodayKcal?: number;
  weekRemainingKcal?: number;
  lastMeals?: { name: string; kcal: number; when: string }[];
  weightTrend7d?: number;
  weightTrend30d?: number;
};

/** Eine Nachricht an Jana senden, Antwort zurueckbekommen */
export async function askJana(
  message: string,
  history: ChatMessage[],
  context: ChatContext
): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ reply: string; error?: string }>(
    'chat-jana',
    {
      body: {
        message,
        history: history.map((m) => ({ role: m.role, content: m.content })),
        context,
      },
    }
  );

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Keine Antwort erhalten');
  if (data.error) throw new Error(data.error);
  if (!data.reply) throw new Error('Leere Antwort von Jana');
  return data.reply;
}

/** Kontext aus Supabase zusammenstellen (letzte Meals, Profil, Gewicht) */
export async function buildContext(): Promise<ChatContext> {
  const ctx: ChatContext = {};

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return ctx;

  // Profil
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, age, goal_kg, target_kcal_daily')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  if (profile) {
    ctx.firstName = profile.first_name ?? undefined;
    ctx.age = profile.age ?? undefined;
    ctx.goalKg = profile.goal_kg ?? undefined;
    ctx.dailyTargetKcal = profile.target_kcal_daily ?? undefined;
  }

  // Aktuelles Gewicht + Trends
  const { data: weights } = await supabase
    .from('weight_entries')
    .select('recorded_on, weight_kg')
    .order('recorded_on', { ascending: false })
    .limit(35);
  if (weights && weights.length > 0) {
    const current = weights[0].weight_kg;
    ctx.currentKg = current;
    const now = Date.now();
    const day = 86400000;
    const w7 = weights.find(
      (w) => new Date(w.recorded_on).getTime() < now - 7 * day
    );
    const w30 = weights.find(
      (w) => new Date(w.recorded_on).getTime() < now - 30 * day
    );
    if (w7) ctx.weightTrend7d = +(current - w7.weight_kg).toFixed(1);
    if (w30) ctx.weightTrend30d = +(current - w30.weight_kg).toFixed(1);
  }

  // Heute-Meals
  const today = new Date().toISOString().slice(0, 10);
  const start = `${today}T00:00:00.000Z`;
  const end = `${today}T23:59:59.999Z`;
  const { data: meals } = await supabase
    .from('meals')
    .select('name, kcal, logged_at, meal_type')
    .gte('logged_at', start)
    .lte('logged_at', end)
    .order('logged_at', { ascending: true });
  if (meals) {
    ctx.consumedTodayKcal = meals.reduce((s, m) => s + (m.kcal ?? 0), 0);
    ctx.lastMeals = meals.slice(-4).map((m) => ({
      name: m.name,
      kcal: m.kcal,
      when: mealTypeLabel(m.meal_type),
    }));
  }

  // Wochenrest
  if (ctx.dailyTargetKcal) {
    const weekBudget = ctx.dailyTargetKcal * 7;
    const monday = new Date();
    const dow = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - dow);
    monday.setHours(0, 0, 0, 0);
    const { data: weekMeals } = await supabase
      .from('meals')
      .select('kcal')
      .gte('logged_at', monday.toISOString());
    const weekConsumed = (weekMeals ?? []).reduce((s, m) => s + (m.kcal ?? 0), 0);
    ctx.weekRemainingKcal = weekBudget - weekConsumed;
  }

  return ctx;
}

function mealTypeLabel(type: string): string {
  return (
    { breakfast: 'Fruehstueck', lunch: 'Mittag', dinner: 'Abend', snack: 'Snack' }[type] ??
    'Mahlzeit'
  );
}
