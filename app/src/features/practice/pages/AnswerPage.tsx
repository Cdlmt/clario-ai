import { StyleSheet, View } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { colors } from '../../../shared/constants/theme'
import Text from '../../../shared/ui/text'
import AnswerStopButton from '../components/answer.stop.button'
import AudioWaveform from '../components/audio.waveform'

export default function AnswerPage() {
  const levels = useMemo(() => [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 0.5, 0.4, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.5, 0.5, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,], [])

  return (
    <View style={styles.container}>
      <Text variant="h1" weight="bold" color={colors.white} style={styles.text}>
        You can start speaking when ready..
      </Text>
      <AudioWaveform levels={levels} />
      <AnswerStopButton onPress={() => { }} />
    </View>
  )
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
})
