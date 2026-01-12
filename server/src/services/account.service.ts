import { supabase } from '../lib/supabase';

export class AccountService {
  /**
   * Delete user account and all associated data
   */
  static async deleteUserAccount(userId: string): Promise<void> {
    try {
      // Delete in order to respect foreign key constraints
      // 1. Delete feedback components first (they reference feedback)
      await supabase.from('feedback_clarity').delete().eq('user_id', userId);
      await supabase.from('feedback_weak_words').delete().eq('user_id', userId);
      await supabase.from('feedback_length').delete().eq('user_id', userId);
      await supabase
        .from('feedback_conciseness')
        .delete()
        .eq('user_id', userId);
      await supabase.from('feedback_confidence').delete().eq('user_id', userId);

      // 2. Delete main feedback records
      await supabase.from('feedback').delete().eq('user_id', userId);

      // 3. Delete sessions
      await supabase.from('sessions').delete().eq('user_id', userId);

      // 4. Delete daily usage
      await supabase.from('daily_usage').delete().eq('user_id', userId);

      // 5. Delete user statistics
      await supabase.from('user_statistics').delete().eq('user_id', userId);

      // 6. Delete membership (this should be last as other tables reference user_id)
      await supabase.from('user_memberships').delete().eq('user_id', userId);

      // Note: We don't delete from the auth.users table as that's handled by Supabase Auth
      // when the user deletes their account through the auth system
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw new Error(
        `Failed to delete user account: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
