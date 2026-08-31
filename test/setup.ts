import { mock } from 'bun:test';

// Mock AsyncStorage
mock.module('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    default: {
      getItem: async (key: string) => store.get(key) || null,
      setItem: async (key: string, val: string) => {
        store.set(key, val);
      },
      removeItem: async (key: string) => {
        store.delete(key);
      },
      multiRemove: async (keys: string[]) => {
        keys.forEach(k => store.delete(k));
      },
      clear: async () => {
        store.clear();
      },
    },
  };
});

// Mock react-native Dimensions & PixelRatio
mock.module('react-native', () => {
  return {
    Dimensions: {
      get: () => ({ width: 375, height: 812 }),
    },
    PixelRatio: {
      roundToNearestPixel: (n: number) => Math.round(n),
    },
    Platform: {
      OS: 'android',
      select: (obj: any) => obj.android || obj.default,
    },
    StyleSheet: {
      create: (obj: any) => obj,
    },
    useColorScheme: () => 'light',
  };
});
