import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../src/features/auth";
import PaywallProvider from "../src/features/membership/providers/paywall.provider";

export default function RootLayout() {
  return (
    <PaywallProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <RootStack />
        </SafeAreaProvider>
      </AuthProvider>
    </PaywallProvider>
  );
}

function RootStack() {
  const { isAuthenticated, isLoading, isOnboarded } = useAuth();

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated || !isOnboarded}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated && isOnboarded}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  )
}
