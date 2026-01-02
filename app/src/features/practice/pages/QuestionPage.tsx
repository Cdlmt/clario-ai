import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../../shared/ui/text';
import { gaps, heights } from '../../../shared/constants/theme';
import ProgressBar from '../components/progress.bar';
import { usePathname, useRouter } from 'expo-router';
import { useFetchQuestion } from '../hooks/useFetchQuestion';

const INITIAL_TIMER = 30;

export default function QuestionPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { question, isLoading, error, refetch } = useFetchQuestion();
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIMER);

  const handleStartAnswer = () => {
    router.push('/practice/answer');
  };

  useEffect(() => {
    if (pathname !== '/practice' || isLoading || error) {
      return;
    }

    if (timeLeft <= 0) {
      handleStartAnswer();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isLoading, error, pathname]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#fff" />
          <Text variant="body" weight="medium">
            Loading your question...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContent}>
          <Text variant="h2" weight="bold">
            ⚠️ Oops!
          </Text>
          <Text variant="body" weight="medium">
            {error}
          </Text>
          <Text
            variant="body"
            weight="bold"
            onPress={refetch}
            style={styles.retryButton}
          >
            Tap to retry
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text variant="h1" weight="bold">
            "{question?.text}"
          </Text>
          <Text variant="body" weight="medium">
            Take a few seconds to think before answering.
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <Text variant="h1" weight="bold">
            ⏳ {timeLeft}s..
          </Text>
          <ProgressBar initialTimer={INITIAL_TIMER} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: heights.bottomBar,
  },
  content: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: gaps.inner,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: gaps.inner,
    paddingHorizontal: 24,
  },
  questionContainer: {
    gap: gaps.inner,
  },
  progressBarContainer: {
    width: '100%',
    gap: gaps.inner,
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
