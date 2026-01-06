import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, gaps } from '../../../../shared/constants/theme'
import Text from '../../../../shared/ui/text'
import FeedbackScore from './feedback.score'
import { useTranslation } from '../../../locales'

type ConfidenceIndicatorFeedbackProps = {
  rating: number;
  comment: string;
};

export default function ConfidenceIndicatorFeedback(props: ConfidenceIndicatorFeedbackProps) {
  const { rating, comment } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text variant="largeBody" weight="medium">{t('feedback:confidenceIndicator')}</Text>
      <View style={styles.content}>
        <FeedbackScore score={rating} />
        <View style={styles.feedbackContainer}>
          <Text variant="body" weight="medium">{comment}</Text>
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
})