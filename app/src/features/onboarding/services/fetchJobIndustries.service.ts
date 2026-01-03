import { API_BASE_URL } from '../../../shared/constants/api';

export interface JobIndustry {
  id: number;
  key: string;
  name: string;
  icon?: string;
  created_at: string;
}

export interface FetchJobIndustriesError {
  error: string;
}

export async function fetchJobIndustries(): Promise<JobIndustry[]> {
  const response = await fetch(`${API_BASE_URL}/onboarding/job-industries`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData: FetchJobIndustriesError = await response.json();
    throw new Error(errorData.error || 'Failed to fetch job industries');
  }

  const data: JobIndustry[] = await response.json();
  return data;
}
