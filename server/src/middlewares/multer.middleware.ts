import multer from 'multer';
import { Request } from 'express';
import { config } from '../lib/config';

// Configure multer for audio file uploads using memory storage
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Use allowed MIME types from config
  const allowedMimes = config.audio.allowedMimeTypes;

  // Also check file extension as fallback for some browsers/apps
  const allowedExtensions = [
    '.wav',
    '.mp3',
    '.webm',
    '.ogg',
    '.aac',
    '.flac',
    '.m4a',
    '.mp4',
  ];
  const fileExtension = file.originalname
    .toLowerCase()
    .substring(file.originalname.lastIndexOf('.'));

  if (
    allowedMimes.includes(file.mimetype) ||
    allowedExtensions.includes(fileExtension)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only audio files are allowed. Received: ${file.mimetype} with extension ${fileExtension}`
      )
    );
  }
};

export const uploadAudio = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.audio.maxSizeBytes, // Use configured limit
  },
}).single('audio');
