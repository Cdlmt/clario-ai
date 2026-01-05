import { supabase } from '../lib/supabase';
import { InterviewSession, SessionWithFeedback } from '../models/session';
import { AnalyzeResponse } from '../schemas/analyze.schema';
import { FeedbackService } from './feedback.service';

export class SessionService {
  private static readonly TABLE_NAME = 'interview_sessions';

  /**
   * Creates a new interview session after transcription
   */
  static async createSession(
    userId: string,
    question: string,
    transcript: string,
    durationSeconds: number
  ): Promise<InterviewSession> {
    const session: Omit<InterviewSession, 'id' | 'created_at'> = {
      user_id: userId,
      question,
      transcript,
      duration_seconds: durationSeconds,
    };

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert(session)
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session');
    }

    return data;
  }

  /**
   * Updates session with question and duration before creating feedback
   */
  static async updateSessionDetails(
    sessionId: string,
    question: string,
    durationSeconds: number
  ): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update({
        question,
        duration_seconds: durationSeconds,
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating session details:', error);
      throw new Error('Failed to update session details');
    }
  }

  /**
   * Creates feedback for a session after analysis
   */
  static async createSessionFeedback(
    sessionId: string,
    analysisResults: AnalyzeResponse
  ): Promise<string> {
    return await FeedbackService.createFeedback(sessionId, analysisResults);
  }

  /**
   * Gets all sessions with optional analysis filter
   */
  static async getAllSessions(
    userId: string,
    includeOnlyAnalyzed = false
  ): Promise<InterviewSession[]> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (includeOnlyAnalyzed) {
      query = query.not('analysis_results', 'is', null);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching sessions:', error);
      throw new Error('Failed to fetch sessions');
    }

    return data || [];
  }

  /**
   * Gets a specific session by ID
   */
  static async getSessionById(
    sessionId: string
  ): Promise<InterviewSession | null> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching session:', error);
      throw new Error('Failed to fetch session');
    }

    return data;
  }

  /**
   * Gets sessions with feedback
   */
  static async getAnalyzedSessions(
    userId: string
  ): Promise<SessionWithFeedback[]> {
    return await FeedbackService.getAnalyzedSessionsWithFeedback(userId);
  }

  /**
   * Deletes a session from database
   */
  static async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete session');
    }
  }
}
