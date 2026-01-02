import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import * as FileSystem from 'expo-file-system';

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
  const isStartingRef = useRef(false);
  const hasStartedRecordingRef = useRef(false);

  const audioRecorder = useAudioRecorder(
    {
      ...RecordingPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    },
    (status) => {
      const statusWithMetering = status as { metering?: number };
      if (isRecording && typeof statusWithMetering.metering === 'number') {
        const normalizedLevel = normalizeDecibels(statusWithMetering.metering);
        setLevels((prev) => [...prev.slice(1), normalizedLevel]);
      }
    }
  );

  const startRecording = useCallback(async () => {
    if (isStartingRef.current || hasStartedRecordingRef.current) {
      return;
    }

    isStartingRef.current = true;

    try {
      if (!hasPermissionRef.current) {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          throw new Error('Permission to access microphone was denied');
        }
        hasPermissionRef.current = true;
      }

      await audioRecorder.prepareToRecordAsync();

      setLevels(Array(LEVEL_HISTORY_SIZE).fill(0));
      audioRecorder.record();
      hasStartedRecordingRef.current = true;
      setIsRecording(true);
    } finally {
      isStartingRef.current = false;
    }
  }, [audioRecorder]);

  const stopRecording = useCallback(async (): Promise<string> => {
    if (!hasStartedRecordingRef.current) {
      const uri = uriRef.current;
      if (!uri) {
        throw new Error('No audio URI available');
      }
      return uri;
    }

    await audioRecorder.stop();
    hasStartedRecordingRef.current = false;
    setIsRecording(false);
    setLevels(Array(LEVEL_HISTORY_SIZE).fill(0));

    const tempUri = audioRecorder.uri ?? '';

    if (!tempUri) {
      throw new Error('No audio URI available');
    }

    const fileInfo = await FileSystem.getInfoAsync(tempUri);

    if (!fileInfo.exists) {
      throw new Error('Audio file does not exist at URI');
    }

    // Copy file to document directory to prevent it from being deleted
    const filename = tempUri.split('/').pop() || `recording-${Date.now()}.m4a`;
    const permanentUri = `${FileSystem.documentDirectory}${filename}`;

    try {
      await FileSystem.copyAsync({
        from: tempUri,
        to: permanentUri,
      });
      uriRef.current = permanentUri;
      return permanentUri;
    } catch {
      uriRef.current = tempUri;
      return tempUri;
    }
  }, [audioRecorder]);

  useEffect(() => {
    return () => {
      if (hasStartedRecordingRef.current) {
        try {
          audioRecorder.stop();
          hasStartedRecordingRef.current = false;
        } catch {
          // Ignore cleanup errors when component unmounts
        }
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
