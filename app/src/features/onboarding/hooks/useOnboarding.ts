import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useOnboardingContext } from '../context/OnboardingContext';
import { signInWithProvider, SocialProvider } from '../services/auth.service';
import { JobCategory } from '../models/job';

type OnboardingState = {
  isLoading: boolean;
  error: string | null;
};

export const useOnboarding = () => {
  const router = useRouter();
  const { data, setName, setJob, reset } = useOnboardingContext();
  const [state, setState] = useState<OnboardingState>({
    isLoading: false,
    error: null,
  });

  const goToNameStep = useCallback(() => {
    router.push('/(onboarding)/(steps)/name');
  }, [router]);

  const handleNameSubmit = useCallback(
    (name: string) => {
      if (!name.trim()) {
        setState((prev) => ({ ...prev, error: 'Name is required' }));
        return;
      }

      setName(name.trim());
      router.push('/(onboarding)/(steps)/job');
    },
    [router, setName]
  );

  const handleJobSubmit = useCallback(
    (job: JobCategory) => {
      setJob(job);
      router.push('/(onboarding)/(steps)/signup');
    },
    [router, setJob]
  );

  const handleSocialLogin = useCallback(
    async (provider: SocialProvider) => {
      setState({ isLoading: true, error: null });

      try {
        const result = await signInWithProvider(provider);

        if (result === null) {
          setState({ isLoading: false, error: null });
          return;
        }

        router.replace('/(onboarding)/success');
      } catch (error) {
        setState({
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'Authentication failed',
        });
        router.replace('/(onboarding)/error');
      }
    },
    [router]
  );

  const handleSuccess = useCallback(() => {
    reset();
    router.replace('/practice');
  }, [router, reset]);

  const handleRetry = useCallback(() => {
    setState({ isLoading: false, error: null });
    router.replace('/(onboarding)/(steps)/signup');
  }, [router]);

  return {
    data,
    isLoading: state.isLoading,
    error: state.error,
    goToNameStep,
    handleNameSubmit,
    handleJobSubmit,
    handleSocialLogin,
    handleSuccess,
    handleRetry,
  };
};
