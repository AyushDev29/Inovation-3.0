import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xoodmjzorcqqzmbhpbuy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_v155GX-hLeqR1pqHwPP7rg__VYMdPDm';

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please check your environment variables.');
}

if (!supabaseKey) {
  throw new Error('Missing Supabase Anon Key. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
