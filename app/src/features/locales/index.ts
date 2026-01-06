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

// Language provider and hook
export { LanguageProvider, useLanguage } from './provders/language.provider';
