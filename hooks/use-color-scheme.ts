import { useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme, Appearance } from 'react-native';
import { loadColorScheme, saveColorScheme, ColorScheme } from '@/lib/storage';

export function useColorScheme() {
  const deviceScheme = useDeviceColorScheme();
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(deviceScheme);

  useEffect(() => {
    const initializeTheme = async () => {
      const storedScheme = await loadColorScheme();
      if (storedScheme === 'system') {
        setColorScheme(deviceScheme);
      } else {
        setColorScheme(storedScheme);
      }
    };

    initializeTheme();

    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      loadColorScheme().then(storedScheme => {
        if (storedScheme === 'system') {
          setColorScheme(newColorScheme);
        }
      });
    });

    return () => subscription.remove();
  }, [deviceScheme]);

  return colorScheme;
}