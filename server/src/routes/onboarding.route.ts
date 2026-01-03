import { Router, Request, Response } from 'express';
import {
  completeOnboardingRequestSchema,
  CompleteOnboardingResponse,
} from '../schemas/onboarding.schema';
import { supabase } from '../lib/supabase';
import { JobIndustry } from '../models/industry';

const router = Router();

// GET /onboarding/job-industries - Get all available job industries
router.get(
  '/job-industries',
  async (_req: Request, res: Response<JobIndustry[] | { error: string }>) => {
    try {
      const { data, error } = await supabase
        .from('job_industries')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching job industries:', error);
        return res
          .status(500)
          .json({ error: 'Failed to fetch job industries' });
      }

      res.json(data);
    } catch (error) {
      console.error('Unexpected error fetching job industries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// POST /onboarding/complete - Complete user onboarding
router.post('/complete', async (req: Request, res: Response) => {
  try {
    const validation = completeOnboardingRequestSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: validation.error.errors[0]?.message || 'Invalid request',
      });
      return;
    }

    const { name, industryId, userId } = validation.data;

    // Save onboarding data to database
    const { data: _, error: dbError } = await supabase
      .from('users')
      .upsert(
        {
          id: userId,
          name,
          job_industry: industryId,
        },
        { onConflict: 'id' }
      )
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      res.status(500).json({
        error: 'DATABASE_ERROR',
        message: 'Failed to save user data',
      });
      return;
    }

    const response: CompleteOnboardingResponse = {
      success: true,
      userId,
      message: 'Onboarding completed successfully',
    };

    res.json(response);
  } catch (error) {
    console.error('Onboarding completion error:', error);
    res.status(500).json({
      error: 'ONBOARDING_FAILED',
      message: 'Failed to complete onboarding',
    });
  }
});

export default router;
