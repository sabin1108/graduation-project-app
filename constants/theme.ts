export const Colors = {
  // Primary - 신뢰감 있는 딥 블루
  primary: {
    main: '#1E3A8A',      // 메인 브랜드 컬러
    light: '#3B82F6',     // 액센트, 버튼
    dark: '#1E3A8A',      // Darker Navy (using main for now)
  },
  
  // Secondary Colors (강조 컬러) - Using accent from design guide
  secondary: {
    main: '#06B6D4',      // Cyan (시안) - Accent
    light: '#22D3EE',     // Light Cyan
    dark: '#0891B2',      // Dark Cyan
  },
  
  // Neutral Colors (배경 및 텍스트)
  neutral: {
    white: '#FFFFFF',
    gray50: '#F8FAFC',    // App background
    gray100: '#F1F5F9',   // AI message background
    gray200: '#E2E8F0',   // Border color
    gray300: '#D1D5DB',
    gray400: '#94A3B8',   // Inactive text
    gray500: '#64748B',   // Secondary text
    gray600: '#64748B',   // Secondary text
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#0F172A',   // Primary text
    black: '#000000',
  },
  
  // Semantic Colors (상태 표시)
  success: '#10B981',     // Green
  warning: '#F59E0B',     // Amber
  error: '#EF4444',       // Red
  info: '#3B82F6',        // Blue - using primaryLight
  
  // Chat-specific Colors
  chat: {
    userBubble: '#3B82F6',        // User message
    assistantBubble: '#F1F5F9',   // AI response background
    userText: '#FFFFFF',          // User message text
    assistantText: '#0F172A',     // AI message text
    timestamp: '#94A3B8',         // Light text
    background: '#F8FAFC',        // App background
  },
  
  // Button Colors
  button: {
    primary: '#1E3A8A',           // Primary
    primaryHover: '#3B82F6',      // Primary Light
    secondary: '#06B6D4',         // Accent
    secondaryHover: '#22D3EE',    // Lighter Cyan
    disabled: '#D1D5DB',          // Gray
  },
};

export const DarkColors = {
  // Primary - 신뢰감 있는 딥 블루 (유지)
  primary: {
    main: '#3B82F6',      // 밝은 블루로 강조
    light: '#60A5FA',     // 더 밝은 블루
    dark: '#1E3A8A',      // 기존 메인 컬러
  },
  
  // Secondary Colors (강조 컬러)
  secondary: {
    main: '#06B6D4',      // Cyan (유지)
    light: '#22D3EE',
    dark: '#0891B2',
  },
  
  // Neutral Colors (반전된 배경 및 텍스트)
  neutral: {
    white: '#0F172A',     // 어두운 배경
    gray50: '#1F2937',    // App background
    gray100: '#374151',   // AI message background
    gray200: '#4B5563',   // Border color
    gray300: '#6B7280',
    gray400: '#9CA3AF',   // Inactive text
    gray500: '#D1D5DB',   // Secondary text
    gray600: '#E5E7EB',   // Secondary text
    gray700: '#F3F4F6',
    gray800: '#F9FAFB',
    gray900: '#FFFFFF',   // Primary text
    black: '#FFFFFF',
  },
  
  // Semantic Colors (상태 표시)
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Chat-specific Colors
  chat: {
    userBubble: '#3B82F6',
    assistantBubble: '#374151',
    userText: '#FFFFFF',
    assistantText: '#F9FAFB',
    timestamp: '#9CA3AF',
    background: '#1F2937',
  },
  
  // Button Colors
  button: {
    primary: '#3B82F6',
    primaryHover: '#60A5FA',
    secondary: '#06B6D4',
    secondaryHover: '#22D3EE',
    disabled: '#4B5563',
  },
};
