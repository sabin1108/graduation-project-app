import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/Spacing';
import { useTextStyles } from '@/hooks/use-font-size';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const theme = useAppTheme();
  const TextStyles = useTextStyles();
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={[styles.inputContainer, { 
      backgroundColor: theme.neutral.white, 
      borderTopColor: theme.neutral.gray200 
    }]}>
      <TextInput
        style={[styles.textInput, { 
          ...TextStyles.body, // Apply body text style
          backgroundColor: theme.neutral.gray100, 
          color: theme.neutral.gray900,
        }]}
        placeholder="메시지를 입력하세요..."
        placeholderTextColor={theme.neutral.gray400}
        multiline
        value={message}
        onChangeText={setMessage}
      />
      <Pressable 
        style={({ pressed }) => [
          styles.sendButton, 
          { 
            backgroundColor: theme.primary.light, // Using primary.light for send button
            opacity: pressed ? 0.7 : 1 
          }
        ]}
        onPress={handleSendMessage}
        disabled={!message.trim()}
      >
        <Ionicons name="arrow-up" size={24} color={theme.neutral.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: Spacing.md, // 16
    paddingVertical: Spacing.md, // 12
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md, // 12
  },
  textInput: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: Spacing.md, // 12
    paddingHorizontal: Spacing.lg, // 20
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
