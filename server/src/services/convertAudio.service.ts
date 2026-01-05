import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

class ConvertAudioService {
  static async convertToWav(inputPath: string): Promise<Buffer> {
    const outputPath = inputPath.replace(path.extname(inputPath), '.wav');

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-ar 16000', // sample rate 16k
          '-ac 1', // mono
          '-c:a pcm_s16le', // PCM 16 bits LE
        ])
        .toFormat('wav')
        .on('error', (err) => reject(err))
        .on('end', () => resolve(fs.readFileSync(outputPath)))
        .save(outputPath);
    });
  }
}

export default ConvertAudioService;
