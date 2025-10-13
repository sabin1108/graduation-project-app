import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, StyleSheet, View, useColorScheme } from 'react-native';
import { Avatar, Divider, List, Text } from 'react-native-paper';

import { Spacing } from '@/constants/Spacing';
import { useAppTheme } from '@/hooks/use-theme-color';
import { useTextStyles } from '@/hooks/use-font-size';

export default function CustomDrawerContent(props: any) {
  const theme = useAppTheme();
  const router = useRouter();
  const TextStyles = useTextStyles();
  const colorScheme = useColorScheme();

  const isDarkMode = true;

  const styles = StyleSheet.create({
    sidebarContainer: {
      paddingTop: 60,
      paddingHorizontal: Spacing.md, // 16
      backgroundColor: isDarkMode ? theme.neutral.gray800 : theme.neutral.white,
    },
    header: {
      paddingVertical: Spacing.xl, // Adjusted from 2xl to xl
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md, // Added margin bottom for spacing
    },
    headerTitle: {
      ...TextStyles.h3,
      marginLeft: Spacing.md,
      color: isDarkMode ? theme.neutral.white : theme.neutral.gray800,
    },
    headerDescription: {
      ...TextStyles.small, // Using small for description
      marginLeft: Spacing.md,
      color: isDarkMode ? theme.neutral.gray400 : theme.neutral.gray500,
    },
    menuItem: {
      // 💡 paddingVertical을 14로 다시 적용합니다.
      paddingVertical: 14,
      paddingHorizontal: Spacing.md, // 16
      borderRadius: 12,
      marginBottom: Spacing.sm, // 8
      backgroundColor: 'transparent',
    },
    menuItemTitle: {
      ...TextStyles.body, // Using body for menu item title
      color: isDarkMode ? '#E2E8F0' : theme.neutral.gray800, // Specific color from design guide
    },
    listSubheader: {
      ...TextStyles.overline,
      color: isDarkMode ? theme.neutral.gray500 : theme.neutral.gray600,
    },
  });

  const handleExternalLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('Failed to open URL:', err);
      Alert.alert('오류', '링크를 여는 데 실패했습니다.');
    }
  };

  const handleQuickReply = (reply: string) => {
    router.push({ pathname: '/', params: { quickReply: reply } });
    props.navigation.closeDrawer();
  };

  const iconColor = isDarkMode ? theme.primary.light : theme.primary.main;

  return (
    <DrawerContentScrollView {...props} style={styles.sidebarContainer}>
      <View style={styles.header}>
        <Avatar.Icon
          size={48}
          icon="robot"
          style={{ backgroundColor: isDarkMode ? theme.secondary.main : theme.primary.main }}
        />
        <View>
          <Text style={styles.headerTitle}>한경국립대학교</Text>
          <Text style={styles.headerDescription}>AI 챗봇</Text>
        </View>
      </View>

      <List.Section>
        <List.Subheader style={styles.listSubheader}>메뉴</List.Subheader>

        <List.Item
          title="학사 일정"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          left={() => <List.Icon color={iconColor} icon="calendar" />}
          onPress={() => {
            props.navigation.navigate('modal');
          }}
        />

        <List.Item
          title="설정"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          left={() => <List.Icon color={iconColor} icon="cog" />}
          onPress={() => {
            props.navigation.navigate('settings');
          }}
        />

        <List.Item
          title="수강 신청"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          left={() => <List.Icon color={iconColor} icon="book-open-variant" />}
          right={() => <List.Icon color={theme.neutral.gray400} icon="open-in-new" />}
          onPress={() => handleExternalLink('https://sugang.hknu.ac.kr/login')}
        />

        <List.Item
          title="도서관"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          left={() => <List.Icon color={iconColor} icon="library" />}
          right={() => <List.Icon color={theme.neutral.gray400} icon="open-in-new" />}
          onPress={() => handleExternalLink('https://lib.hknu.ac.kr/')}
        />

        <List.Accordion
          title="학식 메뉴"
          // 💡 다른 항목과 폰트 스타일을 일치시켜 수직 정렬을 맞춥니다.
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          theme={{ colors: { background: isDarkMode ? theme.neutral.gray800 : theme.neutral.white } }}
          left={() => <List.Icon color={iconColor} icon="food" />}
        >
          <List.Item
            title="학생식당"
            style={{ backgroundColor: 'transparent' }}
            titleStyle={{ color: isDarkMode ? theme.neutral.gray100 : theme.neutral.gray800 }}
            onPress={() => handleQuickReply('오늘 학생식당 메뉴 알려줘')}
          />
          <List.Item
            title="기숙사식당"
            style={{ backgroundColor: 'transparent' }}
            titleStyle={{ color: isDarkMode ? theme.neutral.gray100 : theme.neutral.gray800 }}
            onPress={() => handleQuickReply('오늘 기숙사식당 메뉴 알려줘')}
          />
          <List.Item
            title="교직원식당"
            style={{ backgroundColor: 'transparent' }}
            titleStyle={{ color: isDarkMode ? theme.neutral.gray100 : theme.neutral.gray800 }}
            onPress={() => handleQuickReply('오늘 교직원식당 메뉴 알려줘')}
          />
        </List.Accordion>
      </List.Section>

      <Divider style={{ backgroundColor: isDarkMode ? theme.neutral.gray700 : theme.neutral.gray200 }} />

      <List.Section>
        <List.Subheader style={styles.listSubheader}>빠른 링크</List.Subheader>

        <List.Item
          title="학교 홈페이지"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          left={() => <List.Icon color={iconColor} icon="web" />}
          onPress={() => handleExternalLink('https://www.hknu.ac.kr/')}
        />

        <List.Item
          title="사이버캠퍼스"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          left={() => <List.Icon color={iconColor} icon="laptop" />}
          onPress={() => handleExternalLink('https://cyber.hknu.ac.kr/ilos/main/main_form.acl')}
        />
      </List.Section>
    </DrawerContentScrollView>
  );
}