import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gzvuvbmhlmpvitffgqlq.supabase.co';

// Prefer the new publishable key (sb_publishable_...) when set — it's Supabase's
// current client-side key format. Falls back to the legacy anon JWT key, which
// still works identically for anon-role requests.
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6dnV2Ym1obG1wdml0ZmZncWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MTA5NDUsImV4cCI6MjEwMzQ4Njk0NX0.hxKLpHQOmjTbczj30rukaL07_XQya02pzLXAbsWqH9s';

export const supabase = createClient(supabaseUrl, supabaseKey);
