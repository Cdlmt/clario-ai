import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, gaps } from '../../../../shared/constants/theme'
import Text from '../../../../shared/ui/text'

type KeySuggestionFeedbackProps = {
  suggestion: string;
};

export default function KeySuggestionFeedback(props: KeySuggestionFeedbackProps) {
  const { suggestion } = props;

  return (
    <View style={styles.container}>
      <Text variant="largeBody" weight="medium">Key Suggestion</Text>
      <View style={styles.feedbackContainer}>
        <Text variant="body" weight="medium">{suggestion}</Text>
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