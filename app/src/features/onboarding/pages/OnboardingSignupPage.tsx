import { StyleSheet, View } from "react-native";
import Text from "../../../shared/ui/text";
import { useRouter } from "expo-router";
import { colors, gaps } from "../../../shared/constants/theme";
import SocialLoginButton from "../components/social.login.button";

export const OnboardingSignupPage = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/(onboarding)/success");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold">{"Last, \nSave your progress! 🎯"}</Text>
        <Text variant="body" weight="regular" color={colors.black}>By creating an account, your progress will be saved day after day. You'll be more likely to get hired.</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <SocialLoginButton provider="facebook" onPress={handleContinue} />
        <SocialLoginButton provider="google" onPress={handleContinue} />
        <SocialLoginButton provider="apple" onPress={handleContinue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: gaps.default,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    gap: gaps.default,
  },
  buttonsContainer: {
    gap: gaps.inner,
  },
});
