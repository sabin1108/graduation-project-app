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
import { FontSizeProvider } from '@/hooks/use-font-size';

// 사용자 정의 테마를 react-navigation이 예상하는 형식으로 매핑합니다.
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

// react-native-paper를 위한 테마를 생성합니다.
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

// 에셋 로딩이 완료되기 전에 스플래시 화면이 자동으로 숨겨지는 것을 방지합니다.
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
      // 폰트 로딩이 완료되거나 오류가 발생한 후 스플래시 화면을 숨깁니다.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 폰트가 로드될 때까지 렌더링을 방지합니다.
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
          <FontSizeProvider>
            <Stack>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              <Stack.Screen name="settings" options={{ presentation: 'modal', title: '설정' }} />
            </Stack>
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          </FontSizeProvider>
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
