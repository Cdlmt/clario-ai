import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: 'AUTHENTICATION_REQUIRED',
        message: 'Authorization header is required',
      });
      return;
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      res.status(401).json({
        error: 'INVALID_TOKEN',
        message: 'Token is required',
      });
      return;
    }

    // Verify the JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth error:', error);
      res.status(401).json({
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      });
      return;
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'AUTHENTICATION_ERROR',
      message: 'Authentication failed',
    });
  }
};
