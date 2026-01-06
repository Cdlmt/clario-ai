import { useCallback } from 'react';
import {
  MembershipService,
  MembershipData,
  MembershipInfo,
  MembershipError,
} from '../services/membership.service';
import { useUser } from 'expo-superwall';
import usePaywall from './usePaywall';
import { useMembershipContext } from '../context/MembershipContext';

/**
 * Hook for managing user membership and usage limits
 *
 * Usage example:
 * ```tsx
 * const { handleApiError } = useMembership();
 *
 * try {
 *   await transcribeAudio(audioUri);
 * } catch (error) {
 *   if (await handleApiError(error)) {
 *     // Paywall was shown, error is handled
 *     return;
 *   }
 *   // Handle other errors normally
 * }
 * ```
 */

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
  const { subscriptionStatus, setSubscriptionStatus } = useUser();
  const { showPaywall } = usePaywall();

  // Use context refresh functions
  const refreshMembership = useCallback(async () => {
    await contextRefresh();
  }, [contextRefresh]);

  const refreshMembershipIfNeeded = useCallback(async () => {
    await contextRefreshIfNeeded();
  }, [contextRefreshIfNeeded]);

  const canPerformAction = useCallback(
    async (action: 'transcribe' | 'analyze'): Promise<boolean> => {
      // First check Superwall subscription status and if the user has the pro entitlement
      if (
        subscriptionStatus.status === 'ACTIVE' &&
        subscriptionStatus.entitlements.some((entitlement) =>
          entitlement.id.includes('pro')
        )
      ) {
        return true;
      }

      // If free user, check backend usage limits
      if (usage) {
        return usage.questions_remaining > 0;
      }

      // If we don't have usage data, assume they can try (backend will check)
      return true;
    },
    [usage]
  );

  const showUpgradePrompt = useCallback(async () => {
    await showPaywall();
  }, []);

  const upgradeToPremium = useCallback(
    async (customerId?: string) => {
      try {
        await MembershipService.upgradeToPremium(customerId);
        await setSubscriptionStatus({
          status: 'ACTIVE',
          entitlements: [{ id: 'pro', type: 'SERVICE_LEVEL' }],
        });
        await refreshMembership(); // Refresh global state
      } catch (err) {
        throw err;
      }
    },
    [refreshMembership]
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
    handleApiError,
  };
};
