export type SupportedLanguage = 'en' | 'fr' | 'es';

export interface TranslationResources {
  common: {
    buttons: {
      save: string;
      cancel: string;
      confirm: string;
      start: string;
      stop: string;
      continue: string;
      back: string;
      next: string;
    };
    errors: {
      network: string;
      unknown: string;
      permission: string;
      timeout: string;
    };
    loading: string;
    retry: string;
  };
  auth: {
    login: string;
    logout: string;
    signUp: string;
    email: string;
    password: string;
    forgotPassword: string;
    welcome: string;
  };
  practice: {
    title: string;
    startRecording: string;
    stopRecording: string;
    recording: string;
    analyzing: string;
    feedback: string;
    tryAgain: string;
  };
  settings: {
    title: string;
    language: string;
    selectLanguage: string;
  };
}

export type TranslationKey = keyof TranslationResources;
export type NestedTranslationKey<T extends TranslationKey> = keyof TranslationResources[T];
