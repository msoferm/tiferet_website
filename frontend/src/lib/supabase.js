import { createClient } from '@supabase/supabase-js';

// כתובת הפרויקט והמפתח הציבורי (anon) — מוזרקים בזמן build דרך משתני VITE_*
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // אזהרה ברורה אם שכחו להגדיר את משתני הסביבה
  console.error('חסרים VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — ראו frontend/.env');
}

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'tiferet_auth',
  },
});
