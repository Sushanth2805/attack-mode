// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzhpyvtczaonbwtbaolj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6aHB5dnRjemFvbmJ3dGJhb2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDA3ODEsImV4cCI6MjA2MzMxNjc4MX0.h2fOBiEb8bsmrlVLGnWmOBVYuua6pd6Jikr2SqMwVzg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);