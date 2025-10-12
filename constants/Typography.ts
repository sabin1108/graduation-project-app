import { Colors } from './theme';

export const FontFamily = {
  // 한글: Pretendard (무료, Google Fonts)
  primary: 'Pretendard-Regular',
  primaryBold: 'Pretendard-Bold',
  primaryMedium: 'Pretendard-Medium', // Assuming Pretendard-Medium exists
  
  // 영문/숫자: Inter (무료, Google Fonts) - Keeping for now, but not in design guide
  secondary: 'Inter-Regular',
  secondaryBold: 'Inter-Bold',
  secondaryMedium: 'Inter-Medium',
  
  // 코드: Fira Code (무료, Google Fonts) - Keeping for now, but not in design guide
  monospace: 'FiraCode-Regular',
} as const;

const baseFontSizes = {
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  small: 14,
  tiny: 12,
  overline: 11,
  button: 14,
};

export const createTextStyles = (size: number = 1) => {
  const multiplier = size;
  const scaledSize = (base: number) => Math.round(base * multiplier);

  return {
    // Headings
    h1: {
      fontFamily: FontFamily.primaryBold,
      fontSize: scaledSize(baseFontSizes.h1),
      lineHeight: scaledSize(baseFontSizes.h1) * 1.25,
      letterSpacing: -0.5,
      color: Colors.neutral.gray900,
    },
    h2: {
      fontFamily: FontFamily.primaryBold,
      fontSize: scaledSize(baseFontSizes.h2),
      lineHeight: scaledSize(baseFontSizes.h2) * 1.25,
      letterSpacing: -0.3,
    },
    h3: {
      fontFamily: FontFamily.primaryBold,
      fontSize: scaledSize(baseFontSizes.h3),
      lineHeight: scaledSize(baseFontSizes.h3) * 1.25,
      letterSpacing: -0.2,
      color: Colors.neutral.gray900,
    },
    
    // Body Text
    body: {
      fontFamily: FontFamily.primary,
      fontSize: scaledSize(baseFontSizes.body),
      lineHeight: scaledSize(baseFontSizes.body) * 1.6,
      letterSpacing: 0,
      color: Colors.neutral.gray800,
    },
    small: {
      fontFamily: FontFamily.primary,
      fontSize: scaledSize(baseFontSizes.small),
      lineHeight: scaledSize(baseFontSizes.small) * 1.5,
      letterSpacing: 0,
      color: Colors.neutral.gray700,
    },
    
    // Caption & Small Text
    tiny: {
      fontFamily: FontFamily.primary,
      fontSize: scaledSize(baseFontSizes.tiny),
      lineHeight: scaledSize(baseFontSizes.tiny) * 1.5,
      letterSpacing: 0.3,
      color: Colors.neutral.gray500,
    },
    overline: {
      fontFamily: FontFamily.primaryMedium,
      fontSize: scaledSize(baseFontSizes.overline),
      lineHeight: scaledSize(baseFontSizes.overline) * 1.5,
      letterSpacing: 1,
      color: Colors.neutral.gray500,
      textTransform: 'uppercase',
    },
    
    // Button Text
    button: {
      fontFamily: FontFamily.primaryMedium,
      fontSize: scaledSize(baseFontSizes.button),
      lineHeight: scaledSize(baseFontSizes.button) * 1.5,
      letterSpacing: 0.5,
      color: Colors.neutral.white,
      textTransform: 'none',
    },
  };
};

export const TextStyles = createTextStyles(); // Default export for existing components