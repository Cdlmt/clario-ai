import { Router, Request, Response } from 'express';
import { TranscribeResponse } from '../schemas/transcribe.schema';
import { uploadAudio } from '../middlewares/multer.middleware';
import { TranscriptionService } from '../services/transcription.service';

const router = Router();

// POST /transcribe - Transcribes audio file to text
router.post('/', uploadAudio, async (req: Request, res: Response) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'NO_AUDIO_FILE',
        message: 'No audio file provided',
      });
    }

    // Transcribe the audio
    const result = await TranscriptionService.transcribeAudio(req.file.path);

    const response: TranscribeResponse = {
      transcript: result.transcript,
    };

    res.json(response);
  } catch (error) {
    console.error('Transcription error:', error);

    // Handle multer errors
    if (error instanceof Error && error.message.includes('Invalid file type')) {
      return res.status(400).json({
        error: 'INVALID_FILE_TYPE',
        message: error.message,
      });
    }

    if (error instanceof Error && error.message.includes('File too large')) {
      return res.status(400).json({
        error: 'FILE_TOO_LARGE',
        message: 'Audio file is too large. Maximum size is 25MB.',
      });
    }

    res.status(500).json({
      error: 'TRANSCRIPTION_FAILED',
      message: 'Failed to transcribe audio',
    });
  }
});

export default router;
