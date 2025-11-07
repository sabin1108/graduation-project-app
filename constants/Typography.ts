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

export const TextStyles = {
  // Headings
  h1: {
    fontFamily: FontFamily.primaryBold,
    fontSize: 24,
    lineHeight: 24 * 1.25, // tight: 1.25
    letterSpacing: -0.5,
    color: Colors.neutral.gray900,
  },
  h2: {
    fontFamily: FontFamily.primaryBold,
    fontSize: 20,
    lineHeight: 20 * 1.25, // tight: 1.25
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: FontFamily.primaryBold, // Design guide specifies Pretendard-Bold for heading
    fontSize: 18,
    lineHeight: 18 * 1.25, // tight: 1.25
    letterSpacing: -0.2,
    color: Colors.neutral.gray900,
  },
  
  // Body Text
  body: { // Renamed from body1 to body
    fontFamily: FontFamily.primary,
    fontSize: 16,
    lineHeight: 16 * 1.6, // relaxed: 1.6
    letterSpacing: 0,
    color: Colors.neutral.gray800,
  },
  small: { // Renamed from body2 to small
    fontFamily: FontFamily.primary,
    fontSize: 14,
    lineHeight: 14 * 1.5, // normal: 1.5
    letterSpacing: 0,
    color: Colors.neutral.gray700,
  },
  
  // Caption & Small Text
  tiny: { // Renamed from caption to tiny
    fontFamily: FontFamily.primary,
    fontSize: 12,
    lineHeight: 12 * 1.5, // normal: 1.5
    letterSpacing: 0.3,
    color: Colors.neutral.gray500,
  },
  overline: {
    fontFamily: FontFamily.primaryMedium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1,
    color: Colors.neutral.gray500,
    textTransform: 'uppercase',
  },
  
  // Button Text
  button: {
    fontFamily: FontFamily.primaryMedium,
    fontSize: 14,
    lineHeight: 14 * 1.5, // normal: 1.5
    letterSpacing: 0.5,
    color: Colors.neutral.white,
    textTransform: 'none',
  },
} as const;