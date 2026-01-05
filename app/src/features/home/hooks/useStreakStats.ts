import { useEffect, useState } from 'react';
import {
  GetStreakStatsService,
  StreakStats,
} from '../services/getStreakStats.service';

export function useStreakStats() {
  const [streakStats, setStreakStats] = useState<StreakStats>({
    currentStreak: 0,
    totalAnswers: 0,
    averageLength: '0s',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStreakStats = async () => {
      try {
        setIsLoading(true);
        const stats = await GetStreakStatsService.getStreakStats();
        setStreakStats(stats);
      } catch (error) {
        console.error('Failed to load streak stats:', error);
        // Keep default values on error
      } finally {
        setIsLoading(false);
      }
    };

    loadStreakStats();
  }, []);

  return { streakStats, isLoading };
}
