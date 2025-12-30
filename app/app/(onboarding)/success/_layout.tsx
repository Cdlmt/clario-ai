import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { OnboardingLayout as OnboardingLayoutComponent } from '../../../src/features/onboarding/components/onboarding.layout';
import { Slot } from 'expo-router';

export default function OnboardingSuccessLayout() {
  return (
    <OnboardingLayoutComponent>
      <Slot />
    </OnboardingLayoutComponent>
  )
}

const styles = StyleSheet.create({})