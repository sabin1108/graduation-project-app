import { Drawer } from 'expo-router/drawer';

import CustomDrawerContent from '@/components/Sidebar';
import { useAppTheme } from '@/hooks/use-theme-color';
import { DrawerToggleButton } from '@react-navigation/drawer';

export default function DrawerLayout() {
  const theme = useAppTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: '한경국립대학교 AI 챗봇',
        headerStyle: {
          backgroundColor: theme.primary.main,
        },
        headerTintColor: theme.neutral.white,
        headerLeft: () => <DrawerToggleButton tintColor={theme.neutral.white} />,
        drawerStyle: {
          backgroundColor: theme.neutral.gray800,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: '채팅',
        }}
      />
    </Drawer>
  );
}
