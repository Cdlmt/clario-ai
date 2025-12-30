import { View, Pressable } from "react-native";
import Button from "../../../shared/ui/button";
import Text from "../../../shared/ui/text";
import { colors } from "../../../shared/constants/theme";

export const OnboardingPage = () => {
  const handleGetStarted = () => {
    // TODO: Navigate to next screen
  };

  return (
    <View>
      {/* Illustration Section */}
      <View>
        {/* TODO: Replace with actual illustration */}
        <View />
      </View>

      {/* Content Section */}
      <View>
        {/* Title */}
        <Text>Practice, Improve & Get hired 🎉</Text>

        {/* Subtitle */}
        <Text>
          Begin to train on what really matters, what companies really ask you ✅
        </Text>

        {/* CTA Button */}
        <Button onPress={handleGetStarted}>
          <Text variant="body" weight="bold" color={colors.white}>Get started!</Text>
        </Button>
      </View>
    </View>
  );
};
