import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, paddings } from '../../../shared/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type OnboardingLayoutProps = {
  children: React.ReactNode;
};

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: paddings.horizontal,
  },
});