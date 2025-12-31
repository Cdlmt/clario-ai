import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ClarityFeedback from '../components/feedbacks/clarity.feedback'
import { gaps, heights } from '../../../shared/constants/theme'
import ConcisenessFeedback from '../components/feedbacks/conciseness.feedback'
import ConfidenceIndicatorFeedback from '../components/feedbacks/confidence.indicator.feedback'
import KeySuggestionFeedback from '../components/feedbacks/key.suggestion.feedback'
import LengthFeedback from '../components/feedbacks/length.feedback'
import WeakWordsFeedback from '../components/feedbacks/weak.words.feedback'

export default function FeedbackPage() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <ClarityFeedback rating={89} comment="Your answer is understandable, but the main point comes a bit late." />
      <LengthFeedback rating={50} durationSeconds={124} durationTargetSeconds={90} comment="Your answer is understandable, but the main point comes a bit late." />
      <WeakWordsFeedback rating={18} words={[{ word: 'Actually', count: 2 }, { word: 'However', count: 1 }]} comment="Your answer is understandable, but the main point comes a bit late." />
      <KeySuggestionFeedback suggestion="Use the word 'actually' instead of 'in fact' to make your answer more natural." />
      <ConcisenessFeedback rating={28} comment="Your answer is too verbose. Try to be more concise and direct." />
      <ConfidenceIndicatorFeedback rating={57} comment="Your answer is confident and clear, but you could improve your delivery." />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  contentContainer: {
    gap: gaps.default,
    paddingBottom: heights.bottomBar + 10,
  }
})