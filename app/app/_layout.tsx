import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../src/features/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootStack />
      </SafeAreaProvider>
    </AuthProvider>
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
