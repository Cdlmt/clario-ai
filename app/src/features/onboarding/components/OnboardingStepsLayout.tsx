import { StyleSheet, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import OnboardingHeader from "./onboarding.header";
import { colors, paddings } from "../../../shared/constants/theme";

const STEPS_CONFIG = {
  "/name": 1,
  "/job": 2,
  "/signup": 3,
} as const;

const TOTAL_STEPS = 3;

type OnboardingStepsLayoutProps = {
  children: React.ReactNode;
};

export const OnboardingStepsLayout = ({ children }: OnboardingStepsLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const currentStep = STEPS_CONFIG[pathname as keyof typeof STEPS_CONFIG] ?? 1;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <OnboardingHeader
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onBack={handleBack}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: paddings.horizontal,
    paddingVertical: paddings.vertical,
  },
});

