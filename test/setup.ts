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
    TurboModuleRegistry: {
      get: () => null,
      getEnforcing: () => ({}),
    },
    Linking: {
      openURL: async () => true,
      canOpenURL: async () => true,
    },
    View: (props: any) => props.children || null,
    Text: (props: any) => props.children || null,
    TouchableOpacity: (props: any) => props.children || null,
  };
});

// Mock @expo/vector-icons
mock.module('@expo/vector-icons', () => ({
  Ionicons: () => null,
  MaterialIcons: () => null,
  FontAwesome: () => null,
}));


const fileSystemMock = {
  documentDirectory: 'file:///data/user/0/com.sheikh.learning/files/',
  cacheDirectory: 'file:///data/user/0/com.sheikh.learning/cache/',
  downloadAsync: async () => ({ uri: 'file:///mocked/path.mp3', status: 200 }),
  createDownloadResumable: () => ({
    downloadAsync: async () => ({ uri: 'file:///mocked/path.mp3', status: 200 }),
    pauseAsync: async () => {},
    resumeAsync: async () => ({ uri: 'file:///mocked/path.mp3', status: 200 }),
  }),
};

mock.module('expo-file-system', () => fileSystemMock);
mock.module('expo-file-system/legacy', () => fileSystemMock);

// Mock expo-av
mock.module('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: async () => ({
        sound: {
          playAsync: async () => {},
          pauseAsync: async () => {},
          setPositionAsync: async () => {},
          setRateAsync: async () => {},
          unloadAsync: async () => {},
          getStatusAsync: async () => ({ isLoaded: true, isPlaying: false }),
        },
        status: { isLoaded: true, durationMillis: 1800000 },
      }),
    },
    setAudioModeAsync: async () => {},
  },
}));

// Mock expo-linking
mock.module('expo-linking', () => ({
  openURL: async () => true,
  canOpenURL: async () => true,
}));



