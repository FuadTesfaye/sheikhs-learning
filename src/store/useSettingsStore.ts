import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, TextSize, UserSettings } from '../types';

const SETTINGS_KEY = '@user_settings';

interface SettingsState extends UserSettings {
  isLoaded: boolean;
  fontScale: number;

  loadSettings: () => Promise<void>;
  setTheme: (theme: ThemeMode) => void;
  setTextSize: (size: TextSize) => void;
  setLanguage: (lang: string) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

const TEXT_SIZE_SCALES: Record<TextSize, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.2,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'system',
  textSize: 'medium',
  language: 'en',
  onboardingCompleted: false,
  isLoaded: false,
  fontScale: 1.0,

  loadSettings: async () => {
    try {
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      if (json) {
        const settings: UserSettings = JSON.parse(json);
        set({
          ...settings,
          fontScale: TEXT_SIZE_SCALES[settings.textSize],
          isLoaded: true,
        });
      } else {
        set({ isLoaded: true });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
      set({ isLoaded: true });
    }
  },

  setTheme: (theme) => {
    set({ theme });
    _persist(get());
  },

  setTextSize: (size) => {
    set({ textSize: size, fontScale: TEXT_SIZE_SCALES[size] });
    _persist(get());
  },

  setLanguage: (lang) => {
    set({ language: lang });
    _persist(get());
  },

  setOnboardingCompleted: (completed) => {
    set({ onboardingCompleted: completed });
    _persist(get());
  },
}));

function _persist(state: SettingsState) {
  const settings: UserSettings = {
    theme: state.theme,
    textSize: state.textSize,
    language: state.language,
    onboardingCompleted: state.onboardingCompleted,
  };
  AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)).catch(console.error);
}
