import { createClient } from '@supabase/supabase-js';

// Get environment variables from Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback if env vars are missing (for development/preview)
const FALLBACK_URL = 'https://vvoqolsipbgjtytzjoah.supabase.co';
const FALLBACK_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b3FvbHNpcGJnanR5dHpqb2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODc0MDMsImV4cCI6MjA3ODk2MzQwM30.jCDTbdmg3q2LZjdrt88gEcnLvgF2-819o05i9H78Kos';

export const supabase = createClient(
    supabaseUrl || FALLBACK_URL,
    supabaseAnonKey || FALLBACK_KEY
);
