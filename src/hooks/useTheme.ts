import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type ColorPalette } from '@/constants/theme';

export function useTheme(): {
  colors: ColorPalette;
  isDark: boolean;
} {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors: ColorPalette = isDark ? darkColors : lightColors;
  return { colors, isDark };
}
