import { supabase } from '../lib/supabase';
import { QuestionResponse } from '../schemas/question.schema';

export class QuestionService {
  /**
   * Get user's industry from the database
   */
  static async getUserIndustry(userId: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('users')
      .select('job_industry')
      .eq('id', userId)
      .single();

    if (error || !data?.job_industry) {
      console.error('Error fetching user industry:', error);
      return null;
    }

    return data.job_industry;
  }

  /**
   * Get a random question filtered by user's industry
   */
  static async getRandomQuestionByIndustry(
    userIndustry: number
  ): Promise<QuestionResponse | null> {
    // First, count total questions for this industry
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('industry', userIndustry);

    if (countError) {
      console.error('Error counting questions:', countError);
      throw new Error('Failed to fetch question');
    }

    if (!count || count === 0) {
      return null;
    }

    // Generate random offset
    const randomOffset = Math.floor(Math.random() * count);

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
      .eq('industry', userIndustry)
      .range(randomOffset, randomOffset);

    if (error) {
      console.error('Error fetching random question:', error);
      throw new Error('Failed to fetch question');
    }

    if (!data || data.length === 0) {
      return null;
    }

    const questionData = data[0];

    return {
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
  }

  /**
   * Get a random question from a specific category filtered by user's industry
   */
  static async getRandomQuestionByCategoryAndIndustry(
    categoryKey: string,
    userIndustry: number
  ): Promise<QuestionResponse | null> {
    // First, find the category by key
    const { data: categoryData, error: categoryError } = await supabase
      .from('question_categories')
      .select('id')
      .eq('key', categoryKey)
      .single();

    if (categoryError || !categoryData) {
      throw new Error(`Category not found: ${categoryKey}`);
    }

    // First, count total questions for this category and industry
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('category', categoryData.id)
      .eq('industry', userIndustry);

    if (countError) {
      console.error('Error counting questions by category:', countError);
      throw new Error('Failed to fetch question');
    }

    if (!count || count === 0) {
      return null;
    }

    // Generate random offset
    const randomOffset = Math.floor(Math.random() * count);

    // Get a random question from this category and user's industry
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
      .eq('industry', userIndustry)
      .range(randomOffset, randomOffset);

    if (error) {
      console.error('Error fetching random question by category:', error);
      throw new Error('Failed to fetch question');
    }

    if (!data || data.length === 0) {
      return null;
    }

    const questionData = data[0];

    return {
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
  }

  /**
   * Get all available categories
   */
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('question_categories')
      .select('key')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }

    return data.map((cat) => cat.key);
  }
}
