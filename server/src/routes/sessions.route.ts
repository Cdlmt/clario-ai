import { Router, Request, Response } from 'express';
import { SessionService } from '../services/session.service';
import { FeedbackService } from '../services/feedback.service';
import { InterviewSession, SessionWithFeedback } from '../models/session';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

// GET /sessions - Get all sessions
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { analyzed } = req.query;
    const userId = req.user!.id;

    let sessions: InterviewSession[] | SessionWithFeedback[];

    if (analyzed === 'true') {
      sessions = await SessionService.getAnalyzedSessions(userId);
    } else {
      sessions = await SessionService.getAllSessions(userId);
    }

    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      error: 'FETCH_SESSIONS_FAILED',
      message: 'Failed to fetch sessions',
    });
  }
});

// GET /sessions/:id - Get a specific session
router.get('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const session = await SessionService.getSessionById(id);

    if (!session) {
      return res.status(404).json({
        error: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    }

    // Check if session belongs to the authenticated user
    if (session.user_id !== userId) {
      return res.status(403).json({
        error: 'ACCESS_DENIED',
        message: 'You do not have permission to access this session',
      });
    }

    res.json({ session });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      error: 'FETCH_SESSION_FAILED',
      message: 'Failed to fetch session',
    });
  }
});

// DELETE /sessions/:id - Delete a session and its feedback
router.delete('/:id', authenticateUser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Get session to check if it has feedback
    const session = await SessionService.getSessionById(id);
    if (!session) {
      return res.status(404).json({
        error: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
    }

    // Check if session belongs to the authenticated user
    if (session.user_id !== userId) {
      return res.status(403).json({
        error: 'ACCESS_DENIED',
        message: 'You do not have permission to delete this session',
      });
    }

    // Delete feedback if exists
    if (session.feedback_id) {
      await FeedbackService.deleteFeedback(session.feedback_id);
    }

    // Delete session
    await SessionService.deleteSession(id);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      error: 'DELETE_SESSION_FAILED',
      message: 'Failed to delete session',
    });
  }
});

export default router;
