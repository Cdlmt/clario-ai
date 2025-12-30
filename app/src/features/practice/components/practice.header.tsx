import { StyleSheet, View } from 'react-native'
import React from 'react'
import { usePathname } from 'expo-router';
import { colors, gaps, paddings } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STEPS_CONFIG = {
  "/practice": "Interview question",
  "/practice/answer": "Interview question",
  "/practice/analysis": "Analyzing answer",
  "/practice/feedback": "Your feedback",
} as const;

type PracticeHeaderProps = {
  theme: 'light' | 'dark';
};

export default function PracticeHeader(props: PracticeHeaderProps) {
  const { theme } = props;

  const pathname = usePathname();
  const title = STEPS_CONFIG[pathname as keyof typeof STEPS_CONFIG] ?? "Interview question";
  const questionCategory = "Developer · Behavioral";
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