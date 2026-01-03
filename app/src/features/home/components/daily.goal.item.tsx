import { StyleSheet, View } from 'react-native'
import React, { useMemo } from 'react'
import Text from '../../../shared/ui/text';
import { colors } from '../../../shared/constants/theme';

export enum DailyGoalState {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed',
  NOT_STARTED = 'not_started',
}

interface DailyGoalItemProps {
  day: string;
  state: DailyGoalState;
}

export function DailyGoalItemIcon({ state }: { state: DailyGoalState }) {
  if (state === DailyGoalState.COMPLETED) {
    return (
      <Text variant="largeBody" weight="regular">✅</Text>
    )
  }

  if (state === DailyGoalState.IN_PROGRESS) {
    return (
      <Text variant="largeBody" weight="regular">⏳</Text>
    )
  }

  if (state === DailyGoalState.FAILED) {
    return (
      <Text variant="largeBody" weight="regular">❌</Text>
    )
  }

  if (state === DailyGoalState.NOT_STARTED) {
    return (
      <Text variant="largeBody" weight="regular">❓</Text>
    )
  }

  return (
    <Text variant="largeBody" weight="regular">❓</Text>
  )
}

export default function DailyGoalItem(props: DailyGoalItemProps) {
  const { day, state } = props;

  const backgroundColor = useMemo(() => {
    switch (state) {
      case DailyGoalState.COMPLETED:
        return "#4EFF3A20";
      case DailyGoalState.IN_PROGRESS:
        return `${colors.secondary}20`;
      case DailyGoalState.FAILED:
        return "#FF272720";
      case DailyGoalState.NOT_STARTED:
      default:
        return "#D0D0D020";
    }
  }, [state]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <DailyGoalItemIcon state={state} />
      <Text variant="text" weight="regular">{day}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '12%',
    height: 60,
    borderRadius: 4,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})