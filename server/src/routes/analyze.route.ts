import { Router, Request, Response } from 'express';
import {
  analyzeRequestSchema,
  AnalyzeResponse,
} from '../schemas/analyze.schema';
import { AnalysisService } from '../services/analysis.service';
import { SessionService } from '../services/session.service';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

// POST /analyze - Analyzes transcript and returns feedback
router.post('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const validation = analyzeRequestSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: validation.error.errors[0]?.message || 'Invalid request',
      });
      return;
    }

    const analysisRequest = validation.data;

    // Use OpenAI-powered analysis service
    const response = await AnalysisService.analyzeAnswer(analysisRequest);

    // Update session and create feedback if sessionId is provided
    if (analysisRequest.sessionId) {
      try {
        // First update session with question and duration
        await SessionService.updateSessionDetails(
          analysisRequest.sessionId,
          analysisRequest.question,
          analysisRequest.durationSeconds
        );

        // Then create feedback
        await SessionService.createSessionFeedback(
          analysisRequest.sessionId,
          response
        );
      } catch (sessionError) {
        console.warn(
          'Failed to update session or create feedback:',
          sessionError
        );
        // Don't fail the request if session update fails
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'ANALYSIS_FAILED',
      message: 'Failed to analyze answer',
    });
  }
});

export default router;
