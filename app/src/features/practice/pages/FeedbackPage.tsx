import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import ClarityFeedback from '../components/feedbacks/clarity.feedback';
import { colors, gaps, heights } from '../../../shared/constants/theme';
import ConcisenessFeedback from '../components/feedbacks/conciseness.feedback';
import ConfidenceIndicatorFeedback from '../components/feedbacks/confidence.indicator.feedback';
import KeySuggestionFeedback from '../components/feedbacks/key.suggestion.feedback';
import LengthFeedback from '../components/feedbacks/length.feedback';
import WeakWordsFeedback from '../components/feedbacks/weak.words.feedback';
import { usePracticeSessionContext } from '../context/PracticeSessionContext';
import Text from '../../../shared/ui/text';

export default function FeedbackPage() {
  const { session } = usePracticeSessionContext();

  console.log('session', session);

  // Handle error state
  if (session.status === 'error') {
    return (
      <View style={styles.errorContainer}>
        <Text variant="h1" weight="bold" color={colors.black}>
          Oops!
        </Text>
        <Text variant="body" weight="medium" color={colors.black}>
          {session.errorMessage}
        </Text>
      </View>
    );
  }

  // Handle loading/processing state
  if (session.status !== 'feedback') {
    return (
      <View style={styles.errorContainer}>
        <Text variant="body" weight="medium" color={colors.black}>
          Loading feedback...
        </Text>
      </View>
    );
  }

  const { feedback } = session;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ClarityFeedback
        rating={feedback.clarity.rating}
        comment={feedback.clarity.comment}
      />
      <LengthFeedback
        rating={feedback.length.rating}
        durationSeconds={feedback.length.durationSeconds}
        durationTargetSeconds={feedback.length.durationTargetSeconds}
        comment={feedback.length.comment}
      />
      <WeakWordsFeedback
        rating={feedback.weak_words.rating}
        words={feedback.weak_words.words}
        comment={feedback.weak_words.comment}
      />
      <KeySuggestionFeedback suggestion={feedback.key_suggestion} />
      <ConcisenessFeedback
        rating={feedback.conciseness.rating}
        comment={feedback.conciseness.comment}
      />
      <ConfidenceIndicatorFeedback
        rating={feedback.confidence_indicator.rating}
        comment={feedback.confidence_indicator.comment}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  contentContainer: {
    gap: gaps.default,
    paddingBottom: heights.bottomBar + 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: gaps.default,
    padding: 20,
  },
});
