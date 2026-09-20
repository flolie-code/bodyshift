import { useColorScheme } from 'react-native';
import { lightColors, darkColors, type ColorPalette } from '@/constants/theme';

export function useTheme(): {
  colors: ColorPalette;
  isDark: boolean;
} {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
  };
}
