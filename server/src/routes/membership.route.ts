import { Router, Request, Response } from 'express';
import { MembershipService } from '../services/membership.service';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

// GET /membership - Get current user's membership and usage stats
router.get('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const stats = await MembershipService.getUsageStats(userId);

    res.json({
      membership: {
        plan_type: stats.plan_type,
        status: stats.status,
      },
      usage: {
        today_usage: stats.today_usage,
        daily_limit: stats.daily_limit,
        questions_remaining: stats.questions_remaining,
      },
    });
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({
      error: 'FETCH_MEMBERSHIP_FAILED',
      message: 'Erreur lors de la récupération des informations de membership',
    });
  }
});

// POST /membership/upgrade - Upgrade user to premium (called by webhooks or admin)
router.post(
  '/upgrade',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { stripe_customer_id } = req.body;

      const updatedMembership = await MembershipService.updateUserMembership(
        userId,
        {
          plan_type: 'premium',
          status: 'active',
          stripe_customer_id,
        }
      );

      res.json({
        success: true,
        membership: {
          plan_type: updatedMembership.plan_type,
          status: updatedMembership.status,
        },
      });
    } catch (error) {
      console.error('Error upgrading membership:', error);
      res.status(500).json({
        error: 'UPGRADE_FAILED',
        message: 'Erreur lors de la mise à niveau du membership',
      });
    }
  }
);

// POST /membership/downgrade - Downgrade user to free (called by webhooks)
router.post(
  '/downgrade',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const updatedMembership = await MembershipService.updateUserMembership(
        userId,
        {
          plan_type: 'free',
          status: 'active',
        }
      );

      res.json({
        success: true,
        membership: {
          plan_type: updatedMembership.plan_type,
          status: updatedMembership.status,
        },
      });
    } catch (error) {
      console.error('Error downgrading membership:', error);
      res.status(500).json({
        error: 'DOWNGRADE_FAILED',
        message: 'Erreur lors du retour au plan gratuit',
      });
    }
  }
);

// POST /membership/sync-pro - Sync pro status from device (Superwall integration)
router.post(
  '/sync-pro',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { entitlementId } = req.body;

      if (!entitlementId || typeof entitlementId !== 'string') {
        return res.status(400).json({
          error: 'INVALID_REQUEST',
          message: 'entitlementId is required and must be a string',
        });
      }

      const result = await MembershipService.syncProFromDevice(
        userId,
        entitlementId
      );

      res.json({
        success: result.success,
        updated: result.updated,
      });
    } catch (error: any) {
      console.error('Error syncing pro status:', error);
      res.status(500).json({
        error: 'SYNC_PRO_FAILED',
        message:
          error.message || 'Erreur lors de la synchronisation du statut pro',
      });
    }
  }
);

// POST /membership/sync-free - Sync free status from device (when user loses pro status)
router.post(
  '/sync-free',
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;

      const result = await MembershipService.syncFreeFromDevice(userId);

      res.json({
        success: result.success,
        updated: result.updated,
      });
    } catch (error: any) {
      console.error('Error syncing free status:', error);
      res.status(500).json({
        error: 'SYNC_FREE_FAILED',
        message:
          error.message ||
          'Erreur lors de la synchronisation du statut gratuit',
      });
    }
  }
);

// POST /membership/webhook - Handle Stripe webhooks for subscription changes
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    // This is a simplified webhook handler
    // In production, you'd validate the webhook signature from Stripe

    if (
      type === 'customer.subscription.created' ||
      type === 'customer.subscription.updated'
    ) {
      const customerId = data.object.customer;
      const status = data.object.status;

      // Find user by stripe_customer_id
      // This would require additional logic to map Stripe customer to user

      res.json({ received: true });
    } else if (type === 'customer.subscription.deleted') {
      // Handle subscription cancellation
      res.json({ received: true });
    } else {
      res.json({ received: true });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'WEBHOOK_PROCESSING_FAILED' });
  }
});

export default router;
