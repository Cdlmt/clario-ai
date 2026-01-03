import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';

type StreakCardItemProps = {
  value: string;
  label: string;
  icon: string;
}

export default function StreakCardItem(props: StreakCardItemProps) {
  const { value, label, icon } = props;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="h2" weight="bold" color={colors.white}>{value}</Text>
        <Text variant="body" weight="medium" color={colors.white}>{label}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Text variant="h2" weight="regular">{icon}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '32%',
    height: 100,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  titleContainer: {
  },
  iconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    alignItems: 'flex-end',
  },
})