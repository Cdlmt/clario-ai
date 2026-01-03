import { useState, useEffect } from 'react';
import { fetchJobIndustries, JobIndustry } from '../services/fetchJobIndustries.service';

type UseJobIndustriesReturn = {
  industries: JobIndustry[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useJobIndustries(): UseJobIndustriesReturn {
  const [industries, setIndustries] = useState<JobIndustry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIndustries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchJobIndustries();
      setIndustries(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load industries';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIndustries();
  }, []);

  return {
    industries,
    isLoading,
    error,
    refetch: loadIndustries,
  };
}
