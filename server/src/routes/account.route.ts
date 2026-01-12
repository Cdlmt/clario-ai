import { Router, Request, Response } from 'express';
import { AccountService } from '../services/account.service';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

// DELETE /account - Delete user account and all data
router.delete('/', authenticateUser, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    await AccountService.deleteUserAccount(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      error: 'DELETE_ACCOUNT_FAILED',
      message: 'Erreur lors de la suppression du compte',
    });
  }
});

export default router;
