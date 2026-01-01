import { generateId } from '../../../shared/utils/generateId';

export type Question = {
  id: string;
  text: string;
  category?: string;
  createdAt: number;
};

export function createQuestion(text: string, category?: string): Question {
  return {
    id: generateId(),
    text,
    category,
    createdAt: Date.now(),
  };
}
