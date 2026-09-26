/**
 * BodyShift Design System
 * Warme, weiche Palette. Drei Varianten koennen per PALETTE_VARIANT
 * geschaltet werden — der Rest der App zieht automatisch nach.
 *
 * Aktuell: 'current' (die urspruengliche Petrol-Palette).
 * Moegliche Wechsel (nach Entscheidung des Kunden):
 *   'creme'  — Sand + Salbei-Gruen (spa-artig, sehr weich)
 *   'petrol' — Off-White + sanftes Petrol (klarer, moderner)
 *   'terra'  — warm-beige + Terracotta (mediterran, appetitanregend)
 */

export type PaletteVariant = 'current' | 'creme' | 'petrol' | 'terra';
export const PALETTE_VARIANT: PaletteVariant = 'current';

export type ColorPalette = {
  bg: string;
  stage: string;
  surface: string;
  surfaceAlt: string;
  surfaceDeep: string;
  ink: string;
  inkSoft: string;
  inkMute: string;
  line: string;
  lineSoft: string;
  brand: string;
  brand2: string;
  brandInk: string;
  accent: string;
  accentSoft: string;
  protein: string;
  carbs: string;
  fat: string;
  success: string;
  track: string;
  janaBubble: string;
};

// ============ CURRENT (Petrol, dunkel) — Ausgangsstand ============
const currentLight: ColorPalette = {
  bg: '#EFEAE1',
  stage: '#E7E0D3',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F0E7',
  surfaceDeep: '#E3DBC9',
  ink: '#14211F',
  inkSoft: '#4C5A57',
  inkMute: '#8A928E',
  line: '#DDD5C4',
  lineSoft: '#EAE3D3',
  brand: '#143A3F',
  brand2: '#2C6E70',
  brandInk: '#F7F3EA',
  accent: '#D96A3B',
  accentSoft: '#F4CEB8',
  protein: '#B84A3E',
  carbs: '#D89A3A',
  fat: '#6E8E5F',
  success: '#4E8A5E',
  track: '#E6DEC9',
  janaBubble: 'rgba(20,58,63,0.08)',
};
const currentDark: ColorPalette = {
  bg: '#0E1817',
  stage: '#14201E',
  surface: '#1B2826',
  surfaceAlt: '#22302E',
  surfaceDeep: '#0F1B1A',
  ink: '#EFEBE0',
  inkSoft: '#B7BFBC',
  inkMute: '#7A8683',
  line: '#2B3A38',
  lineSoft: '#22302E',
  brand: '#4FA5A8',
  brand2: '#7BC4C6',
  brandInk: '#0E1817',
  accent: '#E88A5F',
  accentSoft: '#6B3B23',
  protein: '#E56A5D',
  carbs: '#E9B95E',
  fat: '#9AB988',
  success: '#7BC48A',
  track: '#2B3A38',
  janaBubble: 'rgba(79,165,168,0.14)',
};

// ============ CREME — Sand + Salbei-Gruen ============
const cremeLight: ColorPalette = {
  bg: '#F5F0E7',
  stage: '#EDE6D7',
  surface: '#FFFFFF',
  surfaceAlt: '#EDE6D7',
  surfaceDeep: '#E3DBC9',
  ink: '#2A2E28',
  inkSoft: '#5A5E56',
  inkMute: '#8A8E85',
  line: '#E3DDD1',
  lineSoft: '#EEE7D8',
  brand: '#7BA098',
  brand2: '#95B6AD',
  brandInk: '#F5F0E7',
  accent: '#C9663A',
  accentSoft: '#F1D0BB',
  protein: '#B84A3E',
  carbs: '#D89A3A',
  fat: '#7BA098',
  success: '#5A9770',
  track: '#E3DDD1',
  janaBubble: 'rgba(123,160,152,0.12)',
};
const cremeDark: ColorPalette = {
  bg: '#181A17',
  stage: '#1F221E',
  surface: '#252924',
  surfaceAlt: '#2A2E28',
  surfaceDeep: '#1A1D19',
  ink: '#EEE9DE',
  inkSoft: '#B7BEB6',
  inkMute: '#7A8079',
  line: '#33372F',
  lineSoft: '#2A2E28',
  brand: '#95B6AD',
  brand2: '#B0CDC4',
  brandInk: '#181A17',
  accent: '#E8875B',
  accentSoft: '#5C3320',
  protein: '#E56A5D',
  carbs: '#E9B95E',
  fat: '#9AB988',
  success: '#7BC48A',
  track: '#33372F',
  janaBubble: 'rgba(149,182,173,0.14)',
};

// ============ PETROL — Off-White + sanftes Petrol ============
const petrolLight: ColorPalette = {
  bg: '#FBFAF7',
  stage: '#F1EDE4',
  surface: '#FFFFFF',
  surfaceAlt: '#F1EDE4',
  surfaceDeep: '#E7E1D3',
  ink: '#14211F',
  inkSoft: '#4C5A57',
  inkMute: '#7A8683',
  line: '#E4DED0',
  lineSoft: '#EEE9DC',
  brand: '#4A7A80',
  brand2: '#6C9CA1',
  brandInk: '#FBFAF7',
  accent: '#D96A3B',
  accentSoft: '#F4CEB8',
  protein: '#B84A3E',
  carbs: '#D89A3A',
  fat: '#6E8E5F',
  success: '#4E8A5E',
  track: '#E7E1D3',
  janaBubble: 'rgba(74,122,128,0.10)',
};
const petrolDark: ColorPalette = {
  bg: '#0F1516',
  stage: '#141C1D',
  surface: '#1B2426',
  surfaceAlt: '#222D2F',
  surfaceDeep: '#0F1717',
  ink: '#EEEBE1',
  inkSoft: '#B0B7B5',
  inkMute: '#7A8380',
  line: '#293636',
  lineSoft: '#222D2F',
  brand: '#6C9CA1',
  brand2: '#95BDC1',
  brandInk: '#0F1516',
  accent: '#E88A5F',
  accentSoft: '#6B3B23',
  protein: '#E56A5D',
  carbs: '#E9B95E',
  fat: '#9AB988',
  success: '#7BC48A',
  track: '#293636',
  janaBubble: 'rgba(108,156,161,0.14)',
};

// ============ TERRA — Beige + Terracotta-Fokus ============
const terraLight: ColorPalette = {
  bg: '#EFE8DC',
  stage: '#E7DFCE',
  surface: '#FBF7EE',
  surfaceAlt: '#E7DFCE',
  surfaceDeep: '#DFD1B8',
  ink: '#3A2E24',
  inkSoft: '#5D4E3F',
  inkMute: '#7C6E5F',
  line: '#E2D7C3',
  lineSoft: '#EDE4D0',
  brand: '#C9663A',
  brand2: '#DE855D',
  brandInk: '#FBF7EE',
  accent: '#B8916A',
  accentSoft: '#F1D0BB',
  protein: '#A34A38',
  carbs: '#C08F35',
  fat: '#7B966B',
  success: '#6B9464',
  track: '#DFD1B8',
  janaBubble: 'rgba(201,102,58,0.10)',
};
const terraDark: ColorPalette = {
  bg: '#171412',
  stage: '#1E1A16',
  surface: '#26221C',
  surfaceAlt: '#2A2620',
  surfaceDeep: '#1A1613',
  ink: '#F0E7D6',
  inkSoft: '#BAAF9B',
  inkMute: '#82766A',
  line: '#3A3128',
  lineSoft: '#2A2620',
  brand: '#DE855D',
  brand2: '#E9A583',
  brandInk: '#171412',
  accent: '#DABE9A',
  accentSoft: '#5C3320',
  protein: '#E56A5D',
  carbs: '#E9B95E',
  fat: '#9AB988',
  success: '#7BC48A',
  track: '#3A3128',
  janaBubble: 'rgba(222,133,93,0.14)',
};

const VARIANTS: Record<PaletteVariant, { light: ColorPalette; dark: ColorPalette }> = {
  current: { light: currentLight, dark: currentDark },
  creme: { light: cremeLight, dark: cremeDark },
  petrol: { light: petrolLight, dark: petrolDark },
  terra: { light: terraLight, dark: terraDark },
};

export const lightColors: ColorPalette = VARIANTS[PALETTE_VARIANT].light;
export const darkColors: ColorPalette = VARIANTS[PALETTE_VARIANT].dark;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
} as const;

// System-Fonts als Fallback; spaeter mit Google Fonts (Fraunces + Inter) ersetzen.
export const fonts = {
  sans: undefined as unknown as string,
  sansBold: undefined as unknown as string,
  serif: undefined as unknown as string,
  serifMedium: undefined as unknown as string,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;
