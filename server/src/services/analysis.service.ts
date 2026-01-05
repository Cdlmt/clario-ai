import OpenAI from 'openai';
import { AnalyzeRequest, AnalyzeResponse } from '../schemas/analyze.schema';

// Initialize OpenAI client - will be created when needed
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class AnalysisService {
  /**
   * Analyzes interview answer using OpenAI GPT-4
   */
  static async analyzeAnswer(
    request: AnalyzeRequest
  ): Promise<AnalyzeResponse> {
    try {
      const prompt = this.buildAnalysisPrompt(request);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert interview coach. Analyze the candidate's response to provide constructive feedback.
Return ONLY a valid JSON object with the exact structure specified. Do not include any other text, explanations, or markdown formatting.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const analysis = JSON.parse(content) as AnalyzeResponse;

      console.log('Analysis successful:', {
        clarity: analysis.clarity.rating,
        length: analysis.length.rating,
        weak_words_count: analysis.weak_words.words.length,
      });

      return analysis;
    } catch (error) {
      console.error('Analysis service error:', error);
      throw new Error(
        `Failed to analyze answer: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  private static buildAnalysisPrompt(request: AnalyzeRequest): string {
    const { question, transcript, durationSeconds } = request;

    return `Analyze this interview response and provide feedback in the following JSON format:

{
  "clarity": {
    "rating": <number 0-100>,
    "comment": "<string>"
  },
  "length": {
    "rating": <number 0-100>,
    "durationSeconds": ${durationSeconds},
    "durationTargetSeconds": 90,
    "comment": "<string>"
  },
  "weak_words": {
    "rating": <number 0-100>,
    "words": [
      {"word": "<string>", "count": <number>},
      ...
    ],
    "comment": "<string>"
  },
  "key_suggestion": "<string>",
  "conciseness": {
    "rating": <number 0-100>,
    "comment": "<string>"
  },
  "confidence_indicator": {
    "rating": <number 0-100>,
    "comment": "<string>"
  }
}

QUESTION: "${question}"

TRANSCRIPT: "${transcript}"

ANALYSIS CRITERIA:
- clarity: How well-structured and easy to understand is the answer?
- length: Duration should be around 90 seconds (target), rating based on appropriateness
- weak_words: Identify filler words (um, uh, like, you know, actually, basically, honestly, literally, just, really, very, kind of, sort of, so, well) and their frequency
- key_suggestion: One specific, actionable improvement suggestion
- conciseness: How efficiently the message is delivered without unnecessary words
- confidence_indicator: Based on presence of hesitation words and overall delivery confidence

RATING GUIDELINES:
- 0-39: low/poor
- 40-69: medium/average
- 70-100: high/excellent

LENGTH RATING:
- Too short (<45s): rating around 30
- Short (45-72s): rating around 60
- Good (72-117s): rating around 90
- Long (117-153s): rating around 60
- Too long (>153s): rating around 30

Provide specific, actionable feedback that will help the candidate improve their interview performance.`;
  }
}
