import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  openAIKey: string;
  storeHours: {
    open: string;
    close: string;
  };
  
  setOpenAIKey: (key: string) => void;
  setStoreHours: (hours: { open: string; close: string }) => void;
  
  isConfigured: () => boolean;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      openAIKey: '',
      storeHours: {
        open: '07:00',
        close: '22:00',
      },
      
      setOpenAIKey: (key) => {
        set({ openAIKey: key });
      },
      
      setStoreHours: (hours) => {
        set({ storeHours: hours });
      },
      
      isConfigured: () => {
        return !!get().openAIKey;
      },
    }),
    {
      name: 'settings-store',
    }
  )
);