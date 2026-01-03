import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StreakCardItem from './streak.card.item'

export default function StreakCards() {
  return (
    <View style={styles.container}>
      <StreakCardItem value="10" label={'Streak \ndays'} icon="🔥" />
      <StreakCardItem value="12" label={'Total \nanswers'} icon="⚡️" />
      <StreakCardItem value="1m39" label={'Avg \nlength'} icon="⏱️" />
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