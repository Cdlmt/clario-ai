import { supabase } from '../lib/supabase';
import { JobIndustry } from '../models/industry';
import { QuestionResponse } from '../schemas/question.schema';

const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'fr', 'es'];

export class QuestionService {
  /**
   * Get user's industry from the database
   */
  static async getUserIndustry(userId: string): Promise<JobIndustry | null> {
    const { data, error } = await supabase
      .from('users')
      .select('job_industry')
      .eq('id', userId)
      .single();

    if (error || !data?.job_industry) {
      console.error('Error fetching user industry:', error);
      return null;
    }

    const { data: industryData, error: industryError } = await supabase
      .from('job_industries')
      .select('*')
      .eq('id', data.job_industry)
      .single();

    if (industryError || !industryData) {
      return null;
    }

    return industryData;
  }

  /**
   * Get translated text for a question
   */
  private static async getTranslatedText(
    questionId: number,
    originalText: string | null,
    language: string
  ): Promise<string> {
    if (
      language === DEFAULT_LANGUAGE ||
      !SUPPORTED_LANGUAGES.includes(language)
    ) {
      return originalText || '';
    }

    const { data: translation } = await supabase
      .from('question_translations')
      .select('text')
      .eq('question_id', questionId)
      .eq('language', language)
      .single();

    return translation?.text || originalText || '';
  }

  /**
   * Get a random question filtered by user's industry
   */
  static async getRandomQuestionByIndustry(
    userIndustry: JobIndustry,
    language: string = DEFAULT_LANGUAGE
  ): Promise<QuestionResponse | null> {
    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('industry', userIndustry.id);

    if (countError) {
      console.error('Error counting questions:', countError);
      throw new Error('Failed to fetch question');
    }

    if (!count || count === 0) {
      return null;
    }

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
      .eq('industry', userIndustry.id)
      .range(randomOffset, randomOffset);

    if (error) {
      console.error('Error fetching random question:', error);
      throw new Error('Failed to fetch question');
    }

    if (!data || data.length === 0) {
      return null;
    }

    const questionData = data[0];
    const translatedText = await this.getTranslatedText(
      questionData.id,
      questionData.text,
      language
    );

    return {
      id: questionData.id,
      text: translatedText,
      category: questionData.question_categories
        ? {
            id: (questionData.question_categories as any).id,
            key: (questionData.question_categories as any).key,
            name: (questionData.question_categories as any).name,
          }
        : undefined,
      industry: {
        id: userIndustry.id,
        key: userIndustry.key,
        name: userIndustry.name,
      },
    };
  }

  /**
   * Get a random question from a specific category filtered by user's industry
   */
  static async getRandomQuestionByCategoryAndIndustry(
    categoryKey: string,
    userIndustry: JobIndustry,
    language: string = DEFAULT_LANGUAGE
  ): Promise<QuestionResponse | null> {
    const { data: categoryData, error: categoryError } = await supabase
      .from('question_categories')
      .select('id')
      .eq('key', categoryKey)
      .single();

    if (categoryError || !categoryData) {
      throw new Error(`Category not found: ${categoryKey}`);
    }

    const { count, error: countError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('category', categoryData.id)
      .eq('industry', userIndustry.id);

    if (countError) {
      console.error('Error counting questions by category:', countError);
      throw new Error('Failed to fetch question');
    }

    if (!count || count === 0) {
      return null;
    }

    const randomOffset = Math.floor(Math.random() * count);

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
      .eq('industry', userIndustry.id)
      .range(randomOffset, randomOffset);

    if (error) {
      console.error('Error fetching random question by category:', error);
      throw new Error('Failed to fetch question');
    }

    if (!data || data.length === 0) {
      return null;
    }

    const questionData = data[0];
    const translatedText = await this.getTranslatedText(
      questionData.id,
      questionData.text,
      language
    );

    return {
      id: questionData.id,
      text: translatedText,
      category: questionData.question_categories
        ? {
            id: (questionData.question_categories as any).id,
            key: (questionData.question_categories as any).key,
            name: (questionData.question_categories as any).name,
          }
        : undefined,
      industry: {
        id: userIndustry.id,
        key: userIndustry.key,
        name: userIndustry.name,
      },
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

  /**
   * Parse language from Accept-Language header
   */
  static parseLanguage(acceptLanguage: string | undefined): string {
    if (!acceptLanguage) {
      return DEFAULT_LANGUAGE;
    }

    const primaryLanguage = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase();

    return SUPPORTED_LANGUAGES.includes(primaryLanguage)
      ? primaryLanguage
      : DEFAULT_LANGUAGE;
  }
}
