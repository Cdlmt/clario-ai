import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, heights, paddings } from '../../../shared/constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../../../shared/ui/button';
import Text from '../../../shared/ui/text';
import { usePathname, useRouter } from 'expo-router';
import { usePracticeSessionContext } from '../context/PracticeSessionContext';
import { useTranslation } from '../../locales';

const BUTTON_COLOR = {
  "/practice": colors.secondary,
  "/practice/feedback": colors.primary,
}

// Note: This config uses keys that will be resolved with t() in the component
const BUTTON_TEXT_KEYS = {
  "/practice": "practice:startAnswering",
  "/practice/feedback": "practice:nextQuestion",
}

const BUTTON_ROUTES = {
  "/practice": "/practice/answer",
  "/practice/feedback": "/practice",
}

export default function PracticeBottomBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { reset } = usePracticeSessionContext();
  const { t } = useTranslation();

  const buttonColor = BUTTON_COLOR[pathname as keyof typeof BUTTON_COLOR] ?? colors.primary;
  const buttonTextKey = BUTTON_TEXT_KEYS[pathname as keyof typeof BUTTON_TEXT_KEYS] ?? "practice:startAnswering";
  const buttonText = t(buttonTextKey);
  const buttonRoute = BUTTON_ROUTES[pathname as keyof typeof BUTTON_ROUTES] ?? "/practice/answer";

  const handleStartAnswer = () => {
    // Reset the session when navigating to next question
    if (pathname === "/practice/feedback") {
      reset();
    }
    router.push(buttonRoute);
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, height: heights.bottomBar + insets.bottom }]}>
      <Button onPress={handleStartAnswer} style={{ backgroundColor: buttonColor }}>
        <Text variant="body" weight="bold" color={colors.white}>{buttonText}</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingHorizontal: paddings.horizontal,
    paddingTop: 10,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
})