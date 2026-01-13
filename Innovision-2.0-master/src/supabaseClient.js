import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xoodmjzorcqqzmbhpbuy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_v155GX-hLeqR1pqHwPP7rg__VYMdPDm';

// Debug logging (remove in production)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

// Validate required values
if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error('VITE_SUPABASE_URL is missing or undefined');
  throw new Error('Missing Supabase URL. Please check your environment variables.');
}

if (!supabaseKey || supabaseKey === 'undefined') {
  console.error('VITE_SUPABASE_ANON_KEY is missing or undefined');
  throw new Error('Missing Supabase Anon Key. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
