import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';

const LEVEL_HISTORY_SIZE = 32;

type UseAudioRecordingReturn = {
  isRecording: boolean;
  levels: number[];
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
};

function normalizeDecibels(db: number): number {
  const minDb = -60;
  const maxDb = 0;
  const clamped = Math.max(minDb, Math.min(maxDb, db));
  return (clamped - minDb) / (maxDb - minDb);
}

export function useAudioRecording(): UseAudioRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [levels, setLevels] = useState<number[]>(
    Array(LEVEL_HISTORY_SIZE).fill(0)
  );
  const hasPermissionRef = useRef(false);
  const uriRef = useRef<string>('');

  const audioRecorder = useAudioRecorder(
    {
      ...RecordingPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    },
    (status) => {
      // Access metering value from status object
      const statusWithMetering = status as { metering?: number };
      if (isRecording && typeof statusWithMetering.metering === 'number') {
        const normalizedLevel = normalizeDecibels(statusWithMetering.metering);
        setLevels((prev) => [...prev.slice(1), normalizedLevel]);
      }
    }
  );

  const startRecording = useCallback(async () => {
    if (!hasPermissionRef.current) {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        throw new Error('Permission to access microphone was denied');
      }
      hasPermissionRef.current = true;
    }

    setLevels(Array(LEVEL_HISTORY_SIZE).fill(0));
    audioRecorder.record();
    setIsRecording(true);
  }, [audioRecorder]);

  const stopRecording = useCallback(async (): Promise<string> => {
    await audioRecorder.stop();
    setIsRecording(false);
    setLevels(Array(LEVEL_HISTORY_SIZE).fill(0));

    const uri = audioRecorder.uri ?? '';
    uriRef.current = uri;

    if (!uri) {
      throw new Error('No audio URI available');
    }

    return uri;
  }, [audioRecorder]);

  useEffect(() => {
    return () => {
      if (audioRecorder.isRecording) {
        audioRecorder.stop();
      }
    };
  }, [audioRecorder]);

  return {
    isRecording,
    levels,
    startRecording,
    stopRecording,
  };
}
