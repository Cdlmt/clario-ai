import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Text from '../../../shared/ui/text'
import { colors } from '../../../shared/constants/theme'
import { useTranslation } from '../../locales'

type AnswerStopButtonProps = {
  onPress?: () => void
}

export default function AnswerStopButton({ onPress }: AnswerStopButtonProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text variant="body" weight="bold" color={colors.white}>{t('practice:stop')}</Text>
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
