import { useTranslation as useI18nextTranslation } from 'react-i18next';

/**
 * Custom hook that wraps react-i18next's useTranslation
 * Use the default react-i18next typing for now, we can improve this later
 */
export function useTranslation() {
  return useI18nextTranslation();
}
