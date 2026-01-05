import { API_BASE_URL } from '../../../shared/constants/api';

export type TranscribeResponse = {
  transcript: string;
  sessionId: string;
};

export type TranscribeError = {
  error: string;
  message: string;
};

export async function transcribeAudio(
  audioUri: string
): Promise<TranscribeResponse> {
  const formData = new FormData();

  // Extract filename from URI
  const filename = audioUri.split('/').pop() || 'audio.m4a';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `audio/${match[1]}` : 'audio/m4a';

  formData.append('audio', {
    uri: audioUri,
    name: filename,
    type,
  } as unknown as Blob);

  const response = await fetch(`${API_BASE_URL}/transcribe`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  if (!response.ok) {
    const errorData: TranscribeError = await response.json();
    throw new Error(errorData.message || 'Failed to transcribe audio');
  }

  const data: TranscribeResponse = await response.json();
  return data;
}
