import { Router, Request, Response } from 'express';
import {
  analyzeRequestSchema,
  AnalyzeResponse,
} from '../schemas/analyze.schema';

const router = Router();

// Common weak words in interview answers
const WEAK_WORDS = [
  'actually',
  'basically',
  'honestly',
  'literally',
  'just',
  'really',
  'very',
  'kind of',
  'sort of',
  'you know',
  'like',
  'um',
  'uh',
  'so',
  'well',
];

function detectWeakWords(
  transcript: string
): { word: string; count: number }[] {
  const lowerTranscript = transcript.toLowerCase();
  const detected: { word: string; count: number }[] = [];

  for (const word of WEAK_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerTranscript.match(regex);
    if (matches && matches.length > 0) {
      detected.push({ word, count: matches.length });
    }
  }

  return detected.sort((a, b) => b.count - a.count).slice(0, 5);
}

function calculateClarityLabel(rating: number): 'low' | 'medium' | 'high' {
  if (rating < 40) return 'low';
  if (rating < 70) return 'medium';
  return 'high';
}

function analyzeLength(
  durationSeconds: number,
  targetSeconds: number = 90
): { rating: number; comment: string } {
  const ratio = durationSeconds / targetSeconds;

  if (ratio < 0.5) {
    return {
      rating: 30,
      comment:
        'Your answer is too short. Try to provide more details and examples.',
    };
  }
  if (ratio < 0.8) {
    return {
      rating: 60,
      comment:
        'Your answer could be longer. Consider adding more context or examples.',
    };
  }
  if (ratio <= 1.3) {
    return {
      rating: 90,
      comment: 'Great length! Your answer is well-paced and comprehensive.',
    };
  }
  if (ratio <= 1.7) {
    return {
      rating: 60,
      comment:
        'Your answer is a bit long. Try to be more concise while keeping key points.',
    };
  }
  return {
    rating: 30,
    comment:
      'Your answer is too long. Focus on the most important points and be more direct.',
  };
}

// POST /analyze - Analyzes transcript and returns feedback
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = analyzeRequestSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: validation.error.errors[0]?.message || 'Invalid request',
      });
      return;
    }

    const { transcript, durationSeconds } = validation.data;

    // TODO: Integrate with actual LLM for deeper analysis
    // For now, use rule-based analysis for development

    const weakWords = detectWeakWords(transcript);
    const weakWordsRating = Math.max(0, 100 - weakWords.length * 20);

    const lengthAnalysis = analyzeLength(durationSeconds);
    const targetSeconds = 90;

    // Mock clarity based on sentence structure
    const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim());
    const avgSentenceLength =
      transcript.split(/\s+/).length / Math.max(sentences.length, 1);
    const clarityRating =
      avgSentenceLength > 30 ? 50 : avgSentenceLength > 20 ? 70 : 85;

    // Conciseness based on word count and weak words
    const wordCount = transcript.split(/\s+/).length;
    const concisenessRating = Math.max(
      20,
      100 - weakWords.length * 10 - Math.max(0, (wordCount - 150) / 3)
    );

    // Mock confidence based on presence of filler words
    const fillerCount = weakWords.reduce((sum, w) => sum + w.count, 0);
    const confidenceRating = Math.max(20, 100 - fillerCount * 8);

    const response: AnalyzeResponse = {
      clarity: {
        rating: Math.round(clarityRating),
        label: calculateClarityLabel(clarityRating),
        comment:
          clarityRating >= 70
            ? 'Your answer is clear and well-structured.'
            : 'Try to structure your answer more clearly with a beginning, middle, and end.',
      },
      length: {
        rating: lengthAnalysis.rating,
        durationSeconds,
        durationTargetSeconds: targetSeconds,
        comment: lengthAnalysis.comment,
      },
      weak_words: {
        rating: weakWordsRating,
        words: weakWords,
        comment:
          weakWords.length > 2
            ? `You use too many filler words. Reduce them to sound more confident. For example, instead of saying "um" or "like", try to be more direct and concise.`
            : 'You use a few filler words. Try to reduce them to sound more confident.',
      },
      key_suggestion:
        'Consider using the STAR method (Situation, Task, Action, Result) to structure your answers.',
      conciseness: {
        rating: Math.round(concisenessRating),
        comment:
          concisenessRating >= 70
            ? 'Your answer is well-focused and to the point.'
            : 'Try to be more direct. Remove unnecessary details and filler words.',
      },
      confidence_indicator: {
        rating: Math.round(confidenceRating),
        comment:
          confidenceRating >= 70
            ? 'You sound confident and assured in your delivery.'
            : 'Work on reducing hesitation words to project more confidence.',
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'ANALYSIS_FAILED',
      message: 'Failed to analyze answer',
    });
  }
});

export default router;
