import { Stack } from 'expo-router';
import { PracticeSessionProvider } from '../../../src/features/practice/context/PracticeSessionContext';

export default function PracticeLayout() {
  return (
    <PracticeSessionProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PracticeSessionProvider>
  );
}
