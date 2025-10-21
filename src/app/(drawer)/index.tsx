import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';

import ChatInput from '@/components/ChatInput';
import MessageBubble from '@/components/MessageBubble';
import { Spacing } from '@/constants/Spacing';
import { TextStyles } from '@/constants/Typography';
import { useAppTheme } from '@/hooks/use-theme-color';
import { loadMessages, saveMessages } from '@/lib/storage';
import { sendChatMessage } from '@/services/api';
import { Message } from '@/types/chat';

const INITIAL_ASSISTANT_MESSAGE: Omit<Message, 'id' | 'timestamp'> = {
  role: 'assistant',
  content: `[한경국립대학교 챗봇 사용 안내]

안녕하세요 한경국립대학교 챗봇입니다! 무엇을 도와드릴까요? 학사 일정, 학식 메뉴, 빠른 링크 등 다양한 정보를 얻을 수 있습니다. 궁금한 점이 있다면 언제든지 물어봐주세요!

[주요 기능별 사용 방법 예시]

챗봇은 요청하시는 월 또는 날짜를 함께 입력하시면 해당 정보를 빠르고 정확하게 찾아줍니다.

1. 공지사항 (월 입력 필수)
- 📌 장학 공지 확인
  예시: 10월 장학공지

- 📌 한경 일반 공지 확인
  예시: 10월 한경공지

- 📌 학사 공지 확인
  예시: 10월 학사공지

2. 식단 정보 (날짜 입력 필수)
- 📌 교직원 식당 식단
  예시: 11월 05일 교직원식당

- 📌 기숙사 식당 식단
  예시: 11월 05일 기숙사식당

- 📌 학생 식당 식단
  예시: 11월 05일 학생식당


**사용 팁:** [월/날짜] + [원하는 정보] 형태로 입력하시면 됩니다.`,
};

export default function ChatScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams();
  const router = useRouter();
  const isFocused = useIsFocused();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(uuid.v4() as string);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const load = async () => {
      if (isFocused) {
        const loadedMessages = await loadMessages();
        if (loadedMessages.length > 0) {
          setMessages(loadedMessages);
        } else {
          setMessages([
            {
              ...INITIAL_ASSISTANT_MESSAGE,
              id: uuid.v4() as string,
              timestamp: new Date(),
            },
          ]);
        }
      }
    };
    load();
  }, [isFocused]);

  useEffect(() => {
    if (messages.length > 1) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleSend = useCallback(
    async (messageContent: string) => {
      const content = messageContent.trim();
      if (!content) return;

      const userMessage: Message = {
        id: uuid.v4() as string,
        role: 'user',
        content: content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendChatMessage(content, userId);

        const assistantMessage: Message = {
          id: uuid.v4() as string,
          role: 'assistant',
          content: response.answer || '응답을 받지 못했습니다. 다시 시도해주세요.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        Speech.speak(assistantMessage.content, { language: 'ko-KR' });
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: uuid.v4() as string,
            role: 'assistant',
            content:
              '메시지 전송 중 오류가 발생했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // 사이드바에서 빠른 답장 처리
  useEffect(() => {
    const quickReply = params.quickReply;
    if (quickReply && typeof quickReply === 'string') {
      handleSend(quickReply);
      // 전송 후 파라미터를 지워 리렌더링 시 재전송을 방지합니다.
      router.setParams({ quickReply: '' });
    }
  }, [params.quickReply, handleSend, router]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.chat.background,
        },
        messageList: {
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.md,
          paddingBottom: Spacing.xl,
        },
        loadingContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.md,
        },
        loadingText: {
          ...TextStyles.tiny,
          marginLeft: Spacing.sm,
          color: theme.neutral.gray500,
        },
      }),
    [theme]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.secondary.main} />
          <Text style={styles.loadingText}>답변 생성 중...</Text>
        </View>
      )}

      <ChatInput onSendMessage={handleSend} />
    </KeyboardAvoidingView>
  );
}
