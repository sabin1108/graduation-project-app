import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import * as Clipboard from 'expo-clipboard';
import * as Speech from 'expo-speech';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/Spacing';
import { TextStyles } from '@/constants/Typography';

// Define the Message interface locally for this component
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const theme = useAppTheme();
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await Clipboard.setStringAsync(message.content);
    // TODO: Add a toast notification here later
  };

  const handleSpeak = () => {
    Speech.isSpeakingAsync().then(isSpeaking => {
      if (isSpeaking) {
        Speech.stop();
      }
      Speech.speak(message.content, { language: 'ko-KR' });
    });
  };

  const bubbleStyle = isUser 
    ? [styles.bubble, styles.userBubble, { backgroundColor: theme.chat.userBubble }]
    : [styles.bubble, styles.assistantBubble, { backgroundColor: theme.neutral.gray200 }];
  
  const userTextStyle = isUser ? { color: theme.chat.userText } : {};
  const assistantTextStyle = !isUser ? { color: theme.chat.assistantText } : {};

  const align: 'right' | 'left' = isUser ? 'right' : 'left';

  const timestampStyle = [
    TextStyles.tiny, // Using tiny for timestamp as per design guide's small text
    { color: theme.chat.timestamp, textAlign: align },
  ];

  const markdownStyle = {
    body: {
      ...TextStyles.body, // Using TextStyles.body for message text
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
          <Text style={markdownStyle.body}>
            {message.content}
          </Text>
        </View>
        <View style={isUser ? styles.userActions : styles.assistantActions}>
            <Text style={timestampStyle}>
                {new Date(message.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {!isUser && (
              <View style={styles.iconActions}>
                <Pressable onPress={handleCopy} style={styles.iconButton}>
                  <MaterialCommunityIcons name="content-copy" size={18} color={theme.neutral.gray600} />
                </Pressable>
                <Pressable onPress={handleSpeak} style={styles.iconButton}>
                  <Ionicons name="volume-high" size={18} color={theme.neutral.gray600} />
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
    marginBottom: Spacing.sm, // Changed from Spacing.md to Spacing.sm (8)
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
    maxWidth: '75%',
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.md, // Spacing.md is 16
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