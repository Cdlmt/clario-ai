import {
  JobIndustry,
  QuestionCategory,
} from '../services/fetchQuestion.service';

export type Question = {
  id: number;
  text: string;
  category?: QuestionCategory | string;
  industry?: JobIndustry | string;
  createdAt: number;
};

export function createQuestion(
  text: string,
  category?: QuestionCategory | string,
  industry?: JobIndustry | string
): Question {
  return {
    id: Date.now(), // Use timestamp as temporary ID for client-side questions
    text,
    category,
    industry,
    createdAt: Date.now(),
  };
}
