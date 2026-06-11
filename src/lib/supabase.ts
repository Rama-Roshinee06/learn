import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not set
const mockSupabase = {
  from: () => ({
    insert: () => Promise.resolve({ error: null }),
    select: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ error: null }),
    delete: () => Promise.resolve({ error: null }),
  }),
  auth: {
    signIn: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
};

export const supabase: SupabaseClient | typeof mockSupabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : mockSupabase;
