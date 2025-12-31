import { StyleSheet, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { colors } from '../../../shared/constants/theme';
import Text from '../../../shared/ui/text';
import AnswerStopButton from '../components/answer.stop.button';
import AudioWaveform from '../components/audio.waveform';
import { usePracticeFlow } from '../hooks/usePracticeFlow';

export default function AnswerPage() {
  const { isRecording, levels, beginRecording, finishRecording } =
    usePracticeFlow();

  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      beginRecording();
    }
  }, [beginRecording]);

  return (
    <View style={styles.container}>
      <Text
        variant="h1"
        weight="bold"
        color={colors.white}
        style={styles.text}
      >
        {isRecording ? 'Recording... Speak now!' : 'You can start speaking when ready..'}
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
