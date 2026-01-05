import { useEffect, useState } from 'react';
import {
  GetDailyGoalsService,
  DailyGoal as ServiceDailyGoal,
} from '../services/getDailyGoals.service';
import { DailyGoalState } from '../components/daily.goal.item';

interface DailyGoal {
  day: string;
  state: DailyGoalState;
}

// Map API state strings to enum values
const mapStateToEnum = (state: string): DailyGoalState => {
  switch (state) {
    case 'completed':
      return DailyGoalState.COMPLETED;
    case 'in_progress':
      return DailyGoalState.IN_PROGRESS;
    case 'failed':
      return DailyGoalState.FAILED;
    case 'not_started':
    default:
      return DailyGoalState.NOT_STARTED;
  }
};

export function useDailyGoals() {
  const [goals, setGoals] = useState<DailyGoal[]>([
    { day: 'Mon', state: DailyGoalState.NOT_STARTED },
    { day: 'Tue', state: DailyGoalState.NOT_STARTED },
    { day: 'Wed', state: DailyGoalState.NOT_STARTED },
    { day: 'Thu', state: DailyGoalState.NOT_STARTED },
    { day: 'Fri', state: DailyGoalState.NOT_STARTED },
    { day: 'Sat', state: DailyGoalState.NOT_STARTED },
    { day: 'Sun', state: DailyGoalState.NOT_STARTED },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDailyGoals = async () => {
      try {
        setIsLoading(true);
        const dailyGoalsData = await GetDailyGoalsService.getDailyGoals();

        const mappedGoals = dailyGoalsData.map((goal: ServiceDailyGoal) => ({
          day: goal.day,
          state: mapStateToEnum(goal.state),
        }));

        setGoals(mappedGoals);
      } catch (error) {
        console.error('Failed to load daily goals:', error);
        // Keep default state on error
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyGoals();
  }, []);

  return { goals, isLoading };
}
