import { API_BASE_URL } from '../../../shared/constants/api';

export type QuestionResponse = {
  id: string;
  text: string;
  category?: string;
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

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData: FetchQuestionError = await response.json();
    throw new Error(errorData.error || 'Failed to fetch question');
  }

  const data: QuestionResponse = await response.json();
  return data;
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/questions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data: { categories: string[] } = await response.json();
  return data.categories;
}
