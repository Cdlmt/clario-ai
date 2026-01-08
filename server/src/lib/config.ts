/**
 * Configuration module for environment variables
 * Validates required environment variables at startup
 */

export interface Config {
  supabase: {
    url: string;
    serviceRoleKey: string;
    bucketAudio: string;
  };
  audio: {
    retention: 'none' | '24h';
    maxSizeBytes: number;
    allowedMimeTypes: string[];
  };
  openai: {
    apiKey: string;
  };
}

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const config: Config = {
  supabase: {
    url: getRequiredEnvVar('SUPABASE_URL'),
    serviceRoleKey: getRequiredEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
    bucketAudio: getRequiredEnvVar('SUPABASE_BUCKET_AUDIO'),
  },
  audio: {
    retention: getOptionalEnvVar('AUDIO_RETENTION', 'none') as 'none' | '24h',
    maxSizeBytes: 25 * 1024 * 1024, // 25MB
    allowedMimeTypes: [
      'audio/m4a',
      'audio/mp4',
      'audio/wav',
      'audio/mpeg',
      'audio/aac',
      'audio/x-m4a',
    ],
  },
  openai: {
    apiKey: getRequiredEnvVar('OPENAI_API_KEY'),
  },
};

// Validate retention value
if (!['none', '24h'].includes(config.audio.retention)) {
  throw new Error(
    `Invalid AUDIO_RETENTION value: ${config.audio.retention}. Must be 'none' or '24h'`
  );
}
