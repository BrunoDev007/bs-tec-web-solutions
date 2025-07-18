// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nucqjivescevldpunbii.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Y3FqaXZlc2NldmxkcHVuYmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODM4OTksImV4cCI6MjA2NzY1OTg5OX0.j1Pv2wTQWofIHpEpsjkQJV3w1oX2iPp0AmQPMrwaWNo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});