import { Stack } from "expo-router";
import { OnboardingProvider } from "../../src/features/onboarding/context/OnboardingContext";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(steps)" />
        <Stack.Screen name="success" />
        <Stack.Screen name="error" />
      </Stack>
    </OnboardingProvider>
  );
}

