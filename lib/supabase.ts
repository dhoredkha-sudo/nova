import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as { supabaseUrl: string; supabaseKey: string };

export const supabase = createClient(extra.supabaseUrl, extra.supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Profile = {
  id: string;
  full_name: string;
  class_name: string | null;
  subject: string | null;
  role: 'student' | 'teacher' | 'admin';
  approved: boolean;
  avatar_url: string | null;
  created_at: string;
};
