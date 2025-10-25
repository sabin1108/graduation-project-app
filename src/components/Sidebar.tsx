import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, StyleSheet, View, useColorScheme } from 'react-native';
import { Avatar, Divider, List, Text } from 'react-native-paper';

import PromotionBanner from '@/components/PromotionBanner';
import { Spacing } from '@/constants/Spacing';
import { useFontSize } from '@/hooks/use-font-size';
import { useAppTheme } from '@/hooks/use-theme-color';

const CAFETERIA_LINKS = [
  { title: '학생식당', reply: '오늘 학생식당 메뉴 알려줘' },
  { title: '기숙사식당', reply: '오늘 기숙사식당 메뉴 알려줘' },
  { title: '교직원식당', reply: '오늘 교직원식당 메뉴 알려줘' },
];

const QUICK_LINKS = [
  {
    title: '학교 홈페이지',
    icon: 'web',
    url: 'https://www.hknu.ac.kr/',
    external: false,
  },
  {
    title: '사이버캠퍼스',
    icon: 'laptop',
    url: 'https://cyber.hknu.ac.kr/ilos/main/main_form.acl',
    external: false,
  },
  {
    title: '수강 신청',
    icon: 'book-open-variant',
    url: 'https://sugang.hknu.ac.kr/login',
    external: true,
  },
  {
    title: '도서관',
    icon: 'library',
    url: 'https://lib.hknu.ac.kr/',
    external: true,
  },
];

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useAppTheme();
  const router = useRouter();
  const { textStyles: TextStyles } = useFontSize();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        sidebarContainer: {
          paddingTop: 60,
          paddingHorizontal: Spacing.md,
          backgroundColor: isDarkMode
            ? theme.neutral.gray800
            : theme.neutral.white,
        },
        header: {
          paddingVertical: Spacing.xl,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.md,
        },
        headerTitle: {
          ...TextStyles.h3,
          marginLeft: Spacing.md,
          color: isDarkMode ? theme.neutral.white : theme.neutral.gray800,
        },
        headerDescription: {
          ...TextStyles.small,
          marginLeft: Spacing.md,
          color: isDarkMode ? theme.neutral.gray400 : theme.neutral.gray500,
        },
        menuItem: {
          paddingVertical: 14,
          paddingHorizontal: Spacing.md,
          borderRadius: 12,
          marginBottom: Spacing.sm,
          backgroundColor: 'transparent',
        },
        menuItemTitle: {
          ...TextStyles.body,
          color: isDarkMode ? '#E2E8F0' : theme.neutral.gray800,
        },
        subMenuItem: {
          backgroundColor: 'transparent',
        },
        subMenuItemTitle: {
          color: isDarkMode ? theme.neutral.gray100 : theme.neutral.gray800,
        },
        listSubheader: {
          ...TextStyles.overline,
          color: isDarkMode ? theme.neutral.gray500 : theme.neutral.gray600,
        },
      }),
    [isDarkMode, theme, TextStyles]
  );

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
          style={{
            backgroundColor: isDarkMode
              ? theme.secondary.main
              : theme.primary.main,
          }}
        />
        <View>
          <Text style={styles.headerTitle}>한경국립대학교</Text>
          <Text style={styles.headerDescription}>AI 챗봇</Text>
        </View>
      </View>

      <PromotionBanner size="small" />

      <List.Section>
        <List.Subheader style={styles.listSubheader}>메뉴</List.Subheader>

        <List.Item
          title="학사 일정"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          left={() => <List.Icon color={iconColor} icon="calendar" />}
          onPress={() => props.navigation.navigate('modal')}
        />

        <List.Item
          title="설정"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          left={() => <List.Icon color={iconColor} icon="cog" />}
          onPress={() => props.navigation.navigate('settings')}
        />

        <List.Accordion
          title="학식 메뉴"
          titleStyle={styles.menuItemTitle}
          style={styles.menuItem}
          theme={{
            colors: {
              background: isDarkMode
                ? theme.neutral.gray800
                : theme.neutral.white,
            },
          }}
          left={() => <List.Icon color={iconColor} icon="food" />}
        >
          {CAFETERIA_LINKS.map((item) => (
            <List.Item
              key={item.title}
              title={item.title}
              style={styles.subMenuItem}
              titleStyle={styles.subMenuItemTitle}
              onPress={() => handleQuickReply(item.reply)}
            />
          ))}
        </List.Accordion>
      </List.Section>

      <Divider
        style={{
          backgroundColor: isDarkMode
            ? theme.neutral.gray700
            : theme.neutral.gray200,
        }}
      />

      <List.Section>
        <List.Subheader style={styles.listSubheader}>빠른 링크</List.Subheader>
        {QUICK_LINKS.map((link) => (
          <List.Item
            key={link.title}
            title={link.title}
            titleStyle={styles.menuItemTitle}
            style={styles.menuItem}
            left={() => <List.Icon color={iconColor} icon={link.icon} />}
            right={() =>
              link.external ? (
                <List.Icon color={theme.neutral.gray400} icon="open-in-new" />
              ) : null
            }
            onPress={() => handleExternalLink(link.url)}
          />
        ))}
      </List.Section>
    </DrawerContentScrollView>
  );
}