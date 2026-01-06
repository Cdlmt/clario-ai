import { usePlacement } from 'expo-superwall';
import { useCallback } from 'react';

export default function usePaywall() {
  const { registerPlacement } = usePlacement();

  const showPaywall = useCallback(async () => {
    await registerPlacement({
      placement: 'Paywall_1',
    });
  }, [registerPlacement]);

  return {
    showPaywall,
  };
}
