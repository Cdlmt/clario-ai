import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/theme';

type ButtonProps = TouchableOpacityProps & {
  variant?: 'primary' | 'secondary';
};

export default function Button(props: ButtonProps) {
  const { variant = 'primary', ...rest } = props;

  return (
    <TouchableOpacity {...rest} style={[styles.container, variant === 'secondary' && { backgroundColor: colors.secondary }]}>
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