import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { Spacing } from '@/constants/Spacing';
import { useTextStyles } from '@/hooks/use-font-size';
import { useAppTheme } from '@/hooks/use-theme-color';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const theme = useAppTheme();
  const TextStyles = useTextStyles();
  const isUser = message.role === 'user';

  const processContent = (content: string) => {
    const regex = /^\s*(•\s*)?(.+?)\s+\((https?:\/\/[^\)]+)\)$/gm;
    return content.replace(regex, (match, bullet, text, url) => {
      return (bullet || '') + `[${text}](${url})\n`;
    });
  };

  const processedMessageContent = isUser ? message.content : processContent(message.content);

  // 링크를 위한 사용자 정의 렌더러
  const renderLink = (node: any, children: any, parent: any, _: any) => {
    const href = node.attributes.href;

    const handlePress = () => {
      WebBrowser.openBrowserAsync(href);
    };

    return (
      <Text key={node.key} onPress={handlePress} style={{ color: theme.info }}>
        {children}
        <Text> </Text>
        <Ionicons name="link" size={16} color={theme.info} />
      </Text>
    );
  };

  const rules = {
    link: renderLink,
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message.content);
    // TODO: 나중에 여기에 토스트 알림 추가
  };

  const bubbleStyle = isUser 
    ? [styles.bubble, styles.userBubble, { backgroundColor: theme.chat.userBubble }]
    : [styles.bubble, styles.assistantBubble, { backgroundColor: theme.neutral.gray200 }];
  
  const userTextStyle = isUser ? { color: theme.chat.userText } : {};
  const assistantTextStyle = !isUser ? { color: theme.chat.assistantText } : {};

  const align: 'right' | 'left' = isUser ? 'right' : 'left';

  const timestampStyle = [
    TextStyles.tiny, // 디자인 가이드의 작은 텍스트에 따라 타임스탬프에 tiny 사용
    { color: theme.chat.timestamp, textAlign: align },
  ];

  const markdownStyle = {
    paragraph: {
      ...TextStyles.body, // 메시지 텍스트에 TextStyles.body 사용
      ...userTextStyle,
      ...assistantTextStyle,
    },
    link: { color: theme.info },
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.neutral.gray200 }]}>
            <MaterialCommunityIcons name="robot" size={24} color={theme.primary.main} />
        </View>
      )}

      <View style={styles.bubbleWrapper}>
        <View style={bubbleStyle}>
          <Markdown style={markdownStyle} rules={rules}>
            {processedMessageContent}
          </Markdown>
        </View>
        <View style={isUser ? styles.userActions : styles.assistantActions}>
            <Text style={timestampStyle}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {!isUser && (
              <View style={styles.iconActions}>
                <Pressable onPress={handleCopy} style={styles.iconButton}>
                  <MaterialCommunityIcons name="content-copy" size={18} color={theme.neutral.gray600} />
                </Pressable>
              </View>
            )}
        </View>
      </View>

      {isUser && (
         <View style={[styles.avatar, { backgroundColor: theme.primary.main }]}>
            <Ionicons name="person" size={20} color={theme.neutral.white} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: Spacing.sm, // Spacing.md에서 Spacing.sm (8)으로 변경됨
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.sm,
  },
  bubbleWrapper: {
    maxWidth: '95%',
    flexShrink: 1,
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.md, // Spacing.md = 16
    borderRadius: 20,
  },
  userBubble: {
    borderBottomRightRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
  },
  assistantActions: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  userActions: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  iconActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  iconButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
});