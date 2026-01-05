import { z } from 'zod';

export const transcribeResponseSchema = z.object({
  transcript: z.string(),
  sessionId: z.string(),
});

export type TranscribeResponse = z.infer<typeof transcribeResponseSchema>;
