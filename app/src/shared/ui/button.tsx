import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/theme';

type ButtonProps = TouchableOpacityProps;

export default function Button(props: ButtonProps) {
  return (
    <TouchableOpacity {...props} style={styles.container}>
      {props.children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
  }
})