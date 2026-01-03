import { API_BASE_URL } from '../../../shared/constants/api';
import { JobCategory } from '../models/job';

export interface CompleteOnboardingRequest {
  name: string;
  jobKey: string;
  userId: string;
}

export interface CompleteOnboardingResponse {
  success: boolean;
  userId: string;
  message: string;
}

export const completeOnboarding = async (
  data: CompleteOnboardingRequest
): Promise<CompleteOnboardingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/onboarding/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result: CompleteOnboardingResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Complete onboarding error:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to complete onboarding');
  }
};
