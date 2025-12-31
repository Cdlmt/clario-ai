import { StyleSheet, View } from 'react-native'
import React from 'react'
import Svg, { Circle } from 'react-native-svg'
import { colors } from '../../../../shared/constants/theme'
import Text from '../../../../shared/ui/text'
import useFeedbackScore from '../../hooks/useFeedbackScore'

interface FeedbackScoreProps {
  score: number
  maxScore?: number
}

const SIZE = 54
const STROKE_WIDTH = 5
const RADIUS = (SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const ARC_ANGLE = 360
const ARC_LENGTH = (ARC_ANGLE / 360) * CIRCUMFERENCE

export default function FeedbackScore({
  score,
  maxScore = 100,
}: FeedbackScoreProps) {
  const progress = Math.min(score / maxScore, 1)
  const strokeDashoffset = ARC_LENGTH * (1 - progress)
  const { color, label } = useFeedbackScore(score)

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Svg width={SIZE} height={SIZE} style={styles.svg}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#E5E5E5"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            rotation={135}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />

          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation={135}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
        <Text variant="largeBody" weight="medium" color={color}>{score}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
        <Text variant="smallText" weight="medium" color={color}>{label}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 84,
    height: 84,
    gap: 5,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderRadius: 20,
  },
})