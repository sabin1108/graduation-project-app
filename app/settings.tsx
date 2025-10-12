
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Share, Alert } from 'react-native';
import { Button, Card, Title, Paragraph, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppTheme } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/Spacing';
import { TextStyles } from '@/constants/Typography';
import { loadMessages, saveFontSize, loadFontSize, FontSize, saveColorScheme, loadColorScheme, ColorScheme } from '@/lib/storage';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const [fontSize, setFontSize] = useState<FontSize>(1);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('system');
  const effectiveColorScheme = useColorScheme();
  const statusBarTheme = effectiveColorScheme === 'dark' ? 'light' : 'dark';


  useEffect(() => {
    const fetchSettings = async () => {
      const storedSize = await loadFontSize();
      setFontSize(storedSize);
      const storedScheme = await loadColorScheme();
      setColorScheme(storedScheme);
    };
    fetchSettings();
  }, []);

  const handleExport = async () => {
    try {
      const messages = await loadMessages();
      if (messages.length === 0) {
        Alert.alert('내보내기 실패', '채팅 내역이 없습니다.');
        return;
      }

      const formattedChat = messages
        .map(
          (msg) =>
            `[${new Date(msg.timestamp).toLocaleString()}] ${msg.role === 'user' ? '나' : 'AI'}:
${msg.content}`
        )
        .join('\n\n');

      await Share.share({
        title: '한경국립대 AI 챗봇 대화 내역',
        message: formattedChat,
      });
    } catch (error) {
      console.error('Error exporting chat:', error);
      Alert.alert('오류', '채팅 내역을 내보내는 중 오류가 발생했습니다.');
    }
  };

  const handleFontSizeChange = async (value: number) => {
    setFontSize(value);
    await saveFontSize(value);
  };

  const handleColorSchemeChange = async (value: string) => {
    const newScheme = value as ColorScheme;
    setColorScheme(newScheme);
    await saveColorScheme(newScheme);
  };

  // Dynamic styles that depend on the theme
  const dynamicStyles = {
    container: {
      backgroundColor: theme.neutral.gray50,
    },
    title: {
      color: theme.neutral.gray900,
    },
    card: {
      backgroundColor: theme.neutral.white,
    },
    closeButton: {
      backgroundColor: theme.primary.main,
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar style={statusBarTheme} />
      <Title style={[styles.title, dynamicStyles.title]}>설정</Title>

      <Card style={[styles.card, dynamicStyles.card]}>
        <Card.Content>
          <Title>화면 테마</Title>
          <Paragraph>앱의 전체적인 테마를 설정합니다.</Paragraph>
        </Card.Content>
        <Card.Content>
          <SegmentedButtons
            value={colorScheme}
            onValueChange={handleColorSchemeChange}
            buttons={[
              { value: 'light', label: '라이트' },
              { value: 'dark', label: '다크' },
              { value: 'system', label: '시스템 설정' },
            ]}
          />
        </Card.Content>
      </Card>

      <Card style={[styles.card, dynamicStyles.card]}>
        <Card.Content>
          <Title>폰트 크기</Title>
          <Paragraph>앱의 전체 폰트 크기를 조절합니다. (앱 재시작 필요)</Paragraph>
        </Card.Content>
        <Card.Content>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0.8}
            maximumValue={1.2}
            step={0.1}
            value={fontSize}
            onValueChange={handleFontSizeChange}
            minimumTrackTintColor={theme.primary.main}
            maximumTrackTintColor={theme.neutral.gray300}
            thumbTintColor={theme.primary.main}
          />
          <Paragraph style={{ textAlign: 'center' }}>{fontSize.toFixed(1)}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={[styles.card, dynamicStyles.card]}>
        <Card.Content>
          <Title>채팅 내역 내보내기</Title>
          <Paragraph>모든 대화 내용을 텍스트 파일로 내보냅니다.</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={handleExport}>내보내기</Button>
        </Card.Actions>
      </Card>

      <Button
        mode="contained"
        onPress={() => {
          Alert.alert(
            '알림',
            '폰트 크기 변경사항을 적용하려면 앱을 다시 시작해야 합니다.',
            [{ text: '확인', onPress: () => router.back() }]
          );
        }}
        style={[styles.closeButton, dynamicStyles.closeButton]}
        labelStyle={styles.closeButtonText}
      >
        닫기
      </Button>
    </View>
  );
}

// Static styles that do not depend on the theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  title: {
    ...TextStyles.h2,
    marginBottom: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.lg,
  },
  closeButton: {
    marginTop: Spacing.lg,
    borderRadius: 12,
  },
  closeButtonText: {
    ...TextStyles.button,
  },
});
