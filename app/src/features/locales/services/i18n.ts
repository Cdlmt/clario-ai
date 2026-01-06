import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from '../translations/en.json';
import fr from '../translations/fr.json';
import es from '../translations/es.json';
import { SupportedLanguage } from '../models/types';

const LANGUAGES: Record<SupportedLanguage, any> = {
  en,
  fr,
  es,
};

const LANGUAGE_STORAGE_KEY = '@app:language';

export const getSystemLanguage = (): SupportedLanguage => {
  const systemLanguage = Localization.getLocales()[0]
    ?.languageCode as SupportedLanguage;

  // Check if the system language is supported, otherwise fallback to English
  return ['en', 'fr', 'es'].includes(systemLanguage) ? systemLanguage : 'en';
};

export const getStoredLanguage =
  async (): Promise<SupportedLanguage | null> => {
    try {
      const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      return stored as SupportedLanguage | null;
    } catch {
      return null;
    }
  };

export const setStoredLanguage = async (
  language: SupportedLanguage
): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Failed to store language preference:', error);
  }
};

const initializeI18n = async () => {
  // Check for stored language preference, otherwise use system language
  const storedLanguage = await getStoredLanguage();
  const language = storedLanguage || getSystemLanguage();

  await i18n.use(initReactI18next).init({
    resources: LANGUAGES,
    lng: language,
    fallbackLng: 'en',

    // Disable suspense for React Native
    react: {
      useSuspense: false,
    },

    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Detection settings (we handle this manually)
    detection: {
      order: [],
    },

    // Debug settings
    debug: __DEV__,
  });

  return i18n;
};

// Initialize i18n
export const i18nInstance = initializeI18n();

export default i18n;
