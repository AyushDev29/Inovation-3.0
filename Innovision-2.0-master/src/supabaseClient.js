import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xoodmjzorcqqzmbhpbuy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvb2RtanpvcmNxcXptYmhwYnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTU2NTksImV4cCI6MjA4Mzg5MTY1OX0.TxDVV8qtzsRPIeTiwHxFEyl8H647KV7hDUqpbReXIUE';

console.log('🔧 Supabase Config:', {
    url: supabaseUrl,
    keyPrefix: supabaseKey.substring(0, 20) + '...',
    environment: import.meta.env.MODE
});

export const supabase = createClient(supabaseUrl, supabaseKey);
