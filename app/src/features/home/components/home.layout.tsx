import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, heights, paddings } from '../../../shared/constants/theme';
import HomeBottomBar from './home.bottombar';

type HomeLayoutProps = {
  children: React.ReactNode;
};

export function HomeLayout({ children }: HomeLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.content, { paddingBottom: insets.bottom + heights.bottomBar, paddingTop: insets.top }]}>
        {children}
      </View>
      <HomeBottomBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: paddings.horizontal,
    paddingVertical: paddings.vertical,
  },
});