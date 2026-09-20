/**
 * Nährwert-Berechnungen für BodyShift.
 * Basis: Mifflin-St Jeor Formel (Standard für Gewichtsmanagement).
 */

export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type GoalPace = 'gentle' | 'moderate' | 'ambitious';

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** Grundumsatz — kcal pro Tag in Ruhe */
export function calcBMR(params: {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  ageYears: number;
}): number {
  const { sex, weightKg, heightCm, ageYears } = params;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return Math.round(sex === 'male' ? base + 5 : base - 161);
}

/** Gesamtumsatz — inkl. Aktivität */
export function calcTDEE(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIER[activity]);
}

/** Tägliches Kalorien-Ziel basierend auf Wunschgewicht und Tempo */
export function calcDailyTarget(params: {
  tdee: number;
  currentWeightKg: number;
  targetWeightKg: number;
  pace: GoalPace;
}): { dailyKcal: number; weeklyKcal: number; weeksToGoal: number } {
  const { tdee, currentWeightKg, targetWeightKg, pace } = params;
  const paceMap: Record<GoalPace, number> = {
    gentle: 300,
    moderate: 500,
    ambitious: 700,
  };
  const deficit = paceMap[pace];
  const isLosing = targetWeightKg < currentWeightKg;
  const dailyKcal = Math.max(1200, tdee + (isLosing ? -deficit : deficit));

  const kgToChange = Math.abs(targetWeightKg - currentWeightKg);
  const kcalPerKg = 7700;
  const weeksToGoal = Math.round((kgToChange * kcalPerKg) / (deficit * 7));

  return {
    dailyKcal,
    weeklyKcal: dailyKcal * 7,
    weeksToGoal,
  };
}

/** Makro-Verteilung (30% Protein, 40% Carbs, 30% Fett) */
export function calcMacros(dailyKcal: number): {
  protein: number;
  carbs: number;
  fat: number;
} {
  return {
    protein: Math.round((dailyKcal * 0.3) / 4),
    carbs: Math.round((dailyKcal * 0.4) / 4),
    fat: Math.round((dailyKcal * 0.3) / 9),
  };
}
