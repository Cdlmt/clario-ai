import { API_BASE_URL } from '../../../shared/constants/api';
import { ApiService } from '../../../shared/lib/api';

export interface MembershipInfo {
  plan_type: 'free' | 'premium';
  status: 'active' | 'inactive';
}

export interface UsageStats {
  today_usage: number;
  daily_limit: number;
  questions_remaining: number;
}

export interface MembershipData {
  membership: MembershipInfo;
  usage: UsageStats;
}

export type MembershipError = {
  error: string;
  message: string;
  details?: {
    questions_used: number;
    questions_remaining: number;
    plan_type: string;
    upgrade_required?: boolean;
  };
};

export class MembershipService {
  static async getMembershipData(): Promise<MembershipData> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/membership`
    );

    if (!response.ok) {
      const errorData: MembershipError = await response.json();
      throw new Error(errorData.message || 'Failed to fetch membership data');
    }

    const data: MembershipData = await response.json();
    return data;
  }

  static async upgradeToPremium(
    stripeCustomerId?: string
  ): Promise<{ success: boolean; membership: MembershipInfo }> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/membership/upgrade`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stripe_customer_id: stripeCustomerId,
        }),
      }
    );

    if (!response.ok) {
      const errorData: MembershipError = await response.json();
      throw new Error(errorData.message || 'Failed to upgrade membership');
    }

    const data: { success: boolean; membership: MembershipInfo } =
      await response.json();
    return data;
  }

  static async downgradeToFree(): Promise<{
    success: boolean;
    membership: MembershipInfo;
  }> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/membership/downgrade`,
      {
        method: 'POST',
      }
    );

    if (!response.ok) {
      const errorData: MembershipError = await response.json();
      throw new Error(errorData.message || 'Failed to downgrade membership');
    }

    const data: { success: boolean; membership: MembershipInfo } =
      await response.json();
    return data;
  }

  static async syncProFromDevice(): Promise<{ success: boolean }> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/membership/sync-pro`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entitlementId: 'pro',
        }),
      }
    );

    if (!response.ok) {
      const errorData: MembershipError = await response.json();
      throw new Error(errorData.message || 'Failed to sync pro status');
    }

    const data: { success: boolean } = await response.json();
    return data;
  }

  static async syncFreeFromDevice(): Promise<{ success: boolean }> {
    const response = await ApiService.authenticatedFetch(
      `${API_BASE_URL}/membership/sync-free`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      const errorData: MembershipError = await response.json();
      throw new Error(errorData.message || 'Failed to sync free status');
    }

    const data: { success: boolean } = await response.json();
    return data;
  }
}
