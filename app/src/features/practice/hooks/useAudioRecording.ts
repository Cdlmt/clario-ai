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
    // Prevent concurrent start attempts
    if (isStartingRef.current || hasStartedRecordingRef.current) {
      console.log('[AudioRecording] Skipping start - already starting or recording');
      return;
    }

    isStartingRef.current = true;
    console.log('[AudioRecording] Starting recording...');

    try {
      if (!hasPermissionRef.current) {
        console.log('[AudioRecording] Requesting permissions...');
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          throw new Error('Permission to access microphone was denied');
        }
        hasPermissionRef.current = true;
        console.log('[AudioRecording] Permissions granted');
      }

      // Prepare the recorder before starting
      console.log('[AudioRecording] Preparing recorder...');
      await audioRecorder.prepareToRecordAsync();
      console.log('[AudioRecording] Recorder prepared');

      setLevels(Array(LEVEL_HISTORY_SIZE).fill(0));
      audioRecorder.record();
      hasStartedRecordingRef.current = true;
      setIsRecording(true);
      console.log('[AudioRecording] Recording started');
    } finally {
      isStartingRef.current = false;
    }
  }, [audioRecorder]);

  const stopRecording = useCallback(async (): Promise<string> => {
    console.log('[AudioRecording] Stopping recording, hasStarted:', hasStartedRecordingRef.current);
    
    // Only stop if we started recording
    if (!hasStartedRecordingRef.current) {
      console.log('[AudioRecording] Never started, checking uriRef:', uriRef.current);
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
    console.log('[AudioRecording] Recording stopped, temp URI:', tempUri);

    if (!tempUri) {
      throw new Error('No audio URI available');
    }

    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(tempUri);
    console.log('[AudioRecording] File info:', JSON.stringify(fileInfo));

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
      console.log('[AudioRecording] File copied to:', permanentUri);
      uriRef.current = permanentUri;
      return permanentUri;
    } catch (copyError) {
      console.log('[AudioRecording] Copy failed:', copyError);
      // If copy fails, try to use the original URI
      uriRef.current = tempUri;
      return tempUri;
    }
  }, [audioRecorder]);

  useEffect(() => {
    return () => {
      // Only cleanup if recording was never properly stopped
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
