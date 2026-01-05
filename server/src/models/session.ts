export interface InterviewSession {
  id: string;
  created_at: string;
  user_id: string;
  question: string;
  transcript: string;
  duration_seconds: number;
  analyzed_at?: string;
  feedback_id?: string;
}

export interface Feedback {
  id: string;
  session_id: string;
  created_at: string;
  overall_score: number;
  key_suggestion: string;
}

export interface FeedbackClarity {
  id: string;
  feedback_id: string;
  rating: number;
  comment: string;
}

export interface FeedbackLength {
  id: string;
  feedback_id: string;
  rating: number;
  duration_seconds: number;
  duration_target_seconds: number;
  comment: string;
}

export interface FeedbackWeakWords {
  id: string;
  feedback_id: string;
  rating: number;
  comment: string;
}

export interface WeakWord {
  id: string;
  feedback_weak_words_id: string;
  word: string;
  count: number;
}

export interface FeedbackConciseness {
  id: string;
  feedback_id: string;
  rating: number;
  comment: string;
}

export interface FeedbackConfidence {
  id: string;
  feedback_id: string;
  rating: number;
  comment: string;
}

export interface SessionWithFeedback extends InterviewSession {
  feedback: Feedback & {
    clarity: FeedbackClarity;
    length: FeedbackLength;
    weak_words: FeedbackWeakWords & { words: WeakWord[] };
    conciseness: FeedbackConciseness;
    confidence: FeedbackConfidence;
  };
}
