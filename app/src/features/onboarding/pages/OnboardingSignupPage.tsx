import { StyleSheet, View, ActivityIndicator } from "react-native";
import Text from "../../../shared/ui/text";
import { colors, gaps } from "../../../shared/constants/theme";
import SocialLoginButton from "../components/social.login.button";
import { useOnboarding } from "../hooks/useOnboarding";

export const OnboardingSignupPage = () => {
  const { handleSocialLogin, isLoading } = useOnboarding();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="body" weight="regular">Signing you in...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold">{"Last, \nSave your progress! 🎯"}</Text>
        <Text variant="body" weight="regular" color={colors.black}>
          By creating an account, your progress will be saved day after day. You'll be more likely to get hired.
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <SocialLoginButton provider="facebook" onPress={() => handleSocialLogin('facebook')} />
        <SocialLoginButton provider="google" onPress={() => handleSocialLogin('google')} />
        <SocialLoginButton provider="apple" onPress={() => handleSocialLogin('apple')} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: gaps.default,
  },
});
