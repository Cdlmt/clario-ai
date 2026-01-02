import { StyleSheet, View, Text as RNText } from "react-native";
import Button from "../../../shared/ui/button";
import { colors, paddings } from "../../../shared/constants/theme";
import Text from "../../../shared/ui/text";
import { useOnboarding } from "../hooks/useOnboarding";

export const OnboardingSuccessPage = () => {
  const { handleSuccess } = useOnboarding();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <RNText style={styles.title}>🎉</RNText>
        </View>
        <Text variant="h2" weight="bold">You're all set! ✅</Text>
        <Text variant="body" weight="regular">Now start your practice to more likely get hired.</Text>
      </View>
      <Button onPress={handleSuccess}>
        <Text variant="body" weight="bold" color={colors.white}>Let's goooo!</Text>
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
