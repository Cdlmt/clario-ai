import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { gaps } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';
import Divider from '../../../shared/components/divider';
import DailyGoals from '../components/daily.goals';
import SpecificPractices from '../components/specific.practices';
import StreakCards from '../components/streak.cards';
import { useTranslation } from '../../locales';
import SignoutButton from '../components/signout.button';
import DeleteAccountButton from '../components/delete.account.button';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.titleContainer}>
        <Text variant="h2" weight="bold">{t('home:title')}</Text>
        <Text variant="largeBody" weight="medium">{t('home:subtitle')}</Text>
      </View>
      <Divider />
      <DailyGoals />
      <StreakCards />
      <Divider />
      {/* <SpecificPractices />
      <Divider /> */}
      <SignoutButton />
      <DeleteAccountButton />
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