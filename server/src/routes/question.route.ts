import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import {
  questionResponseSchema,
  QuestionResponse,
  categoriesResponseSchema,
} from '../schemas/question.schema';

const router = Router();

// GET /questions/random - Returns a random question
router.get(
  '/random',
  async (
    _req: Request,
    res: Response<QuestionResponse | { error: string }>
  ) => {
    try {
      // Get a random question with category information
      const { data, error } = await supabase
        .from('questions')
        .select(
          `
        id,
        text,
        category,
        question_categories (
          id,
          key,
          name
        )
      `
        )
        .order('RANDOM()')
        .limit(1);

      if (error) {
        console.error('Error fetching random question:', error);
        return res.status(500).json({ error: 'Failed to fetch question' });
      }

      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'No questions available' });
      }

      const questionData = data[0];

      // Transform the data to match our response schema
      const question: QuestionResponse = {
        id: questionData.id,
        text: questionData.text,
        category: questionData.question_categories
          ? {
              id: (questionData.question_categories as any).id,
              key: (questionData.question_categories as any).key,
              name: (questionData.question_categories as any).name,
            }
          : undefined,
      };

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

// GET /questions/:category/random - Returns a random question from a specific category
router.get(
  '/:category/random',
  async (
    req: Request<{ category: string }>,
    res: Response<QuestionResponse | { error: string }>
  ) => {
    try {
      const { category } = req.params;

      // First, find the category by key
      const { data: categoryData, error: categoryError } = await supabase
        .from('question_categories')
        .select('id')
        .eq('key', category)
        .single();

      if (categoryError || !categoryData) {
        return res
          .status(404)
          .json({ error: `Category not found: ${category}` });
      }

      // Get a random question from this category
      const { data, error } = await supabase
        .from('questions')
        .select(
          `
          id,
          text,
          question_categories (
            id,
            key,
            name
          )
        `
        )
        .eq('category', categoryData.id)
        .order('RANDOM()')
        .limit(1);

      if (error) {
        console.error('Error fetching random question by category:', error);
        return res.status(500).json({ error: 'Failed to fetch question' });
      }

      if (!data || data.length === 0) {
        return res
          .status(404)
          .json({ error: `No questions found for category: ${category}` });
      }

      const questionData = data[0];

      // Transform the data to match our response schema
      const question: QuestionResponse = {
        id: questionData.id,
        text: questionData.text,
        category: questionData.question_categories
          ? {
              id: (questionData.question_categories as any).id,
              key: (questionData.question_categories as any).key,
              name: (questionData.question_categories as any).name,
            }
          : undefined,
      };

      // Validate the response
      const validation = questionResponseSchema.safeParse(question);
      if (!validation.success) {
        console.error('Response validation failed:', validation.error);
        return res.status(500).json({ error: 'Invalid question data' });
      }

      res.json(question);
    } catch (error) {
      console.error(
        'Unexpected error fetching random question by category:',
        error
      );
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
      const { data, error } = await supabase
        .from('question_categories')
        .select('key')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Failed to fetch categories' });
      }

      const categories = data.map((cat) => cat.key);

      // Validate the response
      const validation = categoriesResponseSchema.safeParse({ categories });
      if (!validation.success) {
        console.error('Response validation failed:', validation.error);
        return res.status(500).json({ error: 'Invalid categories data' });
      }

      res.json({ categories });
    } catch (error) {
      console.error('Unexpected error fetching categories:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;
