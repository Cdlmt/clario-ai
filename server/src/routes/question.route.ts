import { Router, Request, Response } from 'express';
import { mockQuestions, QuestionResponse } from '../schemas/question.schema';

const router = Router();

// GET /questions/random - Returns a random question
router.get('/random', (_req: Request, res: Response<QuestionResponse>) => {
  const randomIndex = Math.floor(Math.random() * mockQuestions.length);
  const question = mockQuestions[randomIndex];
  res.json(question);
});

// GET /questions/:category/random - Returns a random question from a specific category
router.get(
  '/:category/random',
  (
    req: Request<{ category: string }>,
    res: Response<QuestionResponse | { error: string }>
  ) => {
    const { category } = req.params;
    const categoryQuestions = mockQuestions.filter(
      (q) => q.category?.toLowerCase() === category.toLowerCase()
    );

    if (categoryQuestions.length === 0) {
      res
        .status(404)
        .json({ error: `No questions found for category: ${category}` });
      return;
    }

    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    const question = categoryQuestions[randomIndex];
    res.json(question);
  }
);

// GET /questions - Returns all available categories
router.get('/', (_req: Request, res: Response<{ categories: string[] }>) => {
  const categories = [
    ...new Set(mockQuestions.map((q) => q.category).filter(Boolean)),
  ] as string[];
  res.json({ categories });
});

export default router;
