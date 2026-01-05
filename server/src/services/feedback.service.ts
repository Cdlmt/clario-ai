import { supabase } from '../lib/supabase';
import { AnalyzeResponse } from '../schemas/analyze.schema';
import { SessionWithFeedback } from '../models/session';

export class FeedbackService {
  /**
   * Creates complete feedback with all sub-components
   */
  static async createFeedback(
    sessionId: string,
    analysisResults: AnalyzeResponse
  ): Promise<string> {
    // Calculate overall score
    const clarityScore = analysisResults.clarity?.rating || 0;
    const lengthScore = analysisResults.length?.rating || 0;
    const weakWordsScore = analysisResults.weak_words?.rating || 0;
    const concisenessScore = analysisResults.conciseness?.rating || 0;
    const confidenceScore = analysisResults.confidence_indicator?.rating || 0;

    const overallScore = Math.round(
      (clarityScore +
        lengthScore +
        weakWordsScore +
        concisenessScore +
        confidenceScore) /
        5
    );

    // Create main feedback record
    const { data: feedback, error: feedbackError } = await supabase
      .from('feedback')
      .insert({
        session_id: sessionId,
        overall_score: overallScore,
        key_suggestion: analysisResults.key_suggestion,
      })
      .select()
      .single();

    if (feedbackError) {
      console.error('Error creating feedback:', feedbackError);
      throw new Error('Failed to create feedback');
    }

    const feedbackId = feedback.id;

    // Create feedback components in parallel
    const feedbackPromises = [
      // Clarity feedback
      supabase.from('feedback_clarity').insert({
        feedback_id: feedbackId,
        rating: clarityScore,
        comment: analysisResults.clarity?.comment || '',
      }),

      // Length feedback
      supabase.from('feedback_length').insert({
        feedback_id: feedbackId,
        rating: lengthScore,
        duration_seconds: analysisResults.length?.durationSeconds || 0,
        duration_target_seconds:
          analysisResults.length?.durationTargetSeconds || 0,
        comment: analysisResults.length?.comment || '',
      }),

      // Weak words feedback
      supabase.from('feedback_weak_words').insert({
        feedback_id: feedbackId,
        rating: weakWordsScore,
        comment: analysisResults.weak_words?.comment || '',
      }),

      // Conciseness feedback
      supabase.from('feedback_conciseness').insert({
        feedback_id: feedbackId,
        rating: concisenessScore,
        comment: analysisResults.conciseness?.comment || '',
      }),

      // Confidence feedback
      supabase.from('feedback_confidence').insert({
        feedback_id: feedbackId,
        rating: confidenceScore,
        comment: analysisResults.confidence_indicator?.comment || '',
      }),
    ];

    const results = await Promise.all(feedbackPromises);

    // Check for errors
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      console.error('Errors creating feedback components:', errors);
      throw new Error('Failed to create feedback components');
    }

    // Insert weak words if any
    if (analysisResults.weak_words?.words?.length > 0) {
      const weakWordsResult = results[2] as {
        data: { id: string }[] | null;
        error: any;
      };
      if (
        weakWordsResult.data &&
        Array.isArray(weakWordsResult.data) &&
        weakWordsResult.data.length > 0
      ) {
        const weakWordsId = weakWordsResult.data[0].id;

        const weakWordsInsert = analysisResults.weak_words.words.map(
          (word: any) => ({
            feedback_weak_words_id: weakWordsId,
            word: word.word,
            count: word.count,
          })
        );

        const { error: wordsError } = await supabase
          .from('weak_words')
          .insert(weakWordsInsert);

        if (wordsError) {
          console.error('Error inserting weak words:', wordsError);
          // Don't fail the whole operation for this
        }
      }
    }

    // Update session with feedback_id and analyzed_at
    await supabase
      .from('interview_sessions')
      .update({
        feedback_id: feedbackId,
        analyzed_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    return feedbackId;
  }

  /**
   * Gets complete feedback for a session
   */
  static async getSessionFeedback(
    sessionId: string
  ): Promise<SessionWithFeedback | null> {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select(
        `
        *,
        feedback:feedback_id (
          id,
          overall_score,
          key_suggestion,
          clarity:feedback_clarity(*),
          length:feedback_length(*),
          weak_words:feedback_weak_words(
            *,
            words:weak_words(*)
          ),
          conciseness:feedback_conciseness(*),
          confidence:feedback_confidence(*)
        )
      `
      )
      .eq('id', sessionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching session feedback:', error);
      throw new Error('Failed to fetch session feedback');
    }

    return data as SessionWithFeedback;
  }

  /**
   * Gets all sessions with their feedback
   */
  static async getAllSessionsWithFeedback(): Promise<SessionWithFeedback[]> {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select(
        `
        *,
        feedback:feedback_id (
          id,
          overall_score,
          key_suggestion,
          clarity:feedback_clarity(*),
          length:feedback_length(*),
          weak_words:feedback_weak_words(
            *,
            words:weak_words(*)
          ),
          conciseness:feedback_conciseness(*),
          confidence:feedback_confidence(*)
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions with feedback:', error);
      throw new Error('Failed to fetch sessions with feedback');
    }

    return (data || []) as SessionWithFeedback[];
  }

  /**
   * Gets only analyzed sessions with feedback
   */
  static async getAnalyzedSessionsWithFeedback(
    userId: string
  ): Promise<SessionWithFeedback[]> {
    const { data, error } = await supabase
      .from('interview_sessions')
      .select(
        `
        *,
        feedback:feedback_id (
          id,
          overall_score,
          key_suggestion,
          clarity:feedback_clarity(*),
          length:feedback_length(*),
          weak_words:feedback_weak_words(
            *,
            words:weak_words(*)
          ),
          conciseness:feedback_conciseness(*),
          confidence:feedback_confidence(*)
        )
      `
      )
      .eq('user_id', userId)
      .not('feedback_id', 'is', null)
      .order('analyzed_at', { ascending: false });

    if (error) {
      console.error('Error fetching analyzed sessions:', error);
      throw new Error('Failed to fetch analyzed sessions');
    }

    return (data || []) as SessionWithFeedback[];
  }

  /**
   * Deletes feedback and all related data
   */
  static async deleteFeedback(feedbackId: string): Promise<void> {
    // Delete in reverse order (children first due to foreign keys)

    // First, get all feedback_weak_words IDs for this feedback
    const { data: weakWordsFeedbackIds } = await supabase
      .from('feedback_weak_words')
      .select('id')
      .eq('feedback_id', feedbackId);

    // Delete weak words if any exist
    if (weakWordsFeedbackIds && weakWordsFeedbackIds.length > 0) {
      const ids = weakWordsFeedbackIds.map((f) => f.id);
      await supabase
        .from('weak_words')
        .delete()
        .in('feedback_weak_words_id', ids);
    }

    // Delete all feedback components
    const deletePromises = [
      supabase.from('feedback_clarity').delete().eq('feedback_id', feedbackId),
      supabase.from('feedback_length').delete().eq('feedback_id', feedbackId),
      supabase
        .from('feedback_weak_words')
        .delete()
        .eq('feedback_id', feedbackId),
      supabase
        .from('feedback_conciseness')
        .delete()
        .eq('feedback_id', feedbackId),
      supabase
        .from('feedback_confidence')
        .delete()
        .eq('feedback_id', feedbackId),
    ];

    await Promise.all(deletePromises);

    // Delete main feedback record
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', feedbackId);

    if (error) {
      console.error('Error deleting feedback:', error);
      throw new Error('Failed to delete feedback');
    }
  }
}
