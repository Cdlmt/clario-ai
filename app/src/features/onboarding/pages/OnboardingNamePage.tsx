import { StyleSheet, View } from "react-native";
import Text from "../../../shared/ui/text";
import Input from "../../../shared/ui/input";
import { colors, gaps } from "../../../shared/constants/theme";
import Button from "../../../shared/ui/button";
import { useState } from "react";
import { useOnboarding } from "../hooks/useOnboarding";
import { useTranslation } from "../../locales";

export const OnboardingNamePage = () => {
  const { data, handleNameSubmit } = useOnboarding();
  const { t } = useTranslation();
  const [name, setName] = useState(data.name);

  const handleContinue = () => {
    handleNameSubmit(name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold">{t('onboarding:name:title')}</Text>
        <Input
          label={t('onboarding:name:firstName')}
          icon="user"
          placeholder={t('onboarding:name:placeholder')}
          value={name}
          onChangeText={setName}
        />
      </View>
      <Button onPress={handleContinue} disabled={!name.trim()}>
        <Text variant="body" weight="bold" color={colors.white}>{t('onboarding:name:continue')}</Text>
      </Button>
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
});
