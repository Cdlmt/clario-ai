import { Request, Response, NextFunction } from 'express';
import { MembershipService } from '../services/membership.service';

export const checkUsageLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const usageCheck = await MembershipService.checkUsageLimit(userId);

    if (!usageCheck.can_use) {
      res.status(429).json({
        error: 'USAGE_LIMIT_EXCEEDED',
        message:
          'Vous avez atteint la limite de 3 questions par jour pour le plan gratuit',
        details: {
          questions_used: usageCheck.questions_used,
          questions_remaining: usageCheck.questions_remaining,
          plan_type: usageCheck.plan_type,
          upgrade_required: true,
        },
      });
      return;
    }

    // Attach usage info to request for later use
    req.usageCheck = usageCheck;
    next();
  } catch (error) {
    console.error('Usage check middleware error:', error);
    res.status(500).json({
      error: 'USAGE_CHECK_FAILED',
      message: "Erreur lors de la vérification des limites d'usage",
    });
  }
};

export const incrementUsage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Only increment if this is a new question (not just analysis of existing)
    // We'll check if this is called from transcribe route vs analyze route
    const isNewQuestion =
      req.route?.path?.includes('/transcribe') ||
      req.originalUrl?.includes('/transcribe');

    if (isNewQuestion) {
      await MembershipService.incrementUsage(userId);
    }

    next();
  } catch (error) {
    console.error('Usage increment middleware error:', error);
    // Don't block the request if increment fails, just log it
    next();
  }
};

// Extend Express Request type to include usage check
declare global {
  namespace Express {
    interface Request {
      usageCheck?: Awaited<
        ReturnType<typeof MembershipService.checkUsageLimit>
      >;
    }
  }
}
