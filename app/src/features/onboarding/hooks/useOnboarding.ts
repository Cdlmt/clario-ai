import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useOnboardingContext } from '../context/OnboardingContext';
import { signInWithProvider, SocialProvider } from '../services/auth.service';
import { completeOnboarding } from '../services/completeOnboarding.service';
import { useAuth } from '../../auth/context/AuthContext';
import { JobCategory } from '../models/job';

type OnboardingState = {
  isLoading: boolean;
  error: string | null;
};

export const useOnboarding = () => {
  const router = useRouter();
  const { data, setName, setJob, reset } = useOnboardingContext();
  const { user, refreshSession, setOnboarded } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    isLoading: false,
    error: null,
  });

  const goToNameStep = useCallback(() => {
    router.push('(steps)/name');
  }, [router]);

  const handleNameSubmit = useCallback(
    (name: string) => {
      if (!name.trim()) {
        setState((prev) => ({ ...prev, error: 'Name is required' }));
        return;
      }

      setName(name.trim());
      router.push('(steps)/job');
    },
    [router, setName]
  );

  const handleJobSubmit = useCallback(
    (job: JobCategory) => {
      setJob(job);
      router.push('(steps)/signup');
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

        router.replace('/success');
      } catch (error) {
        setState({
          isLoading: false,
          error:
            error instanceof Error ? error.message : 'Authentication failed',
        });
        router.replace('error');
      }
    },
    [router]
  );

  const handleSuccess = useCallback(async () => {
    if (!user?.id) {
      setState({
        isLoading: false,
        error: 'User not authenticated',
      });
      return;
    }

    setState({ isLoading: true, error: null });

    try {
      // Send onboarding data to API
      await completeOnboarding({
        name: data.name,
        jobKey: data.job?.key || '',
        userId: user.id,
      });

      // Reset context
      reset();

      // Refresh auth session to ensure user is properly authenticated
      await refreshSession();

      setOnboarded(true);
    } catch (error) {
      setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to complete onboarding',
      });
    }
  }, [router, reset, data.name, data.job, user?.id]);

  const handleRetry = useCallback(() => {
    setState({ isLoading: false, error: null });
    router.replace('(steps)/signup');
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
