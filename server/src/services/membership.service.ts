import { supabase } from '../lib/supabase';
import {
  UserMembership,
  DailyUsage,
  UsageCheck,
  PlanType,
  MembershipStatus,
} from '../models/membership';

const FREE_DAILY_LIMIT = 10;

export class MembershipService {
  /**
   * Get or create user membership (defaults to free plan)
   */
  static async getOrCreateUserMembership(
    userId: string
  ): Promise<UserMembership> {
    // Try to get existing membership
    let { data: membership, error } = await supabase
      .from('user_memberships')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found
      throw new Error(`Failed to fetch membership: ${error.message}`);
    }

    // If no membership exists, create a free one
    if (!membership) {
      const newMembership = {
        user_id: userId,
        plan_type: 'free' as PlanType,
        status: 'active' as MembershipStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: created, error: createError } = await supabase
        .from('user_memberships')
        .insert(newMembership)
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create membership: ${createError.message}`);
      }

      membership = created;
    }

    return membership;
  }

  /**
   * Get user membership
   */
  static async getUserMembership(
    userId: string
  ): Promise<UserMembership | null> {
    const { data, error } = await supabase
      .from('user_memberships')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch membership: ${error.message}`);
    }

    return data;
  }

  /**
   * Update user membership
   */
  static async updateUserMembership(
    userId: string,
    updates: Partial<
      Pick<UserMembership, 'plan_type' | 'status' | 'stripe_customer_id'>
    >
  ): Promise<UserMembership> {
    const { data, error } = await supabase
      .from('user_memberships')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update membership: ${error.message}`);
    }

    return data;
  }

  /**
   * Get today's usage for a user
   */
  static async getTodayUsage(userId: string): Promise<number> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const { data, error } = await supabase
      .from('daily_usage')
      .select('questions_used')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch usage: ${error.message}`);
    }

    return data?.questions_used || 0;
  }

  /**
   * Increment today's usage for a user
   */
  static async incrementUsage(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    // Try to increment existing record
    const { data: existing } = await supabase
      .from('daily_usage')
      .select('questions_used')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (existing) {
      // Increment existing record
      const { error } = await supabase
        .from('daily_usage')
        .update({ questions_used: existing.questions_used + 1 })
        .eq('user_id', userId)
        .eq('date', today);

      if (error) {
        throw new Error(`Failed to increment usage: ${error.message}`);
      }
    } else {
      // Create new record
      const { error } = await supabase.from('daily_usage').insert({
        user_id: userId,
        date: today,
        questions_used: 1,
      });

      if (error) {
        throw new Error(`Failed to create usage record: ${error.message}`);
      }
    }
  }

  /**
   * Check if user can perform an action based on their membership
   */
  static async checkUsageLimit(userId: string): Promise<UsageCheck> {
    const membership = await this.getOrCreateUserMembership(userId);
    const todayUsage = await this.getTodayUsage(userId);

    if (membership.plan_type === 'premium' && membership.status === 'active') {
      return {
        can_use: true,
        questions_used: todayUsage,
        questions_remaining: -1, // unlimited
        plan_type: 'premium',
      };
    }

    // Free plan logic
    const questionsRemaining = Math.max(0, FREE_DAILY_LIMIT - todayUsage);
    const canUse = questionsRemaining > 0;

    return {
      can_use: canUse,
      questions_used: todayUsage,
      questions_remaining: questionsRemaining,
      plan_type: 'free',
      limit_exceeded: !canUse,
    };
  }

  /**
   * Get usage statistics for dashboard
   */
  static async getUsageStats(userId: string) {
    const membership = await this.getOrCreateUserMembership(userId);
    const todayUsage = await this.getTodayUsage(userId);

    return {
      plan_type: membership.plan_type,
      status: membership.status,
      today_usage: todayUsage,
      daily_limit: membership.plan_type === 'premium' ? -1 : FREE_DAILY_LIMIT,
      questions_remaining:
        membership.plan_type === 'premium'
          ? -1
          : Math.max(0, FREE_DAILY_LIMIT - todayUsage),
    };
  }
}
