import { StyleSheet, View, Text as RNText } from "react-native";
import Button from "../../../shared/ui/button";
import { colors, paddings } from "../../../shared/constants/theme";
import Text from "../../../shared/ui/text";
import { useOnboarding } from "../hooks/useOnboarding";
import { useTranslation } from "../../locales";

export const OnboardingErrorPage = () => {
  const { handleRetry, error } = useOnboarding();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <RNText style={styles.title}>🛑</RNText>
        </View>
        <Text variant="h2" weight="bold">{t('onboarding:error:title')}</Text>
        <Text variant="body" weight="regular">
          {error || 'Please try again.'}
        </Text>
      </View>
      <Button onPress={handleRetry}>
        <Text variant="body" weight="bold" color={colors.white}>{t('onboarding:error:tryAgain')}</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: paddings.vertical
  },
  content: {
    justifyContent: 'center',
    gap: 20
  },
  titleContainer: {
    paddingVertical: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 128,
    fontWeight: 'bold',
  },
});
