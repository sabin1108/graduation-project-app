import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '@/types/chat';

const MESSAGES_STORAGE_KEY = 'chatMessages';

export const saveMessages = async (messages: Message[]) => {
  try {
    const jsonValue = JSON.stringify(messages);
    await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving messages to AsyncStorage:', error);
  }
};

export const loadMessages = async (): Promise<Message[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
    if (jsonValue === null) {
      return []; // 저장된 메시지가 아직 없습니다.
    }

    let parsedMessages;
    try {
      parsedMessages = JSON.parse(jsonValue);
    } catch (parseError) {
      console.error('Error parsing messages from AsyncStorage:', parseError);
      // 구문 분석에 실패하면 충돌 위험을 감수하는 것보다 빈 배열을 반환하는 것이 안전합니다.
      return [];
    }

    // 구문 분석된 데이터가 배열인지 확인합니다.
    if (!Array.isArray(parsedMessages)) {
      console.error('Stored messages are not in the expected array format.');
      return [];
    }

    // 타임스탬프 문자열을 Date 객체로 다시 변환합니다.
    return parsedMessages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    
  } catch (error) {
    console.error('Error loading messages from AsyncStorage:', error);
    return []; // 다른 오류 발생 시 빈 배열 반환
  }
};

export const clearMessages = async () => {
  try {
    await AsyncStorage.removeItem(MESSAGES_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing messages from AsyncStorage:', error);
  }
};

// --- 글꼴 크기 저장소 ---

const FONT_SIZE_STORAGE_KEY = 'fontSize';

export type FontSize = number;

export const saveFontSize = async (fontSize: FontSize) => {
  try {
    await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize.toString());
  } catch (error) {
    console.error('Error saving font size to AsyncStorage:', error);
  }
};

export const loadFontSize = async (): Promise<FontSize> => {
  try {
    const value = await AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY);
    if (value !== null) {
      const parsedValue = parseFloat(value);
      return isNaN(parsedValue) ? 1 : parsedValue;
    }
  } catch (error) {
    console.error('Error loading font size from AsyncStorage:', error);
  }
  return 1; // 기본 글꼴 크기
};
