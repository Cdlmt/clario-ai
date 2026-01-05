import { API_BASE_URL } from '../../../shared/constants/api';
import { ApiService } from '../../../shared/lib/api';
import { Feedback } from '../models/feedback';

export type AnalyzeRequest = {
  question: string;
  transcript: string;
  durationSeconds: number;
  sessionId?: string;
};

export type AnalyzeResponse = Omit<Feedback, 'id' | 'createdAt'>;

export type AnalyzeError = {
  error: string;
  message: string;
};

export async function analyzeAnswer(
  request: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const response = await ApiService.authenticatedFetch(
    `${API_BASE_URL}/analyze`,
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const errorData: AnalyzeError = await response.json();
    throw new Error(errorData.message || 'Failed to analyze answer');
  }

  const data: AnalyzeResponse = await response.json();
  return data;
}
