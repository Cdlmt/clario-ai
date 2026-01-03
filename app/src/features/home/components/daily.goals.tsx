import { StyleSheet, View } from 'react-native'
import React from 'react'
import Text from '../../../shared/ui/text';
import { gaps } from '../../../shared/constants/theme';
import DailyGoalItem, { DailyGoalState } from './daily.goal.item';

export default function DailyGoals() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="largeBody" weight="medium">🗓️ Daily goals</Text>
        <Text variant="smallBody" weight="regular">2/7</Text>
      </View>
      <View style={styles.goalsContainer}>
        <DailyGoalItem day="Mon" state={DailyGoalState.COMPLETED} />
        <DailyGoalItem day="Tue" state={DailyGoalState.FAILED} />
        <DailyGoalItem day="Wed" state={DailyGoalState.COMPLETED} />
        <DailyGoalItem day="Thu" state={DailyGoalState.IN_PROGRESS} />
        <DailyGoalItem day="Fri" state={DailyGoalState.NOT_STARTED} />
        <DailyGoalItem day="Sat" state={DailyGoalState.NOT_STARTED} />
        <DailyGoalItem day="Sun" state={DailyGoalState.NOT_STARTED} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: gaps.inner,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})