export const Dimensions = {
  get: () => ({ width: 375, height: 812 }),
};

export const PixelRatio = {
  roundToNearestPixel: (n: number) => Math.round(n),
};

export const Platform = {
  OS: 'android',
  select: (obj: any) => obj.android || obj.default,
};

export const StyleSheet = {
  create: (obj: any) => obj,
};

export const useColorScheme = () => 'light';

export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: () => ({}),
};

export const Linking = {
  openURL: async () => true,
  canOpenURL: async () => true,
};

export const View = (props: any) => props.children || null;
export const Text = (props: any) => props.children || null;
export const TouchableOpacity = (props: any) => props.children || null;
export const ScrollView = (props: any) => props.children || null;
export const ActivityIndicator = () => null;

export default {
  Dimensions,
  PixelRatio,
  Platform,
  StyleSheet,
  useColorScheme,
  TurboModuleRegistry,
  Linking,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
};
