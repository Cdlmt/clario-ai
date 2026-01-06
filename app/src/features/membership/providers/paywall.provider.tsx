import React, { useEffect } from 'react'
import { SuperwallLoaded, SuperwallLoading, SuperwallProvider } from 'expo-superwall'
import { ActivityIndicator } from 'react-native'

export default function PaywallProvider({ children }: { children: React.ReactNode }) {
  const SUPERWALL_IOS_API_KEY = process.env.EXPO_PUBLIC_SUPERWALL_IOS_API_KEY || 'pk_5VN5_EjpI2b_yEoHKc4c1'
  const SUPERWALL_ANDROID_API_KEY = process.env.EXPO_PUBLIC_SUPERWALL_ANDROID_API_KEY || 'your_android_api_key_here'

  return (
    <SuperwallProvider
      apiKeys={{
        ios: SUPERWALL_IOS_API_KEY,
        android: SUPERWALL_ANDROID_API_KEY,
      }}
      options={{
        // Configure Superwall options here
        logging: {
          level: __DEV__ ? 'debug' : 'error',
          scopes: ['all'],
        },
      }}
    >
      <SuperwallLoading>
        <ActivityIndicator />
      </SuperwallLoading>
      <SuperwallLoaded>
        {children}
      </SuperwallLoaded>
    </SuperwallProvider>
  )
}
