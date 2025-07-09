import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  
  getMessagesByScheduleVersion: (version: number) => ChatMessage[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      
      addMessage: (messageData) => {
        const newMessage: ChatMessage = {
          ...messageData,
          id: uuidv4(),
          timestamp: new Date(),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },
      
      clearMessages: () => {
        set({ messages: [] });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      getMessagesByScheduleVersion: (version) => {
        return get().messages.filter(
          (msg) => msg.scheduleVersion === version
        );
      },
    }),
    {
      name: 'chat-store',
    }
  )
);