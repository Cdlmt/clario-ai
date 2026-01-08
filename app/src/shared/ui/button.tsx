import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { colors } from '../constants/theme';

type ButtonProps = TouchableOpacityProps & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export default function Button(props: ButtonProps) {
  const { variant = 'primary', disabled, ...rest } = props;

  return (
    <TouchableOpacity
      {...rest}
      disabled={disabled}
      style={[
        styles.container,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled
      ]}
    >
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
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
})