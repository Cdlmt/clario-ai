import { Router, Request, Response } from 'express';
import {
  questionResponseSchema,
  QuestionResponse,
  categoriesResponseSchema,
} from '../schemas/question.schema';
import { authenticateUser } from '../middlewares/auth.middleware';
import { QuestionService } from '../services/question.service';

const router = Router();

// GET /questions/random - Returns a random question filtered by user's industry
router.get(
  '/random',
  authenticateUser,
  async (req: Request, res: Response<QuestionResponse | { error: string }>) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get user's industry
      const userIndustry = await QuestionService.getUserIndustry(userId);
      if (!userIndustry) {
        return res.status(400).json({
          error: 'User industry not found. Please complete onboarding.',
        });
      }

      // Get a random question from user's industry
      const question = await QuestionService.getRandomQuestionByIndustry(
        userIndustry
      );
      if (!question) {
        return res
          .status(404)
          .json({ error: 'No questions available for your industry' });
      }

      // Validate the response
      const validation = questionResponseSchema.safeParse(question);
      if (!validation.success) {
        console.error('Response validation failed:', validation.error);
        return res.status(500).json({ error: 'Invalid question data' });
      }

      res.json(question);
    } catch (error) {
      console.error('Unexpected error fetching random question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /questions/:category/random - Returns a random question from a specific category filtered by user's industry
router.get(
  '/:category/random',
  authenticateUser,
  async (
    req: Request<{ category: string }>,
    res: Response<QuestionResponse | { error: string }>
  ) => {
    try {
      const { category } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      // Get user's industry
      const userIndustry = await QuestionService.getUserIndustry(userId);
      if (!userIndustry) {
        return res.status(400).json({
          error: 'User industry not found. Please complete onboarding.',
        });
      }

      // Get a random question from this category and user's industry
      const question =
        await QuestionService.getRandomQuestionByCategoryAndIndustry(
          category,
          userIndustry
        );

      if (!question) {
        return res.status(404).json({
          error: `No questions found for category: ${category} in your industry`,
        });
      }

      // Validate the response
      const validation = questionResponseSchema.safeParse(question);
      if (!validation.success) {
        console.error('Response validation failed:', validation.error);
        return res.status(500).json({ error: 'Invalid question data' });
      }

      res.json(question);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error(
        'Error fetching random question by category:',
        errorMessage
      );
      if (errorMessage.includes('Category not found')) {
        return res.status(404).json({ error: errorMessage });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// GET /questions - Returns all available categories
router.get(
  '/',
  async (
    _req: Request,
    res: Response<{ categories: string[] } | { error: string }>
  ) => {
    try {
      const categories = await QuestionService.getCategories();

      // Validate the response
      const validation = categoriesResponseSchema.safeParse({ categories });
      if (!validation.success) {
        console.error('Response validation failed:', validation.error);
        return res.status(500).json({ error: 'Invalid categories data' });
      }

      res.json({ categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
