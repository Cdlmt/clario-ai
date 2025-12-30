import React from 'react'
import { PracticeLayout } from '../../src/features/practice/components/practice.layout'
import QuestionPage from '../../src/features/practice/pages/QuestionPage'

export default function QuestionRoute() {
  return (
    <PracticeLayout>
      <QuestionPage />
    </PracticeLayout>
  )
}
