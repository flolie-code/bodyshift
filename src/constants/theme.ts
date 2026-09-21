/**
 * BodyShift Design System
 * Farbpalette & Tokens gespiegelt aus dem HTML-Prototyp.
 * Alle Screens nutzen ausschließlich diese Werte.
 */

export const lightColors = {
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
} as const;

export const darkColors = {
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
} as const;

export type ColorPalette = typeof lightColors;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
} as const;

// Für den ersten Test: System-Fonts (kein Custom-Font-Loading nötig).
// Später mit @expo-google-fonts/inter + @expo-google-fonts/fraunces ersetzen.
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
