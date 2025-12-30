import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors } from '../../../shared/constants/theme'
import Text from '../../../shared/ui/text'
import AnswerStopButton from '../components/answer.stop.button'

export default function AnswerPage() {
  return (
    <View style={styles.container}>
      <Text variant="h1" weight="bold" color={colors.white} style={styles.text}>You can start speaking when ready..</Text>
      <AnswerStopButton />
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