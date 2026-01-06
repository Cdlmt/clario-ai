import { StyleSheet, TextInput, TextInputProps, View } from 'react-native'
import React from 'react'
import Text from './text';
import { colors } from '../constants/theme';
import { Feather } from '@expo/vector-icons';

type InputProps = TextInputProps & {
  label?: string;
  icon?: keyof typeof Feather.glyphMap;
};

export default function Input(props: InputProps) {
  const { label, icon, ...passThroughProps } = props;
  return (
    <View style={styles.container}>
      {label && <Text variant="body" weight="regular" color={colors.black}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && <Feather name={icon} size={20} color={colors.black} />}
        <TextInput style={styles.input} placeholderTextColor={colors.darkGray} {...passThroughProps} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 5,
  },
  inputContainer: {
    minHeight: 40,
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    padding: 10,
  },
  input: {
    flex: 1,
  },
});