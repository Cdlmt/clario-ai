import { generateId } from '../../../shared/utils/generateId';
import { Feedback } from './feedback';
import { Question } from './question';

export type SessionStatus =
  | 'idle'
  | 'question'
  | 'recording'
  | 'processing'
  | 'feedback'
  | 'error';

export type AudioData = {
  uri: string;
  durationSeconds: number;
};

type BaseSession = {
  id: string;
  startedAt: number;
};

type IdleSession = BaseSession & {
  status: 'idle';
};

type QuestionSession = BaseSession & {
  status: 'question';
  question: Question;
};

type RecordingSession = BaseSession & {
  status: 'recording';
  question: Question;
  recordingStartedAt: number;
};

type ProcessingSession = BaseSession & {
  status: 'processing';
  question: Question;
  audio: AudioData;
  transcript?: string;
};

type FeedbackSession = BaseSession & {
  status: 'feedback';
  question: Question;
  audio: AudioData;
  transcript: string;
  feedback: Feedback;
};

type ErrorSession = BaseSession & {
  status: 'error';
  question?: Question;
  audio?: AudioData;
  transcript?: string;
  errorMessage: string;
};

export type PracticeSession =
  | IdleSession
  | QuestionSession
  | RecordingSession
  | ProcessingSession
  | FeedbackSession
  | ErrorSession;

export function createIdleSession(): IdleSession {
  return {
    id: generateId(),
    status: 'idle',
    startedAt: Date.now(),
  };
}
