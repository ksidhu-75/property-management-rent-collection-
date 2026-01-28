import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://aqldnacaghkkupkvljrr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_mbsJE3wmswAeqK982GPXow_Vu-ZhnXI'; // Using publishable key for now, will enable RLS later

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);