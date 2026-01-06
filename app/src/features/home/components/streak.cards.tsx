import { StyleSheet, View } from 'react-native'
import React from 'react'
import StreakCardItem from './streak.card.item'
import { useStreakStats } from '../hooks/useStreakStats'
import { useTranslation } from '../../locales'

export default function StreakCards() {
  const { streakStats, isLoading } = useStreakStats();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StreakCardItem value="..." label={t('streak:streakDays')} icon="🔥" />
        <StreakCardItem value="..." label={t('streak:totalAnswers')} icon="⚡️" />
        <StreakCardItem value="..." label={t('streak:avgLength')} icon="⏱️" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StreakCardItem
        value={streakStats.currentStreak.toString()}
        label={t('streak:streakDays')}
        icon="🔥"
      />
      <StreakCardItem
        value={streakStats.totalAnswers.toString()}
        label={t('streak:totalAnswers')}
        icon="⚡️"
      />
      <StreakCardItem
        value={streakStats.averageLength}
        label={t('streak:avgLength')}
        icon="⏱️"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})