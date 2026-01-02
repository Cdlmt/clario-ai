import { useCallback, useEffect, useState } from 'react';
import { usePracticeSessionContext } from '../context/PracticeSessionContext';
import { createQuestion, Question } from '../models/question';
import { fetchRandomQuestion } from '../services/fetchQuestion.service';

type UseFetchQuestionReturn = {
  question: Question | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useFetchQuestion(category?: string): UseFetchQuestionReturn {
  const { session, startSession } = usePracticeSessionContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const existingQuestion =
    session.status !== 'idle' && 'question' in session
      ? session.question ?? null
      : null;

  const loadQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const questionData = await fetchRandomQuestion(category);
      const question = createQuestion(questionData.text, questionData.category);
      startSession(question);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load question';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [category, startSession]);

  useEffect(() => {
    if (session.status === 'idle') {
      loadQuestion();
    } else {
      setIsLoading(false);
    }
  }, []);

  return {
    question: existingQuestion,
    isLoading,
    error,
    refetch: loadQuestion,
  };
}
