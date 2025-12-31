import { useMemo } from "react"
import { feedbackColors } from "../../../shared/constants/theme"

export default function useFeedbackScore(score: number) {
  const color = useMemo(() => {
    if (score < 20) return feedbackColors.bad
    if (score < 40) return feedbackColors.low
    if (score < 60) return feedbackColors.fair
    if (score < 80) return feedbackColors.good
    return feedbackColors.perfect
  }, [score]);

  const label = useMemo(() => {
    if (score < 20) return 'Bad'
    if (score < 40) return 'Low'
    if (score < 60) return 'Fair'
    if (score < 80) return 'Good'
    return 'Perfect'
  }, [score]);

  return {
    color,
    label,
  }
}