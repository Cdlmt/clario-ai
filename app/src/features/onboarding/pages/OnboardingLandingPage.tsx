import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Button from "../../../shared/ui/button";
import Text from "../../../shared/ui/text";
import { colors, paddings } from "../../../shared/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const OnboardingLandingPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    router.push("/(onboarding)/(steps)/name");
  };

  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        {/* TODO: Replace with actual illustration */}
        <View />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + paddings.vertical }]}>
        <Text variant="h2" weight="bold" style={styles.title}>{`Practice, Improve & \nGet hired 🎉`}</Text>

        <Text variant="body" weight="regular" style={styles.subtitle}>
          Begin to train on what really matters, what companies really ask you ✅
        </Text>

        <Button onPress={handleGetStarted}>
          <Text variant="body" weight="bold" color={colors.white}>Get started!</Text>
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