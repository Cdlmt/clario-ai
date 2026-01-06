import { StyleSheet, View, ActivityIndicator } from "react-native";
import Text from "../../../shared/ui/text";
import { colors, gaps } from "../../../shared/constants/theme";
import SocialLoginButton from "../components/social.login.button";
import { useOnboarding } from "../hooks/useOnboarding";
import { useTranslation } from "../../locales";

export const OnboardingSignupPage = () => {
  const { handleSocialLogin, isLoading } = useOnboarding();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="body" weight="regular">{t('onboarding:signup:signingIn')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold">{t('onboarding:signup:title')}</Text>
        <Text variant="body" weight="regular" color={colors.black}>
          {t('onboarding:signup:subtitle')}
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
