import { StyleSheet, View } from 'react-native'
import React from 'react'
import Text from '../../../shared/ui/text';
import { gaps } from '../../../shared/constants/theme';
import DailyGoalItem, { DailyGoalState } from './daily.goal.item';
import { useDailyGoals } from '../hooks/useDailyGoals';
import { useTranslation } from '../../locales';

export default function DailyGoals() {
  const { goals, isLoading } = useDailyGoals();
  const { t } = useTranslation();

  const completedCount = goals.filter(goal => goal.state === DailyGoalState.COMPLETED).length;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text variant="largeBody" weight="medium">{t('home:dailyGoals')}</Text>
          <Text variant="smallBody" weight="regular">{t('home:loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="largeBody" weight="medium">{t('home:dailyGoals')}</Text>
        <Text variant="smallBody" weight="regular">{completedCount}/7</Text>
      </View>
      <View style={styles.goalsContainer}>
        {goals.map((goal) => (
          <DailyGoalItem key={goal.day} day={goal.day} state={goal.state} />
        ))}
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