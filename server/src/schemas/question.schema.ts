import { z } from 'zod';

// Schema for the question response sent to the client
export const questionResponseSchema = z.object({
  id: z.number(),
  text: z.string(),
  category: z
    .object({
      id: z.number(),
      key: z.string(),
      name: z.string(),
    })
    .optional(),
  industry: z
    .object({
      id: z.number(),
      key: z.string(),
      name: z.string(),
    })
    .optional(),
});

export type QuestionResponse = z.infer<typeof questionResponseSchema>;

// Schema for categories response
export const categoriesResponseSchema = z.object({
  categories: z.array(z.string()),
});

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
