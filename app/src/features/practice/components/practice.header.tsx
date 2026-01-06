import { StyleSheet, View } from 'react-native'
import React from 'react'
import { usePathname } from 'expo-router';
import { colors, gaps, paddings } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../locales';

// Note: This config uses keys that will be resolved with t() in the component
const STEPS_CONFIG_KEYS = {
  "/practice": "practice:interviewQuestion",
  "/practice/answer": "practice:interviewQuestion",
  "/practice/analyzing": "practice:analyzingAnswer",
  "/practice/feedback": "practice:yourFeedback",
} as const;

type PracticeHeaderProps = {
  theme: 'light' | 'dark';
};

export default function PracticeHeader(props: PracticeHeaderProps) {
  const { theme } = props;
  const { t } = useTranslation();

  const pathname = usePathname();
  const titleKey = STEPS_CONFIG_KEYS[pathname as keyof typeof STEPS_CONFIG_KEYS] ?? "practice:interviewQuestion";
  const title = t(titleKey);
  const questionCategory = t('practice:questionCategory');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold" color={theme === 'light' ? colors.black : colors.white}>{title}</Text>
        <Text variant="largeBody" weight="medium" color={theme === 'light' ? colors.black : colors.white}>{questionCategory}</Text>
      </View>
      <View style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: paddings.horizontal,
    gap: gaps.default,
  },
  content: {
    gap: gaps.inner,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
});