import { Slot } from "expo-router";
import { OnboardingStepsLayout } from "../../../src/features/onboarding/components/onboarding.steps.layout";

export default function StepsLayout() {
  return (
    <OnboardingStepsLayout>
      <Slot />
    </OnboardingStepsLayout>
  );
}

