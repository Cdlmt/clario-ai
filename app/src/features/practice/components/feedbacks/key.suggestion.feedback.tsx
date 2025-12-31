import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, gaps } from '../../../../shared/constants/theme'
import Text from '../../../../shared/ui/text'

export default function KeySuggestionFeedback() {
  return (
    <View style={styles.container}>
      <Text variant="largeBody" weight="medium">Key Suggestion</Text>
      <View style={styles.feedbackContainer}>
        <Text variant="body" weight="medium">Your answer is understandable, but the main point comes a bit late.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: gaps.inner,
  },
  feedbackContainer: {
    width: '100%',
    minHeight: 84,
    borderRadius: 12,
    padding: 10,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
  },
})