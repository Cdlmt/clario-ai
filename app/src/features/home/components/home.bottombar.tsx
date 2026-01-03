import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, heights, paddings } from '../../../shared/constants/theme'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../../../shared/ui/button';
import Text from '../../../shared/ui/text';
import { useRouter } from 'expo-router';

export default function HomeBottomBar() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleStartPractice = () => {
    router.push("/practice");
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, height: heights.bottomBar + insets.bottom }]}>
      <Button onPress={handleStartPractice} style={{ backgroundColor: colors.primary }}>
        <Text variant="body" weight="bold" color={colors.white}>Start practice ⚡️</Text>
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