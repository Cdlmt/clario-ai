import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../src/features/auth";
import PaywallProvider from "../src/features/membership/providers/paywall.provider";
import { MembershipProvider } from "../src/features/membership/context/MembershipContext";
import { LanguageProvider } from "../src/features/locales/components/languageProvider";
import "../src/features/locales/services/i18n";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <PaywallProvider>
        <AuthProvider>
          <MembershipProvider>
            <SafeAreaProvider>
              <StatusBar style="auto" />
              <RootStack />
            </SafeAreaProvider>
          </MembershipProvider>
        </AuthProvider>
      </PaywallProvider>
    </LanguageProvider>
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
