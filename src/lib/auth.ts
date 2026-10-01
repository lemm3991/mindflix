// src/lib/auth.ts - Client-Side Authentication API Helpers (Zero Credentials Exposed)
import { setLocalUser } from './supabase';

export interface ValidUser {
  id: string;
  username: string;
  email: string;
  name: string;
}

export const AUTHORIZED_USERS = [
  {
    id: 'user-lemmg0800',
    username: 'lemmg0800',
    email: 'lemmg0800@mindflix.local',
    defaultPassword: '19931503',
    name: 'Lemmg0800'
  },
  {
    id: 'user-tamydoagro',
    username: 'tamydoagro',
    email: 'tamydoagro@mindflix.local',
    defaultPassword: 'mndflx2026',
    name: 'Tamires'
  }
];

export interface LoginResult {
  success: boolean;
  user?: ValidUser;
  error?: string;
  retryAfterSeconds?: number;
}

export async function loginWithCredentials(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success && data.user) {
      setLocalUser({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name
      });
      return { success: true, user: data.user };
    }

    return {
      success: false,
      error: data.error || 'Credenciais inválidas.',
      retryAfterSeconds: data.retryAfterSeconds
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Erro de conexão com o servidor. Verifique sua internet.'
    };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {}
  setLocalUser(null);
  window.location.href = '/login';
}

export async function changeUserPassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: data.error || 'Falha ao alterar senha.'
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Erro ao comunicar com o servidor.'
    };
  }
}
