import { API_BASE_URL } from '../../../shared/constants/api';
import { ApiService } from '../../../shared/lib/api';

export const deleteAccount = async (): Promise<void> => {
  const response = await ApiService.authenticatedFetch(
    `${API_BASE_URL}/account`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete account');
  }
};
