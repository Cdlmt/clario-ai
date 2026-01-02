import { z } from 'zod';

export const analyzeRequestSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  transcript: z.string().min(1, 'Transcript is required'),
  durationSeconds: z.number().positive('Duration must be positive'),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

const clarityLabelSchema = z.enum(['low', 'medium', 'high']);

export const analyzeResponseSchema = z.object({
  clarity: z.object({
    rating: z.number().min(0).max(100),
    label: clarityLabelSchema,
    comment: z.string(),
  }),
  length: z.object({
    rating: z.number().min(0).max(100),
    durationSeconds: z.number(),
    durationTargetSeconds: z.number(),
    comment: z.string(),
  }),
  weak_words: z.object({
    rating: z.number().min(0).max(100),
    words: z.array(
      z.object({
        word: z.string(),
        count: z.number(),
      })
    ),
    comment: z.string(),
  }),
  key_suggestion: z.string(),
  conciseness: z.object({
    rating: z.number().min(0).max(100),
    comment: z.string(),
  }),
  confidence_indicator: z.object({
    rating: z.number().min(0).max(100),
    comment: z.string(),
  }),
});

export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
