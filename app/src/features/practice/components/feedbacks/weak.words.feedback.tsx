import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, gaps } from '../../../../shared/constants/theme'
import Text from '../../../../shared/ui/text'
import FeedbackScore from './feedback.score'

export default function WeakWordsFeedback() {
  return (
    <View style={styles.container}>
      <Text variant="largeBody" weight="medium">Weak Words</Text>
      <View style={styles.content}>
        <FeedbackScore score={75} />
        <View style={styles.feedbackContainer}>
          <Text variant="body" weight="medium">Your answer is understandable, but the main point comes a bit late.</Text>
        </View>
      </View>
      <View style={styles.wordsContainer}>
        <Text variant="body" weight="bold">List of words</Text>
        <View style={styles.wordsList}>
          <Text variant="body" weight="medium">Maybe (3x)</Text>
          <Text variant="body" weight="medium">Actually (2x)</Text>
          <Text variant="body" weight="medium">However (1x)</Text>
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
  wordsContainer: {
    width: '100%',
    minHeight: 64,
    padding: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  wordsList: {
    width: '100%',
    flexDirection: 'column',
  },
})