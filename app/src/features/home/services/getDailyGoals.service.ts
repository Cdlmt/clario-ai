import { API_BASE_URL } from '../../../shared/constants/api';
import { ApiService } from '../../../shared/lib/api';

export interface DailyGoal {
  day: string;
  state: string;
}

export interface DailyGoalsResponse {
  daily_goals: DailyGoal[];
}

export interface DailyGoalsError {
  error: string;
  message: string;
}

export class GetDailyGoalsService {
  static async getDailyGoals(): Promise<DailyGoal[]> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/statistics/daily-goals`
    );

    if (!response.ok) {
      const errorData: DailyGoalsError = await response.json();
      throw new Error(errorData.message || 'Failed to fetch daily goals');
    }

    const data: DailyGoalsResponse = await response.json();
    return data.daily_goals;
  }
}
