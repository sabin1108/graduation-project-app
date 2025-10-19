import axios from 'axios';

const API_BASE_URL = 'http://211.188.57.74:8080';

export interface ChatRequest {
  message: string;
  userId: string;
}

export interface ChatResponse {
  answer: string;
}

export const sendChatMessage = async (
  message: string,
  userId: string
): Promise<ChatResponse> => {
  try {
    const response = await axios.post<ChatResponse>(
      `${API_BASE_URL}/api/chat/intent`,
      { message, userId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
