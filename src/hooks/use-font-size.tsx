
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppState } from 'react-native';
import { loadFontSize, FontSize } from '@/lib/storage';
import { createTextStyles } from '@/constants/Typography';

interface FontSizeContextType {
  textStyles: ReturnType<typeof createTextStyles>;
  updateFontSize: (size: FontSize) => void;
}

const defaultTextStyles = createTextStyles();

const FontSizeContext = createContext<FontSizeContextType>({
  textStyles: defaultTextStyles,
  updateFontSize: () => {},
});

export const useFontSize = () => useContext(FontSizeContext);

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider = ({ children }: FontSizeProviderProps) => {
  const [textStyles, setTextStyles] = useState(defaultTextStyles);

  const updateFontSize = useCallback((size: FontSize) => {
    const newStyles = createTextStyles(size);
    setTextStyles(newStyles);
  }, []);

  useEffect(() => {
    const loadAndSet = async () => {
      const fontSize = await loadFontSize();
      updateFontSize(fontSize);
    };

    loadAndSet();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadAndSet();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [updateFontSize]);

  return (
    <FontSizeContext.Provider value={{ textStyles, updateFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};
