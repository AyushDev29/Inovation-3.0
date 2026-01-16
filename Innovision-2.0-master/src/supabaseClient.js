import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xoodmjzorcqqzmbhpbuy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvb2RtanpvcmNxcXptYmhwYnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMTU2NTksImV4cCI6MjA4Mzg5MTY1OX0.TxDVV8qtzsRPIeTiwHxFEyl8H647KV7hDUqpbReXIUE';

export const supabase = createClient(supabaseUrl, supabaseKey);
