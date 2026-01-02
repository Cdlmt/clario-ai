import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Text from '../../../shared/ui/text';
import { gaps, heights } from '../../../shared/constants/theme';
import ProgressBar from '../components/progress.bar';
import { usePathname, useRouter } from 'expo-router';
import { usePracticeSessionContext } from '../context/PracticeSessionContext';
import { createQuestion } from '../models/question';

const INITIAL_TIMER = 30;
const DEFAULT_QUESTION =
  'Tell me about a technical challenge you recently faced and how you solved it.';

export default function QuestionPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, startSession } = usePracticeSessionContext();
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIMER);

  // Initialize session with a question if not already set
  useEffect(() => {
    if (session.status === 'idle') {
      const question = createQuestion(DEFAULT_QUESTION, 'Technical');
      startSession(question);
    }
  }, [session.status, startSession]);

  const currentQuestion =
    session.status !== 'idle' && 'question' in session
      ? session.question?.text
      : DEFAULT_QUESTION;

  const handleStartAnswer = () => {
    router.push('/practice/answer');
  };

  useEffect(() => {
    if (pathname !== '/practice') {
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
  }, [timeLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.questionContainer}>
          <Text variant="h1" weight="bold">
            "{currentQuestion}"
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
  questionContainer: {
    gap: gaps.inner,
  },
  progressBarContainer: {
    width: '100%',
    gap: gaps.inner,
    alignItems: 'center',
  },
});
