// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ztzxxjoewkrgjyfebgxt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0enh4am9ld2tyZ2p5ZmViZ3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNjI2MDgsImV4cCI6MjA2NTYzODYwOH0.-NcZmJJpNOw1ivZQFpcjbs5O11TPOkg7kGen2k_8cdM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);