import multer from 'multer';
import { Request } from 'express';

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Accept audio files - comprehensive list of MIME types
  const allowedMimes = [
    'audio/wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/webm',
    'audio/ogg',
    'audio/aac',
    'audio/flac',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'audio/x-wav',
    'audio/vnd.wav',
  ];

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
    fileSize: 25 * 1024 * 1024, // 25MB limit for audio files
  },
}).single('audio');
