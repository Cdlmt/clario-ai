import { useCallback, useMemo, useReducer, useEffect } from 'react';
import { Feedback } from '../models/feedback';
import {
  AudioData,
  createIdleSession,
  PracticeSession,
} from '../models/practiceSession';
import { Question } from '../models/question';
import { useMembershipContext } from '../../membership/context/MembershipContext';

type Action =
  | { type: 'START_SESSION'; question: Question }
  | { type: 'START_RECORDING' }
  | { type: 'STOP_RECORDING'; audio: AudioData }
  | { type: 'SET_TRANSCRIPT'; transcript: string }
  | { type: 'SET_FEEDBACK'; feedback: Feedback }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'RESET' };

function reducer(state: PracticeSession, action: Action): PracticeSession {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        status: 'question',
        question: action.question,
      };

    case 'START_RECORDING':
      if (state.status !== 'question') {
        console.warn(
          `Invalid transition: cannot start recording from "${state.status}"`
        );
        return state;
      }
      return {
        ...state,
        status: 'recording',
        question: state.question,
        recordingStartedAt: Date.now(),
      };

    case 'STOP_RECORDING':
      if (state.status !== 'recording') {
        console.warn(
          `Invalid transition: cannot stop recording from "${state.status}"`
        );
        return state;
      }
      return {
        ...state,
        status: 'processing',
        question: state.question,
        audio: action.audio,
      };

    case 'SET_TRANSCRIPT':
      if (state.status !== 'processing') {
        console.warn(
          `Invalid transition: cannot set transcript from "${state.status}"`
        );
        return state;
      }
      return {
        ...state,
        status: 'processing',
        transcript: action.transcript,
      };

    case 'SET_FEEDBACK':
      if (state.status !== 'processing') {
        console.warn(
          `Invalid transition: cannot set feedback from "${state.status}"`
        );
        return state;
      }
      if (!state.transcript) {
        console.warn('Cannot set feedback without transcript');
        return state;
      }
      return {
        ...state,
        status: 'feedback',
        feedback: action.feedback,
        transcript: state.transcript,
      };

    case 'SET_ERROR':
      return {
        id: state.id,
        startedAt: state.startedAt,
        status: 'error',
        question: 'question' in state ? state.question : undefined,
        audio: 'audio' in state ? state.audio : undefined,
        transcript: 'transcript' in state ? state.transcript : undefined,
        errorMessage: action.message,
      };

    case 'RESET':
      return createIdleSession();

    default:
      return state;
  }
}

export type UsePracticeSessionReturn = {
  session: PracticeSession;
  startSession: (question: Question) => void;
  startRecording: () => void;
  stopRecording: (audio: AudioData) => void;
  setTranscript: (transcript: string) => void;
  setFeedback: (feedback: Feedback) => void;
  setError: (message: string) => void;
  reset: () => void;
  canStartRecording: boolean;
  canStopRecording: boolean;
  isProcessing: boolean;
  hasFeedback: boolean;
};

export function usePracticeSession(): UsePracticeSessionReturn {
  const [session, dispatch] = useReducer(reducer, undefined, createIdleSession);
  const { refreshAfterSession } = useMembershipContext();

  const startSession = useCallback((question: Question) => {
    dispatch({ type: 'START_SESSION', question });
  }, []);

  const startRecording = useCallback(() => {
    dispatch({ type: 'START_RECORDING' });
  }, []);

  const stopRecording = useCallback((audio: AudioData) => {
    dispatch({ type: 'STOP_RECORDING', audio });
  }, []);

  const setTranscript = useCallback((transcript: string) => {
    dispatch({ type: 'SET_TRANSCRIPT', transcript });
  }, []);

  const setFeedback = useCallback((feedback: Feedback) => {
    dispatch({ type: 'SET_FEEDBACK', feedback });
  }, []);

  const setError = useCallback((message: string) => {
    dispatch({ type: 'SET_ERROR', message });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const derived = useMemo(
    () => ({
      canStartRecording: session.status === 'question',
      canStopRecording: session.status === 'recording',
      isProcessing: session.status === 'processing',
      hasFeedback: session.status === 'feedback',
    }),
    [session.status]
  );

  // Refresh membership data when session completes (reaches feedback state)
  useEffect(() => {
    if (session.status === 'feedback') {
      refreshAfterSession();
    }
  }, [session.status, refreshAfterSession]);

  return {
    session,
    startSession,
    startRecording,
    stopRecording,
    setTranscript,
    setFeedback,
    setError,
    reset,
    ...derived,
  };
}
