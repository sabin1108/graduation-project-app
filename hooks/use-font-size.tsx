
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState } from 'react-native';
import { loadFontSize, FontSize } from '@/lib/storage';
import { createTextStyles } from '@/constants/Typography';

// Create a default style object
const defaultTextStyles = createTextStyles();

// The context will hold a value of the same type as the default object
const FontSizeContext = createContext(defaultTextStyles);

// Custom hook to use the text styles
export const useTextStyles = () => useContext(FontSizeContext);

interface FontSizeProviderProps {
  children: ReactNode;
}

// Provider component
export const FontSizeProvider = ({ children }: FontSizeProviderProps) => {
  const [textStyles, setTextStyles] = useState(defaultTextStyles);

  useEffect(() => {
    const loadAndSet = async () => {
      const fontSize = await loadFontSize();
      setTextStyles(createTextStyles(fontSize));
    };

    loadAndSet();

    // Listen for app state changes to reload font size when app becomes active
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
