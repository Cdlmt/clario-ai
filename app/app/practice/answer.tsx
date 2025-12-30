import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { PracticeAnswerLayout } from '../../src/features/practice/components/practice.answer.layout'
import AnswerPage from '../../src/features/practice/pages/AnswerPage'

export default function AnswerRoute() {
  return (
    <PracticeAnswerLayout>
      <AnswerPage />
    </PracticeAnswerLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})