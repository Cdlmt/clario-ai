import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { PracticeLayout as PracticeLayoutComponent } from '../../src/features/practice/components/practice.layout'

export default function PracticeLayout() {
  return (
    <PracticeLayoutComponent>
      <Slot />
    </PracticeLayoutComponent>
  )
}

const styles = StyleSheet.create({})