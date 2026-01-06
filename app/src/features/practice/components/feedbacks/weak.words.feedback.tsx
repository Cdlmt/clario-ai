import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, gaps } from '../../../../shared/constants/theme'
import Text from '../../../../shared/ui/text'
import { useTranslation } from '../../../locales'
import FeedbackScore from './feedback.score'
import { WeakWord } from '../../models/feedback'

type WeakWordsFeedbackProps = {
  rating: number;
  words: WeakWord[];
  comment: string;
};

export default function WeakWordsFeedback(props: WeakWordsFeedbackProps) {
  const { rating, words, comment } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text variant="largeBody" weight="medium">{t('feedback:weakWords')}</Text>
      <View style={styles.content}>
        <FeedbackScore score={rating} />
        <View style={styles.feedbackContainer}>
          <Text variant="body" weight="medium">{comment}</Text>
        </View>
      </View>
      <View style={styles.wordsContainer}>
        <Text variant="body" weight="bold">{t('feedback:listOfWords')}</Text>
        <View style={styles.wordsList}>
          {words.map((word) => (
            <Text variant="body" weight="medium" key={word.word}>{word.word} ({word.count}x)</Text>
          ))}
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