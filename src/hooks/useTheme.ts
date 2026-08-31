import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from '../theme';
import { useSettingsStore } from '../store';

export function useTheme(): { colors: ColorScheme; isDark: boolean } {
  const systemScheme = useColorScheme();
  const theme = useSettingsStore(s => s.theme);

  const isDark = theme === 'system' ? systemScheme === 'dark' : theme === 'dark';
  return {
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
  };
}
