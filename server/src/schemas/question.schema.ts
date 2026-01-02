import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string(),
  text: z.string(),
  category: z.string().optional(),
});

export type QuestionResponse = z.infer<typeof questionSchema>;

// Mock questions database (to be replaced with real DB later)
export const mockQuestions: QuestionResponse[] = [
  {
    id: '1',
    text: 'Tell me about a technical challenge you recently faced and how you solved it.',
    category: 'Technical',
  },
  {
    id: '2',
    text: 'Describe a situation where you had to work with a difficult team member.',
    category: 'Behavioral',
  },
  {
    id: '3',
    text: 'What is your greatest professional achievement?',
    category: 'General',
  },
  {
    id: '4',
    text: 'How do you prioritize tasks when you have multiple deadlines?',
    category: 'Behavioral',
  },
  {
    id: '5',
    text: 'Explain a complex technical concept to someone non-technical.',
    category: 'Technical',
  },
  {
    id: '6',
    text: 'Where do you see yourself in 5 years?',
    category: 'General',
  },
  {
    id: '7',
    text: 'Tell me about a time you failed and what you learned from it.',
    category: 'Behavioral',
  },
  {
    id: '8',
    text: 'How do you stay updated with the latest technologies in your field?',
    category: 'Technical',
  },
];
