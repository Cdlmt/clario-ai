import OpenAI from 'openai';
import fs from 'fs';
import ConvertAudioService from './convertAudio.service';

// Initialize OpenAI client - will be created when needed
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface TranscriptionResult {
  transcript: string;
}

export class TranscriptionService {
  /**
   * Transcribes audio buffer using OpenAI Whisper API
   */
  static async transcribeAudio(path: string): Promise<TranscriptionResult> {
    try {
      const audioBuffer = await ConvertAudioService.convertToWav(path);

      const file = await OpenAI.toFile(audioBuffer, 'audio.wav', {
        type: 'audio/wav',
      });

      const transcription = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        response_format: 'text',
      });

      console.log(
        'Transcription successful:',
        transcription?.substring(0, 100) + '...'
      );

      return {
        transcript: transcription.trim(),
      };
    } catch (error) {
      console.error('Transcription service error:', error);
      throw new Error(
        `Failed to transcribe audio: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
