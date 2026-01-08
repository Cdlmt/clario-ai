import OpenAI from 'openai';
import ConvertAudioService from './convertAudio.service';
import { config } from '../lib/config';

// Initialize OpenAI client with config
const openai = new OpenAI({ apiKey: config.openai.apiKey });

export interface TranscriptionResult {
  transcript: string;
}

export class TranscriptionService {
  /**
   * Transcribes audio buffer using OpenAI Whisper API
   */
  static async transcribeAudio(
    buffer: Buffer,
    contentType: string
  ): Promise<TranscriptionResult> {
    try {
      // Convert buffer to WAV format for OpenAI Whisper
      const audioBuffer = await ConvertAudioService.convertBufferToWav(
        buffer,
        contentType
      );

      const file = await OpenAI.toFile(audioBuffer, 'audio.wav', {
        type: 'audio/wav',
      });

      const transcription = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        response_format: 'text',
        language: 'en',
      });

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
