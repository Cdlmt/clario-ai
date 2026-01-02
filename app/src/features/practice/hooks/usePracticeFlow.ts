import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAudioRecording } from './useAudioRecording';
import { usePracticeSessionContext } from '../context/PracticeSessionContext';
import { transcribeAudio } from '../services/transcribeAudio.service';
import { analyzeAnswer } from '../services/analyzeAnswer.service';
import { createQuestion, Question } from '../models/question';
import { Feedback } from '../models/feedback';
import { generateId } from '../../../shared/utils/generateId';

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  const recordingStartTimeRef = useRef<number>(0);
  const hasBegunRecordingRef = useRef(false);

  const currentQuestion = getQuestionFromSession(
    session as { status: string; question?: Question }
  );

  const startPractice = useCallback(
    (questionText: string, category?: string) => {
      const question = createQuestion(questionText, category);
      startSession(question);
      router.push('/practice');
    },
    [startSession, router]
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

  const analyzeRecording = useCallback(async () => {
    try {
      const audioUri = await stopRecording();

      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - recordingStartTimeRef.current) / 1000)
      );

      markRecordingStopped({ uri: audioUri, durationSeconds });

      const question = getQuestionFromSession(
        session as { status: string; question?: Question }
      );

      if (!question) {
        throw new Error('No question found');
      }

      // Transcribe the audio
      const { transcript } = await transcribeAudio(audioUri);
      setTranscript(transcript);

      // Analyze the answer
      const analysisResult = await analyzeAnswer({
        question: question.text,
        transcript,
        durationSeconds,
      });

      const feedback: Feedback = {
        id: generateId(),
        ...analysisResult,
        createdAt: Date.now(),
      };

      setFeedback(feedback);

      router.replace('/practice/feedback');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setLocalError(message);
      setError(message);
      router.replace('/practice/feedback');
    } finally {
      setIsLoading(false);
    }
  }, [
    stopRecording,
    markRecordingStopped,
    setTranscript,
    setFeedback,
    setError,
    session,
    router,
  ]);

  const navigateToAnalyzing = useCallback(async () => {
    router.push('/practice/analyzing');
  }, [router]);

  const finishRecording = useCallback(async () => {
    setLocalError(null);
    setIsLoading(true);
    hasBegunRecordingRef.current = false;
    await navigateToAnalyzing();

    // Letting user see analyzing page for UX reasons
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await analyzeRecording();
  }, [navigateToAnalyzing, analyzeRecording]);

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
