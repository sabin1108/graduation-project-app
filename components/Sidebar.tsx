import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import { Avatar, Divider, List, Text } from 'react-native-paper';

import { Spacing } from '@/constants/Spacing';
import { TextStyles } from '@/constants/Typography';
import { useAppTheme } from '@/hooks/use-theme-color';

export default function CustomDrawerContent(props: any) {
  const theme = useAppTheme();
  const router = useRouter();

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

  return (
    <DrawerContentScrollView 
      {...props} 
      style={[styles.sidebarContainer, { backgroundColor: theme.neutral.gray800 }]} // Using neutral.gray800 for sidebar background
    >
      <View style={styles.header}>
        <Avatar.Icon size={48} icon="robot" style={{ backgroundColor: theme.secondary.main }} />
        <View>
            <Text style={[styles.headerTitle, { color: theme.neutral.white }]}>한경국립대학교</Text>
            <Text style={[styles.headerDescription, { color: theme.neutral.gray400 }]}>AI 챗봇</Text>
        </View>
      </View>

      <List.Section>
        <List.Subheader style={{...TextStyles.overline, color: theme.neutral.gray500}}>메뉴</List.Subheader>
        
        <List.Item
          title="학사 일정"
          titleStyle={[styles.menuItemTitle, { color: theme.neutral.gray100 }]} // Adjusted for dark background
          style={styles.menuItem}
          left={() => <List.Icon color={theme.primary.light} icon="calendar" />} // Using primary.light for icons
          onPress={() => {
            props.navigation.navigate('modal');
          }}
        />

        <List.Item
          title="수강 신청"
          titleStyle={[styles.menuItemTitle, { color: theme.neutral.gray100 }]}
          style={styles.menuItem}
          left={() => <List.Icon color={theme.primary.light} icon="book-open-variant" />}
          right={() => <List.Icon color={theme.neutral.gray400} icon="open-in-new" />}
          onPress={() => handleExternalLink('https://sugang.hknu.ac.kr/login')}
        />

        <List.Item
          title="도서관"
          titleStyle={[styles.menuItemTitle, { color: theme.neutral.gray100 }]}
          style={styles.menuItem}
          left={() => <List.Icon color={theme.primary.light} icon="library" />}
          right={() => <List.Icon color={theme.neutral.gray400} icon="open-in-new" />}
          onPress={() => handleExternalLink('https://lib.hknu.ac.kr/')}
        />

        <List.Accordion
          title="학식 메뉴"
          titleStyle={[styles.menuItemTitle, { color: theme.neutral.gray100 }]}
          style={styles.menuItem}
          left={props => <List.Icon {...props} color={theme.primary.light} icon="food" />}>
          <List.Item
            title="학생식당"
            titleStyle={{color: theme.neutral.gray100}}
            onPress={() => handleQuickReply('오늘 학생식당 메뉴 알려줘')}
          />
          <List.Item
            title="기숙사식당"
            titleStyle={{color: theme.neutral.gray100}}
            onPress={() => handleQuickReply('오늘 기숙사식당 메뉴 알려줘')}
          />
          <List.Item
            title="교직원식당"
            titleStyle={{color: theme.neutral.gray100}}
            onPress={() => handleQuickReply('오늘 교직원식당 메뉴 알려줘')}
          />
        </List.Accordion>
      </List.Section>

      <Divider style={{backgroundColor: theme.neutral.gray700}}/>

      <List.Section>
        <List.Subheader style={{...TextStyles.overline, color: theme.neutral.gray500}}>빠른 링크</List.Subheader>
        
        <List.Item
          title="학교 홈페이지"
          titleStyle={[styles.menuItemTitle, { color: theme.neutral.gray100 }]}
          style={styles.menuItem}
          left={() => <List.Icon color={theme.primary.light} icon="web" />}
          onPress={() => handleExternalLink('https://www.hknu.ac.kr/')}
        />

        <List.Item
          title="사이버캠퍼스"
          titleStyle={[styles.menuItemTitle, { color: theme.neutral.gray100 }]}
          style={styles.menuItem}
          left={() => <List.Icon color={theme.primary.light} icon="laptop" />}
          onPress={() => handleExternalLink('https://cyber.hknu.ac.kr/ilos/main/main_form.acl')}
        />
      </List.Section>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: Spacing.xl, // Adjusted from 2xl to xl
    paddingHorizontal: 0, // Handled by sidebarContainer
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md, // Added margin bottom for spacing
  },
  headerTitle: {
    ...TextStyles.h3,
    marginLeft: Spacing.md,
  },
  headerDescription: {
      ...TextStyles.small, // Using small for description
      marginLeft: Spacing.md,
  },
  menuItem: {
      paddingVertical: 14,
      paddingHorizontal: Spacing.md, // 16
      borderRadius: 12,
      marginBottom: Spacing.sm, // 8
      backgroundColor: 'transparent',
  },
  menuItemTitle: {
      ...TextStyles.body, // Using body for menu item title
      color: '#E2E8F0', // Specific color from design guide
  }
});