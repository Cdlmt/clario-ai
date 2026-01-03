import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { gaps } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';
import Divider from '../../../shared/components/divider';
import DailyGoals from '../components/daily.goals';
import SpecificPractices from '../components/specific.practices';
import StreakCards from '../components/streak.cards';

export default function HomePage() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.titleContainer}>
        <Text variant="h2" weight="bold">{`Practice your \ninterview 🧪`}</Text>
        <Text variant="largeBody" weight="medium">Answer one question, get instant feedback</Text>
      </View>
      <Divider />
      <DailyGoals />
      <StreakCards />
      <Divider />
      <SpecificPractices />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    gap: gaps.default,
  },
  titleContainer: {
    gap: gaps.inner,
  },
});