import { StyleSheet, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/theme';

export default function Divider() {
  return (
    <View style={styles.divider} />
  )
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
  },
});