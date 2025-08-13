import { useApp } from '../store/AppContext';
import { mockSettings } from '../mocks/data';

export const useTranslation = () => {
  const { state } = useApp();
  const { language } = state;

  const t = (key: string, fallback?: string): string => {
    const translation = mockSettings.translations[language]?.[key] || 
                        mockSettings.translations['es'][key] || 
                        fallback || 
                        key;
    return translation;
  };

  return { t, language };
};