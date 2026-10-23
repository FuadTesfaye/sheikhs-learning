import { mock } from 'bun:test';
import { plugin } from 'bun';
import { resolve } from 'path';

plugin({
  name: 'mock-react-native',
  setup(build) {
    build.onResolve({ filter: /^react-native$/ }, () => {
      return { path: resolve(__dirname, './mocks/react-native.ts') };
    });
    build.onLoad({ filter: /\.(png|jpg|jpeg|gif|webp|svg)$/ }, () => {
      return {
        contents: 'module.exports = 1;',
        loader: 'js',
      };
    });
  },
});

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
    Image: () => null,
    TouchableOpacity: (props: any) => props.children || null,
    ScrollView: (props: any) => props.children || null,
    FlatList: (props: any) => props.children || null,
    TextInput: (props: any) => null,
    ActivityIndicator: () => null,
    PanResponder: {
      create: (config: any) => ({
        panHandlers: {},
        ...config,
      }),
    },
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



