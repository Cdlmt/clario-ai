import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { JobCategory } from '../models/job';

type OnboardingData = {
  name: string;
  job: JobCategory | null;
};

type OnboardingContextType = {
  data: OnboardingData;
  setName: (name: string) => void;
  setJob: (job: JobCategory) => void;
  reset: () => void;
};

const initialData: OnboardingData = {
  name: '',
  job: null,
};

const OnboardingContext = createContext<OnboardingContextType | null>(null);

type OnboardingProviderProps = {
  children: ReactNode;
};

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [data, setData] = useState<OnboardingData>(initialData);

  const setName = useCallback((name: string) => {
    setData((prev) => ({ ...prev, name }));
  }, []);

  const setJob = useCallback((job: JobCategory) => {
    setData((prev) => ({ ...prev, job }));
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
  }, []);

  return (
    <OnboardingContext.Provider value={{ data, setName, setJob, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
};

