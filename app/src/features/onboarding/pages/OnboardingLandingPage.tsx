import { View, StyleSheet } from "react-native";
import Button from "../../../shared/ui/button";
import Text from "../../../shared/ui/text";
import { colors, paddings } from "../../../shared/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOnboarding } from "../hooks/useOnboarding";
import { useTranslation } from "../../locales";

export const OnboardingLandingPage = () => {
  const insets = useSafeAreaInsets();
  const { goToNameStep } = useOnboarding();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        {/* TODO: Replace with actual illustration */}
        <View />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + paddings.vertical }]}>
        <Text variant="h2" weight="bold" style={styles.title}>{t('onboarding:landing:title')}</Text>

        <Text variant="body" weight="regular" style={styles.subtitle}>
          {t('onboarding:landing:subtitle')}
        </Text>

        <Button onPress={goToNameStep}>
          <Text variant="body" weight="bold" color={colors.white}>{t('onboarding:landing:getStarted')}</Text>
        </Button>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  illustration: {
    width: '100%',
    height: '70%',
    backgroundColor: colors.lightGray,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: '40%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: paddings.horizontal,
    paddingVertical: 35,
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
});
