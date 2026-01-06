import { useCallback, useEffect, useState } from 'react';
import { usePracticeSessionContext } from '../context/PracticeSessionContext';
import { createQuestion, Question } from '../models/question';
import { fetchRandomQuestion } from '../services/fetchQuestion.service';
import { useMembership } from '../../membership/hooks/useMembership';

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
  const { canPerformAction, showUpgradePrompt, refreshMembershipIfNeeded } =
    useMembership();

  const existingQuestion =
    session.status !== 'idle' && 'question' in session
      ? session.question ?? null
      : null;

  const loadQuestion = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Refresh membership data if needed before checking limits
      await refreshMembershipIfNeeded();

      // Check if user can perform the transcribe action before loading new question
      const canProceed = await canPerformAction('transcribe');
      if (!canProceed) {
        await showUpgradePrompt();
        setIsLoading(false);
        return;
      }

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
  }, [
    category,
    startSession,
    canPerformAction,
    showUpgradePrompt,
    refreshMembershipIfNeeded,
  ]);

  useEffect(() => {
    if (session.status === 'idle') {
      loadQuestion();
    } else {
      setIsLoading(false);
    }
  }, [session.status, loadQuestion]);

  return {
    question: existingQuestion,
    isLoading,
    error,
    refetch: loadQuestion,
  };
}
