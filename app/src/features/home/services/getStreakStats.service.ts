import { API_BASE_URL } from '../../../shared/constants/api';
import { ApiService } from '../../../shared/lib/api';

export interface StreakStats {
  currentStreak: number;
  totalAnswers: number;
  averageLength: string;
}

export interface StreakStatsResponse {
  streak_stats: StreakStats;
}

export interface StreakStatsError {
  error: string;
  message: string;
}

export class GetStreakStatsService {
  static async getStreakStats(): Promise<StreakStats> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/statistics/streak`
    );

    if (!response.ok) {
      const errorData: StreakStatsError = await response.json();
      throw new Error(errorData.message || 'Failed to fetch streak stats');
    }

    const data: StreakStatsResponse = await response.json();
    return data.streak_stats;
  }
}
