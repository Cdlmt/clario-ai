import { Slot } from "expo-router";
import { OnboardingStepsLayout } from "../../../src/features/onboarding/components/OnboardingStepsLayout";

export default function StepsLayout() {
  return (
    <OnboardingStepsLayout>
      <Slot />
    </OnboardingStepsLayout>
  );
}

