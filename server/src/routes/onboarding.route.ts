import { Router, Request, Response } from 'express';
import {
  completeOnboardingRequestSchema,
  CompleteOnboardingResponse,
} from '../schemas/onboarding.schema';
import { supabase } from '../lib/supabase';

const router = Router();

// POST /onboarding/complete - Complete user onboarding
router.post('/complete', async (req: Request, res: Response) => {
  try {
    console.log('Onboarding completed:', req.body);

    const validation = completeOnboardingRequestSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: validation.error.errors[0]?.message || 'Invalid request',
      });
      return;
    }

    const { name, jobKey, userId } = validation.data;

    // Save onboarding data to database
    const { data, error: dbError } = await supabase
      .from('users')
      .upsert(
        {
          id: userId,
          name,
          job_key: jobKey,
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

    console.log('Onboarding completed and saved:', {
      userId,
      name,
      jobKey,
      timestamp: new Date().toISOString(),
    });

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
