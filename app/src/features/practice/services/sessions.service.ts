import { API_BASE_URL } from '../../../shared/constants/api';
import { ApiService } from '../../../shared/lib/api';

export interface InterviewSession {
  id: string;
  created_at: string;
  user_id: string;
  question: string;
  transcript: string;
  duration_seconds: number;
  analyzed_at?: string;
  feedback_id?: string;
}

export interface SessionWithFeedback extends InterviewSession {
  feedback: {
    id: string;
    session_id: string;
    created_at: string;
    overall_score: number;
    key_suggestion: string;
    clarity: {
      id: string;
      feedback_id: string;
      rating: number;
      comment: string;
    };
    length: {
      id: string;
      feedback_id: string;
      rating: number;
      duration_seconds: number;
      duration_target_seconds: number;
      comment: string;
    };
    weak_words: {
      id: string;
      feedback_id: string;
      rating: number;
      comment: string;
      words: Array<{
        id: string;
        feedback_weak_words_id: string;
        word: string;
        count: number;
      }>;
    };
    conciseness: {
      id: string;
      feedback_id: string;
      rating: number;
      comment: string;
    };
    confidence: {
      id: string;
      feedback_id: string;
      rating: number;
      comment: string;
    };
  };
}

export type SessionsError = {
  error: string;
  message: string;
};

export class SessionsService {
  static async getAllSessions(
    analyzed?: boolean
  ): Promise<InterviewSession[] | SessionWithFeedback[]> {
    const url = new URL(`${API_BASE_URL}/sessions`);
    if (analyzed) {
      url.searchParams.set('analyzed', 'true');
    }

    const response = await ApiService.authenticatedFetch(url.toString());

    if (!response.ok) {
      const errorData: SessionsError = await response.json();
      throw new Error(errorData.message || 'Failed to fetch sessions');
    }

    const data = await response.json();
    return data.sessions;
  }

  static async getSessionById(sessionId: string): Promise<InterviewSession> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/sessions/${sessionId}`
    );

    if (!response.ok) {
      const errorData: SessionsError = await response.json();
      throw new Error(errorData.message || 'Failed to fetch session');
    }

    const data = await response.json();
    return data.session;
  }

  static async deleteSession(sessionId: string): Promise<void> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/sessions/${sessionId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorData: SessionsError = await response.json();
      throw new Error(errorData.message || 'Failed to delete session');
    }
  }
}
