import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vvoqolsipbgjtytzjoah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2b3FvbHNpcGJnanR5dHpqb2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzODc0MDMsImV4cCI6MjA3ODk2MzQwM30.jCDTbdmg3q2LZjdrt88gEcnLvgF2-819o05i9H78Kos';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
