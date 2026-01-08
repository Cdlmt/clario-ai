import { createClient } from '@supabase/supabase-js';
import { config } from './config';

const SUPABASE_URL = config.supabase.url;
const SUPABASE_SERVICE_ROLE_KEY = config.supabase.serviceRoleKey;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
