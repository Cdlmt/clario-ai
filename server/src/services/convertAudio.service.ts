import ffmpeg from 'fluent-ffmpeg';
import { Readable, PassThrough } from 'stream';

class ConvertAudioService {
  static async convertBufferToWav(
    buffer: Buffer,
    contentType: string
  ): Promise<Buffer> {
    const inputFormat = this.getInputFormatFromContentType(contentType);

    // Readable.from(buffer) est OK (ça se termine bien)
    const inputStream = Readable.from(buffer);

    return new Promise((resolve, reject) => {
      const outputStream = new PassThrough();
      const chunks: Buffer[] = [];

      outputStream.on('data', (chunk) =>
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      );
      outputStream.on('error', reject);
      outputStream.on('end', () => resolve(Buffer.concat(chunks)));

      const cmd = ffmpeg(inputStream)
        .inputFormat(inputFormat) // IMPORTANT
        .audioChannels(1)
        .audioFrequency(16000)
        .audioCodec('pcm_s16le')
        .format('wav')
        .on('start', (commandLine) =>
          console.log('[ffmpeg] start:', commandLine)
        )
        .on('error', (err) =>
          reject(new Error(`Audio conversion failed: ${err.message}`))
        )
        .on('end', () => {
          console.log('[ffmpeg] end');
        });

      cmd.pipe(outputStream, { end: true });
    });
  }

  private static getInputFormatFromContentType(contentType: string): string {
    const formatMap: Record<string, string> = {
      'audio/m4a': 'm4a',
      'audio/mp4': 'mp4',
      'video/mp4': 'mp4', // IMPORTANT (iOS renvoie parfois video/mp4)
      'audio/wav': 'wav',
      'audio/mpeg': 'mp3',
      'audio/aac': 'aac',
      'audio/x-m4a': 'm4a',
      'application/octet-stream': 'mp4', // fallback réaliste en mobile
    };

    return formatMap[contentType] || 'mp4';
  }
}

export default ConvertAudioService;
