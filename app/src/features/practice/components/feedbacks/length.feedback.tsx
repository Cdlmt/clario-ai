import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, gaps } from '../../../../shared/constants/theme'
import Text from '../../../../shared/ui/text'
import FeedbackScore from './feedback.score'

export default function LengthFeedback() {
  return (
    <View style={styles.container}>
      <Text variant="largeBody" weight="medium">Length</Text>
      <View style={styles.content}>
        <FeedbackScore score={75} />
        <View style={styles.feedbackContainer}>
          <Text variant="body" weight="medium">Your answer is understandable, but the main point comes a bit late.</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.durationContainer}>
          <Text variant="body" weight="bold">Time ⏱️</Text>
          <Text variant="body" weight="medium">124s</Text>
        </View>
        <View style={styles.durationContainer}>
          <Text variant="body" weight="bold">Target 🎯</Text>
          <Text variant="body" weight="medium">60s-90s</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: gaps.inner,
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    gap: gaps.inner,
  },
  feedbackContainer: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    height: 84,
    borderRadius: 12,
    padding: 10,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
  },
  durationContainer: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    minHeight: 64,
    padding: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  }
})