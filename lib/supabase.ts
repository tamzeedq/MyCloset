import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface Outfit {
  id: string;
  user_id: string;
  image_url: string;
  title: string;
  weather: string;
  temperature: string;
  feeling: string;
  season: string;
  tags: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}
