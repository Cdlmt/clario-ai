import { z } from 'zod';

export const transcribeResponseSchema = z.object({
  transcript: z.string(),
  sessionId: z.string(),
  storagePath: z.string().optional(), // Only included in non-production for debugging
});

export type TranscribeResponse = z.infer<typeof transcribeResponseSchema>;
