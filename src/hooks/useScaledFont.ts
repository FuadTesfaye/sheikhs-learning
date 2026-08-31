import { useMemo } from 'react';
import { useSettingsStore } from '../store';
import { FontSize } from '../theme';

export function useScaledFont() {
  const fontScale = useSettingsStore(s => s.fontScale);

  return useMemo(
    () => ({
      xs: FontSize.xs * fontScale,
      sm: FontSize.sm * fontScale,
      md: FontSize.md * fontScale,
      lg: FontSize.lg * fontScale,
      xl: FontSize.xl * fontScale,
      xxl: FontSize.xxl * fontScale,
      xxxl: FontSize.xxxl * fontScale,
      display: FontSize.display * fontScale,
    }),
    [fontScale]
  );
}
