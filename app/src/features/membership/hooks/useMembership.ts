import { useCallback, useEffect, useRef } from 'react';
import {
  MembershipService,
  MembershipData,
  MembershipInfo,
  MembershipError,
} from '../services/membership.service';
import { useUser } from 'expo-superwall';
import usePaywall from './usePaywall';
import { useMembershipContext } from '../context/MembershipContext';

export interface UseMembershipReturn {
  membership: MembershipInfo | null;
  usage: MembershipData['usage'] | null;
  isLoading: boolean;
  error: string | null;
  refreshMembership: () => Promise<void>;
  refreshMembershipIfNeeded: () => Promise<void>;
  canPerformAction: (action: 'transcribe' | 'analyze') => Promise<boolean>;
  showUpgradePrompt: () => Promise<void>;
  upgradeToPremium: (customerId?: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  handleApiError: (error: any) => Promise<boolean>; // Returns true if error was handled (usage limit)
}

export const useMembership = (): UseMembershipReturn => {
  const {
    membership,
    usage,
    isLoading,
    error,
    refreshMembership: contextRefresh,
    refreshMembershipIfNeeded: contextRefreshIfNeeded,
  } = useMembershipContext();
  const { subscriptionStatus } = useUser();
  const { showPaywall } = usePaywall();

  // Use context refresh functions
  const refreshMembership = useCallback(async () => {
    await contextRefresh();
  }, [contextRefresh]);

  const refreshMembershipIfNeeded = useCallback(async () => {
    await contextRefreshIfNeeded();
  }, [contextRefreshIfNeeded]);

  // Helper to determine if user has pro status
  const isPro =
    subscriptionStatus.status === 'ACTIVE' &&
    subscriptionStatus.entitlements.some((e) => e.id === 'pro');

  // Track previous pro status to detect upgrades
  const prevIsProRef = useRef(isPro);

  async function syncMembershipStatus() {
    const wasPro = prevIsProRef.current;
    const nowPro = isPro;

    // Only sync when transitioning to pro (avoid repeated calls)
    if (!wasPro && nowPro) {
      await MembershipService.syncProFromDevice();
      refreshMembership();
    }

    // Sync when user loses pro status (subscription cancelled/expired)
    if (wasPro && !nowPro) {
      await MembershipService.syncFreeFromDevice();
      refreshMembership();
    }

    prevIsProRef.current = nowPro;
  }

  // Sync membership status changes to backend
  useEffect(() => {
    syncMembershipStatus();
  }, [isPro, syncMembershipStatus]);

  const canPerformAction = useCallback(
    async (action: 'transcribe' | 'analyze'): Promise<boolean> => {
      // Check if user has strict pro entitlement match
      if (isPro) {
        return true;
      }

      // If free user, check backend usage limits
      if (usage) {
        return usage.questions_remaining > 0;
      }

      // If we don't have usage data, assume they can try (backend will check)
      return true;
    },
    [isPro, usage]
  );

  const showUpgradePrompt = useCallback(async () => {
    await showPaywall();
  }, []);

  const restorePurchases = useCallback(async () => {
    try {
      await refreshMembership();
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }, [refreshMembership]);

  const upgradeToPremium = useCallback(
    async (customerId?: string) => {
      // Only trigger the paywall flow - subscription status will be updated by Superwall
      await showPaywall();
    },
    [showPaywall]
  );

  // Handle usage limit exceeded errors from API calls
  const handleUsageLimitExceeded = useCallback(
    async (error: MembershipError) => {
      if (
        error.error === 'USAGE_LIMIT_EXCEEDED' &&
        error.details?.upgrade_required
      ) {
        await showUpgradePrompt();
        return true; // Error was handled
      }
      return false; // Error was not handled
    },
    [showUpgradePrompt]
  );

  // Handle API errors and show paywall if needed
  const handleApiError = useCallback(
    async (error: any): Promise<boolean> => {
      if (
        error?.details?.upgrade_required ||
        error?.error === 'USAGE_LIMIT_EXCEEDED'
      ) {
        await handleUsageLimitExceeded(error);
        return true; // Error was handled by showing paywall
      }
      return false; // Error was not a usage limit error
    },
    [handleUsageLimitExceeded]
  );

  return {
    membership,
    usage,
    isLoading,
    error,
    refreshMembership,
    refreshMembershipIfNeeded,
    canPerformAction,
    showUpgradePrompt,
    upgradeToPremium,
    restorePurchases,
    handleApiError,
  };
};
