import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFonts, NotoSansKR_400Regular, NotoSansKR_500Medium, NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Colors, DarkColors } from '@/constants/theme';

// Create a mapping from the custom theme to what react-navigation expects
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary.main,
    background: Colors.neutral.gray50,
    card: Colors.neutral.white,
    text: Colors.neutral.gray900,
    border: Colors.neutral.gray200,
    notification: Colors.primary.main,
  },
};

const navDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: DarkColors.primary.main,
    background: DarkColors.neutral.gray50,
    card: DarkColors.neutral.gray100,
    text: DarkColors.neutral.gray900,
    border: DarkColors.neutral.gray200,
    notification: DarkColors.primary.main,
  },
};

// Create themes for react-native-paper
const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary.main,
    accent: Colors.secondary.main,
    background: Colors.neutral.gray50,
    surface: Colors.neutral.white,
    text: Colors.neutral.gray900,
    placeholder: Colors.neutral.gray400,
  },
};

const paperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: DarkColors.primary.main,
    accent: DarkColors.secondary.main,
    background: DarkColors.neutral.gray50,
    surface: DarkColors.neutral.gray100,
    text: DarkColors.neutral.gray900,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    'NotoSansKR-Regular': NotoSansKR_400Regular,
    'NotoSansKR-Medium': NotoSansKR_500Medium,
    'NotoSansKR-Bold': NotoSansKR_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after fonts have loaded or an error occurred
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  const isDarkMode = colorScheme === 'dark';
  const navigationTheme = isDarkMode ? navDarkTheme : navTheme;
  const rnPaperTheme = isDarkMode ? paperDarkTheme : paperTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={rnPaperTheme}>
        <ThemeProvider value={navigationTheme}>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
