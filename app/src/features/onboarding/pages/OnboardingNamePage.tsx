import { StyleSheet, View } from "react-native";
import Text from "../../../shared/ui/text";
import { useRouter } from "expo-router";
import Input from "../../../shared/ui/input";
import { colors, gaps } from "../../../shared/constants/theme";
import Button from "../../../shared/ui/button";

export const OnboardingNamePage = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/(onboarding)/(steps)/job");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold">{"First, \nWhat's your name ?"}</Text>
        <Input label="First name" icon="avatar" placeholder="John" />
      </View>
      <Button onPress={handleContinue}>
        <Text variant="body" weight="bold" color={colors.white}>Continue</Text>
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
