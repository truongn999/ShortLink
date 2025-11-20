import { createClient } from '@supabase/supabase-js';

// Fallback credentials (from your provided configuration)
const FALLBACK_URL = 'https://vvoqolsipbgjtytzjoah.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b3FvbHNpcGJnanR5dHpqb2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODc0MDMsImV4cCI6MjA3ODk2MzQwM30.jCDTbdmg3q2LZjdrt88gEcnLvgF2-819o05i9H78Kos';

// Access environment variables with fallback
// Note: Depending on your build tool (Vite, CRA, Next.js), the way to access env vars changes.
// We use the fallback here to ensure it works immediately.
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials are required. Please check your configuration.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);