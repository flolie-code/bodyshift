import { supabase } from './supabase';

export type DetectedItem = {
  name: string;
  amountGrams: number;
  confidence: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type MealScanResult = {
  items: DetectedItem[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  overallConfidence: number;
  rawResponse?: string;
};

/**
 * Sendet ein Foto einer Mahlzeit an die Supabase Edge Function
 * `analyze-meal`, die intern Claude Vision aufruft.
 *
 * Der ANTHROPIC_API_KEY liegt AUSSCHLIESSLICH im Backend
 * (Supabase Edge Function Env), niemals im Frontend.
 */
export async function analyzeMealPhoto(base64Image: string): Promise<MealScanResult> {
  const { data, error } = await supabase.functions.invoke<MealScanResult>('analyze-meal', {
    body: { imageBase64: base64Image },
  });

  if (error) {
    throw new Error(`KI-Analyse fehlgeschlagen: ${error.message}`);
  }
  if (!data) {
    throw new Error('Keine Daten von KI-Analyse erhalten');
  }
  return data;
}
