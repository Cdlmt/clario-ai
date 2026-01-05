import { Router, Request, Response } from 'express';
import { SessionService } from '../services/session.service';
import { FeedbackService } from '../services/feedback.service';
import { InterviewSession, SessionWithFeedback } from '../models/session';

const router = Router();

// GET /sessions - Get all sessions
router.get('/', async (req: Request, res: Response) => {
  try {
    const { analyzed } = req.query;

    let sessions: InterviewSession[] | SessionWithFeedback[];

    if (analyzed === 'true') {
      sessions = await SessionService.getAnalyzedSessions();
    } else {
      sessions = await SessionService.getAllSessions();
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
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const session = await SessionService.getSessionById(id);

    if (!session) {
      return res.status(404).json({
        error: 'SESSION_NOT_FOUND',
        message: 'Session not found',
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
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get session to check if it has feedback
    const session = await SessionService.getSessionById(id);
    if (!session) {
      return res.status(404).json({
        error: 'SESSION_NOT_FOUND',
        message: 'Session not found',
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
