import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, heights, paddings } from '../../../shared/constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../../../shared/ui/button';
import Text from '../../../shared/ui/text';
import { usePathname, useRouter } from 'expo-router';

const BUTTON_COLOR = {
  "/practice": colors.secondary,
  "/practice/feedback": colors.primary,
}

const BUTTON_TEXT = {
  "/practice": "Start answering  🎙️️",
  "/practice/feedback": "Next question ⚡️",
}

export default function PracticeBottomBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const buttonColor = BUTTON_COLOR[pathname as keyof typeof BUTTON_COLOR] ?? colors.primary;
  const buttonText = BUTTON_TEXT[pathname as keyof typeof BUTTON_TEXT] ?? "Start answering  🎙️️";

  const handleStartAnswer = () => {
    router.push("/practice/answer");
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