
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Share, Alert } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Slider from '@react-native-community/slider';

import { useAppTheme } from '@/hooks/use-theme-color';
import { useFontSize } from '@/hooks/use-font-size';
import { Spacing } from '@/constants/Spacing';
import { TextStyles } from '@/constants/Typography';
import { loadMessages, saveFontSize, loadFontSize, FontSize, clearMessages } from '@/lib/storage';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { updateFontSize } = useFontSize();
  const [tempFontSize, setTempFontSize] = useState<FontSize>(1);

  useEffect(() => {
    const fetchSettings = async () => {
      const storedSize = await loadFontSize();
      setTempFontSize(storedSize);
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

  const clearChatHistory = async () => {
    try {
      await clearMessages();
      Alert.alert('완료', '채팅 내역이 모두 삭제되었습니다.');
    } catch (error) {
      console.error('Error clearing chat history:', error);
      Alert.alert('오류', '채팅 내역을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      '채팅 내역 삭제',
      '정말로 모든 대화 내용을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: clearChatHistory,
        },
      ]
    );
  };

  const handleSliderChange = (value: number) => {
    const newSize = value as FontSize;
    setTempFontSize(newSize);
    updateFontSize(newSize);
  };

  const handleSaveFontSize = async (value: number) => {
    await saveFontSize(value);
  };

  // 테마에 따라 달라지는 동적 스타일
  const dynamicStyles = useMemo(() => ({
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
  }), [theme]);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <StatusBar style="dark" />
      <Title style={[styles.title, { color: theme.neutral.gray900 }]}>설정</Title>

      <Card style={[styles.card, dynamicStyles.card]}>
        <Card.Content>
          <Title>폰트 크기</Title>
          <Paragraph>앱의 전체 폰트 크기를 조절합니다.</Paragraph>
        </Card.Content>
        <Card.Content>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0.8}
            maximumValue={1.2}
            step={0.1}
            value={tempFontSize}
            onValueChange={handleSliderChange}
            onSlidingComplete={handleSaveFontSize}
            minimumTrackTintColor={theme.primary.main}
            maximumTrackTintColor={theme.neutral.gray300}
            thumbTintColor={theme.primary.main}
          />
          <Paragraph style={{ textAlign: 'center', fontSize: 16 * tempFontSize }}>
            {tempFontSize.toFixed(1)}
          </Paragraph>
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

      <Card style={[styles.card, dynamicStyles.card]}>
        <Card.Content>
          <Title>채팅 내역 삭제</Title>
          <Paragraph>모든 대화 내용을 영구적으로 삭제합니다.</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={handleClearHistory} color={theme.error}>삭제하기</Button>
        </Card.Actions>
      </Card>

      <Button
        mode="contained"
        onPress={() => router.back()}
        style={[styles.closeButton, dynamicStyles.closeButton]}
        labelStyle={styles.closeButtonText}
      >
        닫기
      </Button>
    </View>
  );
}

// 테마에 의존하지 않는 정적 스타일
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
