import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

// Client-side authentication helpers with graceful fallback for local development
export function getLocalUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('mindflix_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export function setLocalUser(user: AuthUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('mindflix_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('mindflix_user');
  }
}
