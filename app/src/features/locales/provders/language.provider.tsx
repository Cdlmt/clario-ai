import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SupportedLanguage } from '../models/types';
import { getSystemLanguage, getStoredLanguage, setStoredLanguage } from '../services/i18n';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  availableLanguages: { code: SupportedLanguage; name: string; flag: string }[];
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const AVAILABLE_LANGUAGES = [
  { code: 'en' as SupportedLanguage, name: 'English', flag: '🇺🇸' },
  { code: 'fr' as SupportedLanguage, name: 'Français', flag: '🇫🇷' },
  { code: 'es' as SupportedLanguage, name: 'Español', flag: '🇪🇸' },
];

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Wait for i18n to be initialized
        await i18n;

        // Get stored language or system language
        const storedLanguage = await getStoredLanguage();
        const initialLanguage = storedLanguage || getSystemLanguage();

        setCurrentLanguage(initialLanguage);
      } catch (error) {
        console.error('Failed to initialize language:', error);
        // Fallback to English
        setCurrentLanguage('en');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, [i18n]);

  const changeLanguage = async (language: SupportedLanguage) => {
    try {
      setIsLoading(true);

      // Change language in i18next
      await i18n.changeLanguage(language);

      // Store the preference
      await setStoredLanguage(language);

      // Update state
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Failed to change language:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    changeLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
