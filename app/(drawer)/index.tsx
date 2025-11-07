import 'react-native-get-random-values';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Text } from 'react-native';
import uuid from 'react-native-uuid';
import * as Speech from 'expo-speech';
import { useLocalSearchParams, useRouter } from 'expo-router';

import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput'; // Import the new ChatInput component
import { sendChatMessage } from '@/services/api';
import { useAppTheme } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/Spacing';
import { TextStyles } from '@/constants/Typography';
import { saveMessages, loadMessages } from '@/lib/storage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const theme = useAppTheme();
  const params = useLocalSearchParams();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(uuid.v4() as string);
  const flatListRef = useRef<FlatList>(null);

  // Load messages from storage on mount
  useEffect(() => {
    const load = async () => {
      const loadedMessages = await loadMessages();
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      } else {
        // If no messages are loaded, set the initial welcome message
        setMessages([
          {
            id: uuid.v4() as string,
            role: 'assistant',
            content: '안녕하세요! 한경국립대학교 AI 챗봇입니다. 무엇을 도와드릴까요?',
            timestamp: new Date(),
          },
        ]);
      }
    };
    load();
  }, []);

  // Save messages to storage whenever they change
  useEffect(() => {
    // Don't save the initial welcome message by itself
    if (messages.length > 1) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleSend = useCallback(async (messageContent: string) => { // messageContent is now required
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
          content: '메시지 전송 중 오류가 발생했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Handle quick replies from sidebar
  useEffect(() => {
    const quickReply = params.quickReply;
    if (quickReply && typeof quickReply === 'string') {
      handleSend(quickReply);
      // Clear the param after sending to prevent re-sending on re-renders
      router.setParams({ quickReply: '' });
    }
  }, [params.quickReply, handleSend, router]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Dynamic styles from the design guide
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.chat.background,
    },
    messageList: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      paddingBottom: Spacing.xl,
    },
    // Loading Indicator Styles
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
  });

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
        showsVerticalScrollIndicator={false} // Added from design guide
        keyboardShouldPersistTaps="handled" // Added from design guide
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
