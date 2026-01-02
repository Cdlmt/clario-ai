import { StyleSheet, View } from "react-native";
import Text from "../../../shared/ui/text";
import { colors, gaps } from "../../../shared/constants/theme";
import Button from "../../../shared/ui/button";
import { JOB_CATEGORIES, JobCategory } from "../models/job";
import OnboardingJobSelector from "../components/onboarding.job.selector";
import { useState } from "react";
import { useOnboarding } from "../hooks/useOnboarding";

export const OnboardingJobPage = () => {
  const { data, handleJobSubmit } = useOnboarding();
  const [selectedJob, setSelectedJob] = useState<JobCategory | undefined>(data.job ?? undefined);

  const handleContinue = () => {
    if (!selectedJob) {
      return;
    }

    handleJobSubmit(selectedJob);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" weight="bold">{"Second, \nWhat's your job ?"}</Text>
        <View style={styles.jobSelectorsContainer}>
          {JOB_CATEGORIES.map((job) => (
            <OnboardingJobSelector key={job.id} job={job} selected={selectedJob === job} onClick={setSelectedJob} />
          ))}
        </View>
      </View>
      <Button onPress={handleContinue} disabled={!selectedJob}>
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
  jobSelectorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gaps.inner,
    alignItems: 'center',
  }
});
