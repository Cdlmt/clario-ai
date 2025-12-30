import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Text from '../../../shared/ui/text'
import { gaps } from '../../../shared/constants/theme'
import ProgressBar from '../components/progress.bar'

const initialTimer = 30;

export default function QuestionPage() {
  const [timeLeft, setTimeLeft] = useState(initialTimer);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text variant="h1" weight="bold">"Tell me about a technical challenge you recently faced and how you solved it."</Text>
          <Text variant="body" weight="medium">Take a few seconds to think before answering.</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <Text variant="h1" weight="bold">⏳ {timeLeft}s..</Text>
          <ProgressBar initialTimer={initialTimer} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
  },
  questionContainer: {
    gap: gaps.inner,
  },
  progressBarContainer: {
    width: '100%',
    gap: gaps.inner,
    alignItems: 'center',
  },
})