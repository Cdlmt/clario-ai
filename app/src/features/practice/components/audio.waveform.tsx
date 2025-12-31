import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors } from '../../../shared/constants/theme';

const BAR_COUNT = 32;
const BAR_WIDTH = 3;
const BAR_GAP = 4;
const MIN_HEIGHT = 4;
const MAX_HEIGHT = 60;

type AudioWaveformProps = {
  levels: number[];
};

export default function AudioWaveform({ levels }: AudioWaveformProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: BAR_COUNT }).map((_, index) => (
        <WaveformBar key={index} level={levels[index] ?? 0} />
      ))}
    </View>
  );
}

type WaveformBarProps = {
  level: number;
};

function WaveformBar({ level }: WaveformBarProps) {
  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;

  useEffect(() => {
    const targetHeight = MIN_HEIGHT + level * (MAX_HEIGHT - MIN_HEIGHT);
    Animated.spring(animatedHeight, {
      toValue: targetHeight,
      damping: 15,
      stiffness: 150,
      mass: 1,
      useNativeDriver: false,
    }).start();
  }, [level, animatedHeight]);

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          height: animatedHeight,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: MAX_HEIGHT,
    gap: BAR_GAP,
  },
  bar: {
    width: BAR_WIDTH,
    backgroundColor: colors.white,
    borderRadius: BAR_WIDTH / 2,
  },
});
