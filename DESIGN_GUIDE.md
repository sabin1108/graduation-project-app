# 한국 대학교 AI 챗봇 앱 디자인 가이드

React Native/Expo 앱에 적용할 수 있는 완성된 디자인 시스템입니다.

---

## 색상 팔레트

\`\`\`javascript
const colors = {
  // Primary - 신뢰감 있는 딥 블루
  primary: '#1E3A8A',      // 메인 브랜드 컬러
  primaryLight: '#3B82F6', // 액센트, 버튼
  
  // Neutrals
  background: '#F8FAFC',   // 앱 배경
  surface: '#FFFFFF',      // 카드, 메시지 배경
  surfaceDark: '#1E293B',  // 다크모드 서피스
  
  // Text
  textPrimary: '#0F172A',  // 주요 텍스트
  textSecondary: '#64748B', // 보조 텍스트
  textLight: '#94A3B8',     // 비활성 텍스트
  
  // Accent
  accent: '#06B6D4',       // 링크, 강조
  success: '#10B981',      // 성공 메시지
  
  // Message Bubbles
  userMessage: '#3B82F6',  // 사용자 메시지
  aiMessage: '#F1F5F9',    // AI 응답 배경
}
\`\`\`

---

## 타이포그래피

### 폰트 패밀리
- **헤딩**: Pretendard-Bold 또는 Noto Sans KR (700)
- **본문**: Pretendard-Regular 또는 Noto Sans KR (400)

### 폰트 크기
\`\`\`javascript
const typography = {
  heading: {
    fontFamily: 'Pretendard-Bold',
    fontWeight: '700',
  },
  body: {
    fontFamily: 'Pretendard-Regular',
    fontWeight: '400',
  },
  sizes: {
    h1: 24,
    h2: 20,
    h3: 18,
    body: 16,
    small: 14,
    tiny: 12,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.6,
  }
}
\`\`\`

---

## 메시지 버블 스타일

### 사용자 메시지
\`\`\`javascript
const userBubbleStyle = {
  backgroundColor: '#3B82F6',
  color: '#FFFFFF',
  borderRadius: 20,
  borderBottomRightRadius: 4,
  paddingVertical: 12,
  paddingHorizontal: 16,
  maxWidth: '75%',
  alignSelf: 'flex-end',
  marginBottom: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
}
\`\`\`

### AI 메시지
\`\`\`javascript
const aiBubbleStyle = {
  backgroundColor: '#F1F5F9',
  color: '#0F172A',
  borderRadius: 20,
  borderBottomLeftRadius: 4,
  paddingVertical: 12,
  paddingHorizontal: 16,
  maxWidth: '75%',
  alignSelf: 'flex-start',
  marginBottom: 8,
}
\`\`\`

### 메시지 텍스트
\`\`\`javascript
const messageTextStyle = {
  fontSize: 16,
  lineHeight: 24,
  fontWeight: '400',
}
\`\`\`

---

## 레이아웃 간격

\`\`\`javascript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

// 메시지 리스트 컨테이너
const messageContainer = {
  paddingHorizontal: 16,
  paddingVertical: 12,
  gap: 8,
}
\`\`\`

---

## 사이드바 디자인

### 사이드바 컨테이너
\`\`\`javascript
const sidebarStyle = {
  backgroundColor: '#1E293B',
  width: 280,
  paddingTop: 60,
  paddingHorizontal: 20,
}
\`\`\`

### 사이드바 아이템
\`\`\`javascript
const sidebarItem = {
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginBottom: 8,
  backgroundColor: 'transparent', // 기본 상태
}

const sidebarItemActive = {
  backgroundColor: '#334155', // 활성화 상태
}

const sidebarText = {
  color: '#E2E8F0',
  fontSize: 16,
  fontWeight: '500',
}
\`\`\`

---

## 입력창 스타일

### 입력창 컨테이너
\`\`\`javascript
const inputContainerStyle = {
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E2E8F0',
  paddingHorizontal: 16,
  paddingVertical: 12,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
}
\`\`\`

### 텍스트 입력 필드
\`\`\`javascript
const textInputStyle = {
  flex: 1,
  backgroundColor: '#F1F5F9',
  borderRadius: 24,
  paddingVertical: 12,
  paddingHorizontal: 20,
  fontSize: 16,
  color: '#0F172A',
  maxHeight: 100,
}
\`\`\`

### 전송 버튼
\`\`\`javascript
const sendButtonStyle = {
  backgroundColor: '#3B82F6',
  width: 44,
  height: 44,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
}
\`\`\`

---

## 인터랙션 & 애니메이션

### 터치 피드백
\`\`\`javascript
// 버튼 터치 시 투명도
activeOpacity: 0.7
\`\`\`

### 메시지 등장 애니메이션
\`\`\`javascript
import { Animated } from 'react-native';

// Fade in 애니메이션
const fadeAnim = useRef(new Animated.Value(0)).current;

Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();
\`\`\`

### 스크롤 설정
\`\`\`javascript
<FlatList
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ paddingBottom: 20 }}
  keyboardShouldPersistTaps="handled"
/>
\`\`\`

---

## 그림자 효과

### iOS 그림자
\`\`\`javascript
const iosShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
}
\`\`\`

### Android 그림자
\`\`\`javascript
const androidShadow = {
  elevation: 2,
}
\`\`\`

### 결합 사용
\`\`\`javascript
const cardShadow = {
  ...iosShadow,
  ...androidShadow,
}
\`\`\`

---

## 적용 예시

### MessageBubble.tsx
\`\`\`javascript
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, isUser }) {
  return (
    <View style={[
      styles.bubble,
      isUser ? styles.userBubble : styles.aiBubble
    ]}>
      <Text style={[
        styles.text,
        isUser ? styles.userText : styles.aiText
      ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '75%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  userBubble: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiBubble: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#0F172A',
  },
});
\`\`\`

---

## 디자인 원칙

1. **가독성 우선**: 한글 텍스트를 위한 충분한 행간(1.5-1.6) 유지
2. **일관성**: 모든 메시지 버블에 동일한 패딩과 radius 적용
3. **접근성**: 텍스트와 배경 간 충분한 대비 유지
4. **반응성**: 다양한 화면 크기에서 maxWidth 75% 적용
5. **피드백**: 모든 터치 가능한 요소에 activeOpacity 적용

---

## 추가 권장사항

- **로딩 상태**: AI 응답 대기 시 점 3개 애니메이션 표시
- **타임스탬프**: 메시지 그룹 위에 작고 연한 회색 텍스트로 표시
- **에러 메시지**: #EF4444 색상으로 표시
- **빈 상태**: 첫 화면에 가이드 메시지 표시

이 디자인 가이드를 따라 구현하면 깔끔하고 현대적인 챗봇 UI를 만들 수 있습니다.
