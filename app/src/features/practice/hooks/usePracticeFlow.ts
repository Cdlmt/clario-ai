import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAudioRecording } from './useAudioRecording';
import { usePracticeSessionContext } from '../context/PracticeSessionContext';
import { transcribeAudio } from '../services/transcribeAudio.service';
import { analyzeAnswer } from '../services/analyzeAnswer.service';
import { createQuestion, Question } from '../models/question';
import { Feedback } from '../models/feedback';
import { generateId } from '../../../shared/utils/generateId';
import { useMembership } from '../../membership/hooks/useMembership';

type UsePracticeFlowReturn = {
  isRecording: boolean;
  levels: number[];
  isLoading: boolean;
  error: string | null;
  currentQuestion: Question | null;
  startPractice: (questionText: string, category?: string) => void;
  beginRecording: () => Promise<void>;
  finishRecording: () => Promise<void>;
};

function getQuestionFromSession(session: {
  status: string;
  question?: Question;
}): Question | null {
  if (session.status !== 'idle' && session.question) {
    return session.question;
  }
  return null;
}

export function usePracticeFlow(): UsePracticeFlowReturn {
  const router = useRouter();
  const { isRecording, levels, startRecording, stopRecording } =
    useAudioRecording();
  const {
    session,
    startSession,
    startRecording: markRecordingStarted,
    stopRecording: markRecordingStopped,
    setTranscript,
    setFeedback,
    setError,
  } = usePracticeSessionContext();
  const {
    canPerformAction,
    showUpgradePrompt,
    handleApiError,
    refreshMembershipIfNeeded,
  } = useMembership();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const hasBegunRecordingRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  const currentQuestion = getQuestionFromSession(
    session as { status: string; question?: Question }
  );

  const startPractice = useCallback(
    async (questionText: string, category?: string) => {
      try {
        // Refresh membership data if needed before checking limits
        await refreshMembershipIfNeeded();

        // Check if user can perform the transcribe action before starting
        const canProceed = await canPerformAction('transcribe');
        if (!canProceed) {
          await showUpgradePrompt();
          return;
        }

        const question = createQuestion(questionText, category);
        startSession(question);
        router.push('/practice');
      } catch (error) {
        console.error('Failed to start practice:', error);
        setLocalError('Failed to start practice session');
      }
    },
    [
      startSession,
      router,
      canPerformAction,
      showUpgradePrompt,
      refreshMembershipIfNeeded,
    ]
  );

  const beginRecording = useCallback(async () => {
    // Prevent multiple recording starts
    if (hasBegunRecordingRef.current || isRecording) {
      return;
    }

    hasBegunRecordingRef.current = true;
    setLocalError(null);

    try {
      await startRecording();
      markRecordingStarted();
      recordingStartTimeRef.current = Date.now();
    } catch (err) {
      hasBegunRecordingRef.current = false;
      const message =
        err instanceof Error ? err.message : 'Failed to start recording';
      setLocalError(message);
      setError(message);
    }
  }, [startRecording, markRecordingStarted, setError, isRecording]);

  const processRecording = useCallback(
    async (audioUri: string, durationSeconds: number) => {
      try {
        const question = getQuestionFromSession(
          session as { status: string; question?: Question }
        );

        if (!question) {
          throw new Error('No question found');
        }

        // Transcribe the audio
        const { transcript, sessionId } = await transcribeAudio(audioUri);
        setTranscript(transcript);
        sessionIdRef.current = sessionId;

        // Analyze the answer
        const analysisResult = await analyzeAnswer({
          question: question.text,
          transcript,
          durationSeconds,
          sessionId,
        });

        const feedback: Feedback = {
          id: generateId(),
          ...analysisResult,
          createdAt: Date.now(),
        };

        setFeedback(feedback);

        router.replace('/practice/feedback');
      } catch (err) {
        // Check if this is a usage limit error and handle it
        const isHandled = await handleApiError(err);
        if (isHandled) {
          // Paywall was shown, stop processing
          setIsLoading(false);
          return;
        }

        const message =
          err instanceof Error ? err.message : 'An error occurred';
        setLocalError(message);
        setError(message);
        router.replace('/practice/feedback');
      } finally {
        setIsLoading(false);
      }
    },
    [setTranscript, setFeedback, setError, session, router, handleApiError]
  );

  const finishRecording = useCallback(async () => {
    setLocalError(null);
    setIsLoading(true);
    hasBegunRecordingRef.current = false;

    try {
      // Stop recording BEFORE navigating to preserve the audio URI
      const audioUri = await stopRecording();
      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - recordingStartTimeRef.current) / 1000)
      );

      markRecordingStopped({ uri: audioUri, durationSeconds });

      // Navigate to analyzing page
      router.push('/practice/analyzing');

      // Small delay for UX before processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Process the recording
      await processRecording(audioUri, durationSeconds);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setLocalError(message);
      setError(message);
      setIsLoading(false);
      router.replace('/practice/feedback');
    }
  }, [stopRecording, markRecordingStopped, processRecording, router, setError]);

  return {
    isRecording,
    levels,
    isLoading,
    error,
    currentQuestion,
    startPractice,
    beginRecording,
    finishRecording,
  };
}
