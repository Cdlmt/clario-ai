import { StyleSheet, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native'

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'largeBody'
  | 'body'
  | 'smallBody'
  | 'largeText'
  | 'text'
  | 'smallText';

type TextWeight = 'light' | 'regular' | 'medium' | 'bold';

type TextProps = RNTextProps & {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: string;
};

const fontWeights: Record<TextWeight, TextStyle['fontWeight']> = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
};

export default function Text({ variant = 'body', weight, style, color, ...props }: TextProps) {
  return (
    <RNText
      style={[
        styles[variant],
        weight && { fontWeight: fontWeights[weight] },
        color && { color },
        style,
      ]}
      {...props}
    />
  )
}

const styles = StyleSheet.create<Record<TextVariant, TextStyle>>({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 48,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 40,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  largeBody: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
  },
  smallBody: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
  },
  largeText: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 24,
  },
  text: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 20,
  },
  smallText: {
    fontSize: 8,
    fontWeight: '500',
    lineHeight: 16,
  },
});
