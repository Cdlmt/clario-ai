import { API_BASE_URL } from '../../../shared/constants/api';
import { ApiService } from '../../../shared/lib/api';

export type QuestionCategory = {
  id: number;
  key: string;
  name: string;
};

export type QuestionResponse = {
  id: number;
  text: string;
  category?: QuestionCategory;
};

export type FetchQuestionError = {
  error: string;
};

export async function fetchRandomQuestion(
  category?: string
): Promise<QuestionResponse> {
  const url = category
    ? `${API_BASE_URL}/questions/${encodeURIComponent(category)}/random`
    : `${API_BASE_URL}/questions/random`;

  const response = await ApiService.authenticatedFetch(url);

  if (!response.ok) {
    const errorData: FetchQuestionError = await response.json();
    throw new Error(errorData.error || 'Failed to fetch question');
  }

  const data: QuestionResponse = await response.json();
  return data;
}

export async function fetchCategories(): Promise<string[]> {
  const response = await ApiService.authenticatedFetch(
    `${API_BASE_URL}/questions`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data: { categories: string[] } = await response.json();
  return data.categories;
}
