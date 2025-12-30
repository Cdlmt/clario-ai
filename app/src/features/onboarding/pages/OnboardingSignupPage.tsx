import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "../../../shared/ui/text";
import { colors } from "../../../shared/constants/theme";
import { useRouter } from "expo-router";

export const OnboardingSignupPage = () => {
  const router = useRouter();

  const handleSocialLogin = (provider: "facebook" | "google" | "apple") => {
    // TODO: Implement social login
    router.push("/(onboarding)/success");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h2" weight="bold">Last,</Text>
          <Text variant="h2" weight="bold">Save your progress! 🎯</Text>
        </View>

        <Text variant="body" weight="regular" color={colors.black}>
          By creating an account, your progress will be saved day after day. You'll be more likely to get hired.
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.socialButton, styles.facebookButton]}
          onPress={() => handleSocialLogin("facebook")}
        >
          <Text variant="body" weight="bold" color={colors.white}>
            Continue with Facebook
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => handleSocialLogin("google")}
        >
          <Text variant="body" weight="bold" color={colors.black}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.appleButton]}
          onPress={() => handleSocialLogin("apple")}
        >
          <Text variant="body" weight="bold" color={colors.white}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  content: {
    gap: 16,
  },
  header: {
    gap: 0,
  },
  buttonsContainer: {
    gap: 12,
  },
  socialButton: {
    width: "100%",
    height: 48,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  facebookButton: {
    backgroundColor: "#1877F2",
  },
  googleButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  appleButton: {
    backgroundColor: colors.black,
  },
});

