import { supabase } from '../lib/supabase';
import { InterviewSession } from '../models/session';

export class StatisticsService {
  /**
   * Gets daily goals for the current week (starting Monday)
   */
  static async getDailyGoals(
    userId: string
  ): Promise<Array<{ day: string; state: string }>> {
    // Get current date info
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();

    // Convert to Monday-based week (0 = Monday, 1 = Tuesday, ..., 6 = Sunday)
    const mondayBasedDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

    // Calculate start of current week (Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - mondayBasedDay);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate end of current week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Query to get session counts per day of the week
    const { data, error } = await supabase
      .from('interview_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .not('analyzed_at', 'is', null) // Only analyzed sessions
      .gte('created_at', startOfWeek.toISOString())
      .lte('created_at', endOfWeek.toISOString());

    if (error) {
      console.error('Error fetching daily goals:', error);
      throw new Error('Failed to fetch daily goals');
    }

    // Count sessions per day of week (convert to Monday-based)
    const sessionsByDay = (data || []).reduce(
      (acc: Record<number, number>, session) => {
        const date = new Date(session.created_at);
        const dayOfWeek = date.getDay();
        // Convert Sunday (0) to 6, Monday (1) to 0, Tuesday (2) to 1, etc.
        const mondayBasedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        acc[mondayBasedIndex] = (acc[mondayBasedIndex] || 0) + 1;
        return acc;
      },
      {}
    );

    // Check if today has started (after 6 AM)
    const isTodayStarted = currentHour >= 6;

    // Calculate state for each day (Monday to Sunday)
    const daysOfWeek = [
      { name: 'Mon', index: 0 },
      { name: 'Tue', index: 1 },
      { name: 'Wed', index: 2 },
      { name: 'Thu', index: 3 },
      { name: 'Fri', index: 4 },
      { name: 'Sat', index: 5 },
      { name: 'Sun', index: 6 },
    ];

    return daysOfWeek.map(({ name, index }) => {
      const completedSessions = sessionsByDay[index] || 0;

      let state: string;

      if (index < mondayBasedDay) {
        // Day is in the past
        state = completedSessions >= 3 ? 'completed' : 'failed';
      } else if (index === mondayBasedDay) {
        // Today
        if (!isTodayStarted) {
          state = 'not_started';
        } else {
          state = completedSessions >= 3 ? 'completed' : 'in_progress';
        }
      } else {
        // Future day
        state = 'not_started';
      }

      return {
        day: name,
        state,
      };
    });
  }
}
