import { z } from 'zod';

export const completeOnboardingRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  jobKey: z.string().min(1, 'Job key is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export type CompleteOnboardingRequest = z.infer<
  typeof completeOnboardingRequestSchema
>;

export const completeOnboardingResponseSchema = z.object({
  success: z.boolean(),
  userId: z.string(),
  message: z.string(),
});

export type CompleteOnboardingResponse = z.infer<
  typeof completeOnboardingResponseSchema
>;
