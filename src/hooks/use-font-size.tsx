
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState } from 'react-native';
import { loadFontSize, FontSize } from '@/lib/storage';
import { createTextStyles } from '@/constants/Typography';

// 기본 스타일 객체 생성
const defaultTextStyles = createTextStyles();

// 컨텍스트는 기본 객체와 동일한 유형의 값을 보유합니다.
const FontSizeContext = createContext(defaultTextStyles);

// 텍스트 스타일을 사용하기 위한 사용자 정의 훅
export const useTextStyles = () => useContext(FontSizeContext);

interface FontSizeProviderProps {
  children: ReactNode;
}

// Provider 컴포넌트
export const FontSizeProvider = ({ children }: FontSizeProviderProps) => {
  const [textStyles, setTextStyles] = useState(defaultTextStyles);

  useEffect(() => {
    const loadAndSet = async () => {
      const fontSize = await loadFontSize();
      setTextStyles(createTextStyles(fontSize));
    };

    loadAndSet();

    // 앱이 활성화될 때 글꼴 크기를 다시 로드하기 위해 앱 상태 변경을 수신합니다.
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadAndSet();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <FontSizeContext.Provider value={textStyles}>
      {children}
    </FontSizeContext.Provider>
  );
};
