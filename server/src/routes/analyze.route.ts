import { Router, Request, Response } from 'express';
import {
  analyzeRequestSchema,
  AnalyzeResponse,
} from '../schemas/analyze.schema';
import { AnalysisService } from '../services/analysis.service';

const router = Router();

// POST /analyze - Analyzes transcript and returns feedback
router.post('/', async (req: Request, res: Response) => {
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
