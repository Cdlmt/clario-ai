import { StyleSheet, View } from 'react-native'
import React, { useMemo } from 'react'
import { usePathname } from 'expo-router';
import { colors, gaps, paddings } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../locales';
import { usePracticeSessionContext } from '../context/PracticeSessionContext';
import { JobIndustry, QuestionCategory } from '../services/fetchQuestion.service';

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
  const { session } = usePracticeSessionContext();
  const { t } = useTranslation();

  const question = useMemo(() => 'question' in session ? session.question : null, [session]);

  const pathname = usePathname();
  const titleKey = STEPS_CONFIG_KEYS[pathname as keyof typeof STEPS_CONFIG_KEYS] ?? "practice:interviewQuestion";
  const title = t(titleKey);

  const industry = useMemo(() => (question?.industry as JobIndustry)?.name ? (question?.industry as JobIndustry).name : question?.industry, [question]);
  const category = useMemo(() => (question?.category as QuestionCategory)?.name ? (question?.category as QuestionCategory).name : question?.category, [question]);

  const subTitle = `${industry} · ${category}`;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold" color={theme === 'light' ? colors.black : colors.white}>{title}</Text>
        <Text variant="largeBody" weight="medium" color={theme === 'light' ? colors.black : colors.white}>{subTitle}</Text>
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