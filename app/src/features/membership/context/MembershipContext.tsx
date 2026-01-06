import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  MembershipService,
  MembershipData,
  MembershipInfo,
} from '../services/membership.service';
import { useAuth } from '../../auth/context/AuthContext';

interface MembershipState {
  membership: MembershipInfo | null;
  usage: MembershipData['usage'] | null;
  isLoading: boolean;
  error: string | null;
  lastRefresh: number | null; // Timestamp of last refresh
}

interface MembershipContextType extends MembershipState {
  refreshMembership: () => Promise<void>;
  refreshMembershipIfNeeded: () => Promise<void>; // Refresh if data is stale (older than 5 minutes)
  refreshAfterSession: () => Promise<void>; // Force refresh after completing a practice session
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const useMembershipContext = () => {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembershipContext must be used within a MembershipProvider');
  }
  return context;
};

interface MembershipProviderProps {
  children: React.ReactNode;
}

export const MembershipProvider: React.FC<MembershipProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<MembershipState>({
    membership: null,
    usage: null,
    isLoading: true,
    error: null,
    lastRefresh: null,
  });

  const refreshMembership = useCallback(async () => {
    if (!isAuthenticated) {
      setState({
        membership: null,
        usage: null,
        isLoading: false,
        error: null,
        lastRefresh: null,
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const data = await MembershipService.getMembershipData();
      setState({
        membership: data.membership,
        usage: data.usage,
        isLoading: false,
        error: null,
        lastRefresh: Date.now(),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load membership data';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      console.error('Membership fetch error:', err);
    }
  }, [isAuthenticated]);

  const refreshMembershipIfNeeded = useCallback(async () => {
    const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds
    const now = Date.now();

    // Refresh if we don't have data or if it's older than 5 minutes
    if (!state.lastRefresh || (now - state.lastRefresh) > FIVE_MINUTES) {
      await refreshMembership();
    }
  }, [state.lastRefresh, refreshMembership]);

  const refreshAfterSession = useCallback(async () => {
    // Always refresh after a practice session to ensure usage is up to date
    await refreshMembership();
  }, [refreshMembership]);

  // Auto-refresh on app launch and when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshMembership();
    }
  }, [isAuthenticated, refreshMembership]);

  const value: MembershipContextType = {
    ...state,
    refreshMembership,
    refreshMembershipIfNeeded,
    refreshAfterSession,
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
};
