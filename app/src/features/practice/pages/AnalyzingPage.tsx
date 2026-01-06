import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../../shared/ui/text';
import { colors, gaps } from '../../../shared/constants/theme';
import { useTranslation } from '../../locales';

export default function AnalyzingPage() {
  const [timeSpent, setTimeSpent] = useState(0);
  const { t } = useTranslation();

  // Animate the progress indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text
          variant="h1"
          weight="bold"
          color={colors.white}
          style={styles.text}
        >
          {t('practice:processingAnswer')}
        </Text>
        <Text
          variant="largeBody"
          weight="medium"
          color={colors.white}
          style={styles.text}
        >
          {t('practice:usuallyTakesSeconds')}
        </Text>
      </View>
      <ActivityIndicator size="large" color={colors.white} />
      <View style={styles.activityTextContainer}>
        <Text
          variant="largeBody"
          weight="medium"
          color={colors.white}
          style={styles.text}
        >
          {t('practice:reviewingClarity')}
        </Text>
        <Text
          variant="largeBody"
          weight="medium"
          color={timeSpent > 2 ? colors.white : colors.darkGray}
          style={styles.text}
        >
          {t('practice:analyzingStructure')}
        </Text>
        <Text
          variant="largeBody"
          weight="medium"
          color={timeSpent > 4 ? colors.white : colors.darkGray}
          style={styles.text}
        >
          {t('practice:evaluatingCoherence')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textContainer: {
    gap: gaps.inner,
  },
  text: {
    textAlign: 'center',
  },
  activityTextContainer: {
    gap: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
