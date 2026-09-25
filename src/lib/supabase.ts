import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Produktions-Defaults fuer BodyShift.
// Anon-Key ist per Definition public — er wird ohnehin in jedes Client-Bundle
// eingebettet und ist im Netzwerkverkehr sichtbar. RLS-Policies in Postgres
// entscheiden ueber Zugriff. Hardgecoded, damit die App auch dann laeuft,
// wenn EXPO_PUBLIC_* Vars beim OTA-Bundle fehlen.
const DEFAULT_SUPABASE_URL = 'https://gjavudejhdqicafcxvlx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqYXZ1ZGVqaGRxaWNhZmN4dmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MjQ4OTEsImV4cCI6MjEwNTUwMDg5MX0.zSyphpyxJ5RTXzfvtbCwP0EVbgAgcYyoOU0JDHPzcuc';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  (Constants.expoConfig?.extra?.supabaseUrl as string | undefined) ??
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined) ??
  DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
