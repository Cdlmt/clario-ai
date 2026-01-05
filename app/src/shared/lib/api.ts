import { supabase } from './supabase';

export class ApiService {
  private static async getAuthHeaders(): Promise<Record<string, string>> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('No authentication session found');
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  static async authenticatedFetch(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = await this.getAuthHeaders();

    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  }

  static async authenticatedUpload(
    url: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<Response> {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error('No authentication session found');
    }

    return fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });
  }
}
