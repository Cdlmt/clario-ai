import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { JobCategory } from '../models/job'
import Text from '../../../shared/ui/text'
import { colors } from '../../../shared/constants/theme';
import { RadixIcon } from 'radix-ui-react-native-icons';

type OnboardingJobSelectorProps = {
  job: JobCategory;
  selected: boolean;
  onClick: (job: JobCategory) => void;
}

export default function OnboardingJobSelector(props: OnboardingJobSelectorProps) {
  const { job, selected, onClick } = props;

  return (
    <TouchableOpacity style={[styles.container, selected && { borderColor: colors.secondary }]} onPress={() => onClick(job)}>
      <Text variant="body" weight="bold" color={colors.black}>{job.emoji} {job.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 2,
    backgroundColor: colors.lightGray,
    borderColor: 'transparent',
  },
})