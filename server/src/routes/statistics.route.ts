import { Router, Request, Response } from 'express';
import { StatisticsService } from '../services/statistics.service';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

// GET /statistics/daily-goals - Get daily goals for the current week
router.get(
  '/daily-goals',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const dailyGoals = await StatisticsService.getDailyGoals(userId);

      res.json({ daily_goals: dailyGoals });
    } catch (error) {
      console.error('Error fetching daily goals:', error);
      res.status(500).json({
        error: 'FETCH_DAILY_GOALS_FAILED',
        message: 'Failed to fetch daily goals',
      });
    }
  }
);

// GET /statistics/streak - Get user streak statistics
router.get('/streak', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const streakStats = await StatisticsService.getStreakStats(userId);

    res.json({ streak_stats: streakStats });
  } catch (error) {
    console.error('Error fetching streak stats:', error);
    res.status(500).json({
      error: 'FETCH_STREAK_STATS_FAILED',
      message: 'Failed to fetch streak stats',
    });
  }
});

export default router;
