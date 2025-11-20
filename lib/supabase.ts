import { createClient } from '@supabase/supabase-js';

// lấy biến môi trường từ Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// fallback nếu không tồn tại env
const FALLBACK_URL = 'https://vvoqolsipbgjtytzjoah.supabase.co';
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b3FvbHNpcGJnanR5dHpqb2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODc0MDMsImV4cCI6MjA3ODk2MzQwM30.jCDTbdmg3q2LZjdrt88gEcnLvgF2-819o05i9H78Kos';

export const supabase = createClient(
  supabaseUrl || FALLBACK_URL,
  supabaseAnonKey || FALLBACK_KEY
);
