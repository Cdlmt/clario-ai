import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

const LEVEL_HISTORY_SIZE = 32;
const METERING_INTERVAL = 50;

type UseAudioRecordingReturn = {
  isRecording: boolean;
  levels: number[];
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
};

function normalizeDecibels(db: number): number {
  // Metering typically returns values between -160 (silence) and 0 (max)
  // We normalize to 0-1 range
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
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateLevels = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      const status = await recordingRef.current.getStatusAsync();
      if (status.isRecording && status.metering !== undefined) {
        const normalizedLevel = normalizeDecibels(status.metering);
        setLevels((prev) => {
          const newLevels = [...prev.slice(1), normalizedLevel];
          return newLevels;
        });
      }
    } catch {
      // Recording might have stopped
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access microphone was denied');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });
      await recording.startAsync();

      recordingRef.current = recording;
      setIsRecording(true);
      setLevels(Array(LEVEL_HISTORY_SIZE).fill(0));

      intervalRef.current = setInterval(updateLevels, METERING_INTERVAL);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [updateLevels]);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!recordingRef.current) {
      return null;
    }

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);
      setLevels(Array(LEVEL_HISTORY_SIZE).fill(0));

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  return {
    isRecording,
    levels,
    startRecording,
    stopRecording,
  };
}
