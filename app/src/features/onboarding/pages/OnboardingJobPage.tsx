import { ActivityIndicator, StyleSheet, View } from "react-native";
import Text from "../../../shared/ui/text";
import { colors, gaps, feedbackColors } from "../../../shared/constants/theme";
import Button from "../../../shared/ui/button";
import { JobCategory } from "../models/job";
import OnboardingJobSelector from "../components/onboarding.job.selector";
import { useState } from "react";
import { useOnboarding } from "../hooks/useOnboarding";
import { useJobIndustries } from "../hooks/useJobIndustries";
import { useTranslation } from "../../locales";

export const OnboardingJobPage = () => {
  const { data, handleJobSubmit } = useOnboarding();
  const { industries, isLoading, error } = useJobIndustries();
  const { t } = useTranslation();
  const [selectedJob, setSelectedJob] = useState<JobCategory | undefined>(data.job ?? undefined);

  const handleContinue = () => {
    if (!selectedJob) {
      return;
    }

    handleJobSubmit(selectedJob);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="h2" weight="bold">{t('onboarding:job:title')}</Text>
          <ActivityIndicator size="large" color={colors.black} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="h2" weight="bold">{t('onboarding:job:title')}</Text>
          <Text variant="body" color={feedbackColors.bad}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold">{t('onboarding:job:title')}</Text>
        <View style={styles.jobSelectorsContainer}>
          {industries.map((job) => (
            <OnboardingJobSelector key={job.id} job={job} selected={selectedJob === job} onClick={setSelectedJob} />
          ))}
        </View>
      </View>
      <Button onPress={handleContinue} disabled={!selectedJob}>
        <Text variant="body" weight="bold" color={colors.white}>{t('onboarding:job:continue')}</Text>
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
  jobSelectorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gaps.inner,
    alignItems: 'center',
  }
});
