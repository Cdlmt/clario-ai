import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors, gaps } from '../../../../shared/constants/theme'
import Text from '../../../../shared/ui/text'
import FeedbackScore from './feedback.score'
import { useTranslation } from '../../../locales'

type LengthFeedbackProps = {
  rating: number;
  durationSeconds: number;
  durationTargetSeconds: number;
  comment: string;
};

export default function LengthFeedback(props: LengthFeedbackProps) {
  const { rating, durationSeconds, durationTargetSeconds, comment } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text variant="largeBody" weight="medium">{t('feedback:length')}</Text>
      <View style={styles.content}>
        <FeedbackScore score={rating} />
        <View style={styles.feedbackContainer}>
          <Text variant="body" weight="medium">{comment}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.durationContainer}>
          <Text variant="body" weight="bold">{t('feedback:time')}</Text>
          <Text variant="body" weight="medium">{durationSeconds}s</Text>
        </View>
        <View style={styles.durationContainer}>
          <Text variant="body" weight="bold">{t('feedback:target')}</Text>
          <Text variant="body" weight="medium">{durationTargetSeconds}s</Text>
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