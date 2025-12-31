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
      <ClarityFeedback />
      <LengthFeedback />
      <WeakWordsFeedback />
      <KeySuggestionFeedback />
      <ConcisenessFeedback />
      <ConfidenceIndicatorFeedback />
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