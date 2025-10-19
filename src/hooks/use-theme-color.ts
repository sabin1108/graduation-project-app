import { useColorScheme } from './use-color-scheme';
import { Colors, DarkColors } from '@/constants/theme';

/**
 * 현재 색상 구성표에 따라 적절한 색상 팔레트를 반환하는 후크입니다.
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
    // props에 제공되지 않은 경우 테마의 색상으로 대체합니다.
    const themeColors = colorScheme === 'dark' ? DarkColors : Colors;
    // @ts-ignore
    return themeColors.neutral[colorName];
  }
}
