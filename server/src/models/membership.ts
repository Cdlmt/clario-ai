export type PlanType = 'free' | 'premium';
export type MembershipStatus = 'active' | 'inactive';

export interface UserMembership {
  user_id: string;
  plan_type: PlanType;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
  stripe_customer_id?: string;
}

export interface DailyUsage {
  user_id: string;
  date: string; // YYYY-MM-DD format
  questions_used: number;
}

export interface UsageCheck {
  can_use: boolean;
  questions_used: number;
  questions_remaining: number;
  plan_type: PlanType;
  limit_exceeded?: boolean;
}
