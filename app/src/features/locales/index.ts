export { default as i18n } from './services/i18n';
export { i18nInstance } from './services/i18n';
export type {
  SupportedLanguage,
  TranslationResources,
  TranslationKey,
  NestedTranslationKey,
} from './models/types';
export {
  getSystemLanguage,
  getStoredLanguage,
  setStoredLanguage,
} from './services/i18n';

// Hooks and components
export { useTranslation } from './hooks/useTranslation';
export { LanguageProvider, useLanguage } from './components/languageProvider';
