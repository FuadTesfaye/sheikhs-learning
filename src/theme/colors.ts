export interface ColorScheme {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  overlay: string;
  card: string;
  tabBar: string;
  tabBarBorder: string;
  icon: string;
  iconActive: string;
  progressTrack: string;
  progressFill: string;
}

export const Colors: { light: ColorScheme; dark: ColorScheme } = {
  light: {
    primary: '#1B5E20',
    primaryLight: '#4CAF50',
    primaryDark: '#0D3B13',
    accent: '#FF8F00',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    textTertiary: '#9E9E9E',
    border: '#E0E0E0',
    error: '#D32F2F',
    success: '#388E3C',
    warning: '#F57C00',
    overlay: 'rgba(0,0,0,0.5)',
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E0E0E0',
    icon: '#757575',
    iconActive: '#1B5E20',
    progressTrack: '#E8F5E9',
    progressFill: '#4CAF50',
  },
  dark: {
    primary: '#4CAF50',
    primaryLight: '#81C784',
    primaryDark: '#1B5E20',
    accent: '#FFB300',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2C2C2C',
    text: '#FAFAFA',
    textSecondary: '#B0B0B0',
    textTertiary: '#757575',
    border: '#333333',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFA726',
    overlay: 'rgba(0,0,0,0.7)',
    card: '#1E1E1E',
    tabBar: '#1E1E1E',
    tabBarBorder: '#333333',
    icon: '#B0B0B0',
    iconActive: '#4CAF50',
    progressTrack: '#1B3A1D',
    progressFill: '#4CAF50',
  },
};
