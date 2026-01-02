export type ClarityLabel = 'low' | 'medium' | 'high';
export type LengthEvaluation = 'too_short' | 'ok' | 'too_long';

export type ClarityFeedback = {
  rating: number;
  label: ClarityLabel;
  comment: string;
};

export type LengthFeedback = {
  rating: number;
  durationSeconds: number;
  durationTargetSeconds: number;
  comment: string;
};

export type WeakWord = {
  word: string;
  count: number;
};

export type WeakWordFeedback = {
  rating: number;
  words: WeakWord[];
  comment: string;
};

export type ConcisenessFeedback = {
  rating: number;
  comment: string;
};

export type ConfidenceIndicatorFeedback = {
  rating: number;
  comment: string;
};

export type Feedback = {
  id: string;
  clarity: ClarityFeedback;
  length: LengthFeedback;
  weak_words: WeakWordFeedback;
  key_suggestion: string;
  conciseness: ConcisenessFeedback;
  confidence_indicator: ConfidenceIndicatorFeedback;
  createdAt: number;
};
