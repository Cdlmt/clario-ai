export type SupportedLanguage = 'en' | 'fr' | 'es';

export interface TranslationResources {
  home: {
    title: string;
    subtitle: string;
    startPractice: string;
    loading: string;
    dailyGoals: string;
    specificPractices: string;
    practiceWithCompany: string;
  };
  onboarding: {
    landing: {
      title: string;
      subtitle: string;
      getStarted: string;
    };
    name: {
      title: string;
      continue: string;
      firstName: string;
      placeholder: string;
    };
    success: {
      title: string;
      subtitle: string;
      letsGo: string;
    };
    error: {
      title: string;
    };
    signup: {
      title: string;
      subtitle: string;
      signingIn: string;
    };
    continueWith: string;
  };
  feedback: {
    clarity: string;
    weakWords: string;
    listOfWords: string;
    length: string;
    time: string;
    target: string;
    keySuggestion: string;
    confidenceIndicator: string;
    conciseness: string;
  };
  practice: {
    stop: string;
    interviewQuestion: string;
    analyzingAnswer: string;
    yourFeedback: string;
    questionCategory: string;
    startAnswering: string;
    nextQuestion: string;
    processingAnswer: string;
    usuallyTakesSeconds: string;
    reviewingClarity: string;
    analyzingStructure: string;
    evaluatingCoherence: string;
    recordingSpeakNow: string;
    startSpeakingWhenReady: string;
    loadingQuestion: string;
    oops: string;
    tapToRetry: string;
    takeFewSecondsToThink: string;
    loadingFeedback: string;
  };
  streak: {
    streakDays: string;
    totalAnswers: string;
    avgLength: string;
  };
}

export type TranslationKey = keyof TranslationResources;
export type NestedTranslationKey<T extends TranslationKey> =
  keyof TranslationResources[T];
