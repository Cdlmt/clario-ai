import React from 'react'
import { Slot } from 'expo-router'
import { HomeLayout as HomeLayoutComponent } from '../../../src/features/home/components/home.layout'

export default function HomeLayout() {
  return (
    <HomeLayoutComponent>
      <Slot />
    </HomeLayoutComponent>
  )
}
