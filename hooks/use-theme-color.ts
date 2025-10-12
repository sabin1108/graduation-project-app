import { useColorScheme } from './use-color-scheme';
import { Colors, DarkColors } from '@/constants/theme';

/**
 * A hook that returns the appropriate color palette based on the current color scheme.
 */
export function useAppTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? DarkColors : Colors;
}

type ThemeProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors.neutral | keyof typeof DarkColors.neutral
) {
  const colorScheme = useColorScheme();
  const colorFromProps = props[colorScheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Fallback to the theme's color if not provided in props
    const themeColors = colorScheme === 'dark' ? DarkColors : Colors;
    // @ts-ignore
    return themeColors.neutral[colorName];
  }
}
