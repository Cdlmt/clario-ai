import React, { createContext, useContext, ReactNode } from 'react';
import {
  usePracticeSession,
  UsePracticeSessionReturn,
} from '../hooks/usePracticeSession';

const PracticeSessionContext = createContext<UsePracticeSessionReturn | null>(
  null
);

type PracticeSessionProviderProps = {
  children: ReactNode;
};

export function PracticeSessionProvider({
  children,
}: PracticeSessionProviderProps) {
  const practiceSession = usePracticeSession();

  return (
    <PracticeSessionContext.Provider value={practiceSession}>
      {children}
    </PracticeSessionContext.Provider>
  );
}

export function usePracticeSessionContext(): UsePracticeSessionReturn {
  const context = useContext(PracticeSessionContext);

  if (!context) {
    throw new Error(
      'usePracticeSessionContext must be used within PracticeSessionProvider'
    );
  }

  return context;
}

