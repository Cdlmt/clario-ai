import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Text from '../../../shared/ui/text'
import { colors } from '../../../shared/constants/theme'

export default function AnswerStopButton() {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <Text variant="body" weight="bold" color={colors.white}>STOP</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 110,
    height: 110,
    borderRadius: 100,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
})