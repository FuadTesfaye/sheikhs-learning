import { useMemo } from 'react';
import { useSettingsStore } from '../store';
import { translations, TranslationDictionary } from '../i18n/translations';
import { SupportedLanguage } from '../types';

export function useTranslation() {
  const language = useSettingsStore(s => s.language) || 'ar';
  const setLanguage = useSettingsStore(s => s.setLanguage);

  const t: TranslationDictionary = useMemo(() => {
    return translations[language] || translations.ar || translations.en;
  }, [language]);

  const isRTL = language === 'ar';

  return {
    t,
    language,
    isRTL,
    setLanguage,
  };
}
