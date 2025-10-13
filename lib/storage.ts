import AsyncStorage from '@react-native-async-storage/async-storage';

// Re-defining the Message interface here for type safety
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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
      return []; // No messages stored yet
    }

    let parsedMessages;
    try {
      parsedMessages = JSON.parse(jsonValue);
    } catch (parseError) {
      console.error('Error parsing messages from AsyncStorage:', parseError);
      // If parsing fails, it's safer to return an empty array than risk crashing
      return [];
    }

    // Ensure that the parsed data is an array before trying to map over it
    if (!Array.isArray(parsedMessages)) {
      console.error('Stored messages are not in the expected array format.');
      return [];
    }

    // Convert timestamp strings back to Date objects
    return parsedMessages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
    
  } catch (error) {
    console.error('Error loading messages from AsyncStorage:', error);
    return []; // Return empty array on other errors
  }
};

// --- Font Size Storage ---

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
  return 1; // Default font size
};
