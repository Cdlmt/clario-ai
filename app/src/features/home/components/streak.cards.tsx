import { StyleSheet, View } from 'react-native'
import React from 'react'
import StreakCardItem from './streak.card.item'
import { useStreakStats } from '../hooks/useStreakStats'

export default function StreakCards() {
  const { streakStats, isLoading } = useStreakStats();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StreakCardItem value="..." label={'Streak \ndays'} icon="🔥" />
        <StreakCardItem value="..." label={'Total \nanswers'} icon="⚡️" />
        <StreakCardItem value="..." label={'Avg \nlength'} icon="⏱️" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StreakCardItem
        value={streakStats.currentStreak.toString()}
        label={'Streak \ndays'}
        icon="🔥"
      />
      <StreakCardItem
        value={streakStats.totalAnswers.toString()}
        label={'Total \nanswers'}
        icon="⚡️"
      />
      <StreakCardItem
        value={streakStats.averageLength}
        label={'Avg \nlength'}
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