import { useEffect, useRef } from "react"
import { Animated, Easing, StyleSheet, View } from "react-native"
import { colors } from "../../../shared/constants/theme"

type ProgressBarProps = {
  initialTimer: number;
}

export default function ProgressBar({ initialTimer }: ProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: 0,
      duration: initialTimer * 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [initialTimer, animatedWidth]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            })
          }
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 10,
    backgroundColor: colors.darkGray,
    borderRadius: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
})