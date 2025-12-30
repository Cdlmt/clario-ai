import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Text from '../../../shared/ui/text';
import { colors, paddings } from '../../../shared/constants/theme';
import { RadixIcon } from 'radix-ui-react-native-icons';

type OnboardingHeaderProps = {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
};

export default function OnboardingHeader({
  currentStep,
  totalSteps,
  onBack,
}: OnboardingHeaderProps) {
  const progress = currentStep / totalSteps;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        disabled={!onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <RadixIcon name="chevron-left" size={20} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <Text variant="body" weight="regular" color={colors.black} style={styles.stepIndicator}>
        {currentStep}/{totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: paddings.horizontal,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 20,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primary,
    transform: [{ rotate: '45deg' }],
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: colors.mediumGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    minWidth: 24,
    textAlign: 'right',
  },
});
