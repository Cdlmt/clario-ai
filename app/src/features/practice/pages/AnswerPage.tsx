import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { colors } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';
import AnswerStopButton from '../components/answer.stop.button';
import AudioWaveform from '../components/audio.waveform';
import { usePracticeFlow } from '../hooks/usePracticeFlow';
import { useTranslation } from '../../locales';

export default function AnswerPage() {
  const { isRecording, levels, beginRecording, finishRecording } =
    usePracticeFlow();
  const { t } = useTranslation();

  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    // Small delay to ensure audio module is ready
    const timer = setTimeout(() => {
      beginRecording();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text
        variant="h1"
        weight="bold"
        color={colors.white}
        style={styles.text}
      >
        {isRecording ? t('practice:recordingSpeakNow') : t('practice:startSpeakingWhenReady')}
      </Text>
      <AudioWaveform levels={levels} />
      <AnswerStopButton onPress={finishRecording} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
