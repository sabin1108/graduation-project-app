import { Colors } from '@/constants/theme';

/**
 * A hook that returns the appropriate color palette.
 * Since we removed dark mode, it always returns the light theme.
 */
export function useAppTheme() {
  return Colors;
}

type ThemeProps = {
  light?: string;
  dark?: string; // Kept for prop compatibility, but not used
};

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors.neutral
) {
  const colorFromProps = props.light;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Fallback to the theme's color if not provided in props
    return Colors.neutral[colorName];
  }
}
