import mediaServerData from '../data/media_server_url.json';

export type MediaSourceMode = 'server';

export interface MediaProviderConfig {
  mode: 'server';
  serverUrl: string;
}

const STORAGE_KEYS = {
  MODE: 'mindflix_media_mode',
  SERVER_URL: 'mindflix_media_server_url'
};

const savedJsonUrl = (mediaServerData && (mediaServerData as any).url) ? String((mediaServerData as any).url).trim() : '';
export const DEFAULT_MEDIA_SERVER_URL = savedJsonUrl || 'https://jennifer-brandon-legislature-analytical.trycloudflare.com';

export function getMediaMode(): MediaSourceMode {
  return 'server';
}

export function setMediaMode(_mode?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MODE, 'server');
    window.dispatchEvent(new CustomEvent('mindflix:media-mode-changed', { detail: { mode: 'server' } }));
  } catch (e) {
    console.warn('Failed setting media mode', e);
  }
}

import { supabase, isSupabaseConfigured } from './supabase';

const SUPABASE_REST_URL = 'https://lpzrpbmikwbqknfbilvl.supabase.co/rest/v1/user_preferences?user_id=eq.global_media_server&select=gemini_api_key,updated_at';
const SUPABASE_API_KEY = 'sb_publishable_ZdHnC_q8whq1xEBHRlhImg_Pu0xLRmw';
const API_SECRET = 'mindflix-secure-production-secret-salt-2026-v1';

export function getMediaServerUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_MEDIA_SERVER_URL;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SERVER_URL);
    if (!val || !val.trim() || val.includes('par-movie') || val.includes('everyone-prototype') || val.includes('bin-practice-brighton') || val.includes('semester-lover-legs')) {
      localStorage.setItem(STORAGE_KEYS.SERVER_URL, DEFAULT_MEDIA_SERVER_URL);
      return DEFAULT_MEDIA_SERVER_URL;
    }
    return val.trim().replace(/\/+$/, '');
  } catch {
    return DEFAULT_MEDIA_SERVER_URL;
  }
}

// Para SSR e carregamento no servidor Astro
export async function getPersistedMediaServerUrl(): Promise<string> {
  try {
    const res = await fetch(SUPABASE_REST_URL, {
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows[0]?.gemini_api_key) {
        return rows[0].gemini_api_key.trim().replace(/\/+$/, '');
      }
    }
  } catch {}
  return DEFAULT_MEDIA_SERVER_URL;
}

export async function setMediaServerUrl(url: string, syncCloud = true): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const clean = url.trim().replace(/\/+$/, '');
    localStorage.setItem(STORAGE_KEYS.SERVER_URL, clean || DEFAULT_MEDIA_SERVER_URL);
    // Invalidate cached health status
    healthCache = null;
    window.dispatchEvent(new CustomEvent('mindflix:media-server-url-changed', { detail: { serverUrl: clean || DEFAULT_MEDIA_SERVER_URL } }));

    if (syncCloud && clean) {
      const now = new Date().toISOString();

      // 1. Persistência direta no Supabase (disponível instantaneamente para todos os dispositivos)
      const saveSupabase = async () => {
        try {
          if (isSupabaseConfigured && supabase) {
            await supabase.from('user_preferences').upsert({
              user_id: 'global_media_server',
              gemini_api_key: clean,
              theme_id: 'server_url',
              updated_at: now
            });
            return;
          }
        } catch {}

        try {
          await fetch('https://lpzrpbmikwbqknfbilvl.supabase.co/rest/v1/user_preferences', {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_API_KEY,
              'Authorization': `Bearer ${SUPABASE_API_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify({
              user_id: 'global_media_server',
              gemini_api_key: clean,
              theme_id: 'server_url',
              updated_at: now
            })
          });
        } catch (e) {
          console.warn('Dual-sync Supabase REST error:', e);
        }
      };

      // 2. Persistência no endpoint Hub API
      const saveHubApi = async () => {
        try {
          await fetch('/api/media-server-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': API_SECRET
            },
            body: JSON.stringify({
              url: clean,
              apiKey: API_SECRET,
              username: 'lemmg0800',
              password: '19931503'
            })
          });
        } catch (e) {
          console.debug('Sync cloud URL error:', e);
        }
      };

      await Promise.allSettled([saveSupabase(), saveHubApi()]);
    }
  } catch (e) {
    console.warn('Failed setting media server URL', e);
  }
}

// Sincroniza a URL do servidor com o Supabase e API na nuvem
export async function syncMediaServerUrlWithCloud(): Promise<string> {
  if (typeof window === 'undefined') return DEFAULT_MEDIA_SERVER_URL;
  try {
    // 1. Tenta Supabase (banco global compartilhado por todos os dispositivos)
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('gemini_api_key, updated_at')
          .eq('user_id', 'global_media_server')
          .maybeSingle();

        if (!error && data?.gemini_api_key) {
          const clean = data.gemini_api_key.trim().replace(/\/+$/, '');
          const current = localStorage.getItem(STORAGE_KEYS.SERVER_URL);
          if (clean && clean !== current) {
            localStorage.setItem(STORAGE_KEYS.SERVER_URL, clean);
            healthCache = null;
            window.dispatchEvent(new CustomEvent('mindflix:media-server-url-changed', { detail: { serverUrl: clean } }));
          }
          return clean;
        }
      } catch (sbErr) {
        console.debug('Supabase SDK sync fallback:', sbErr);
      }
    }

    // 2. Fallback REST para Supabase
    try {
      const restRes = await fetch(SUPABASE_REST_URL, {
        headers: {
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`
        },
        cache: 'no-store'
      });
      if (restRes.ok) {
        const rows = await restRes.json();
        if (Array.isArray(rows) && rows[0]?.gemini_api_key) {
          const clean = rows[0].gemini_api_key.trim().replace(/\/+$/, '');
          const current = localStorage.getItem(STORAGE_KEYS.SERVER_URL);
          if (clean && clean !== current) {
            localStorage.setItem(STORAGE_KEYS.SERVER_URL, clean);
            healthCache = null;
            window.dispatchEvent(new CustomEvent('mindflix:media-server-url-changed', { detail: { serverUrl: clean } }));
          }
          return clean;
        }
      }
    } catch {}

    // 3. Fallback para API do Hub
    const res = await fetch('/api/media-server-url', {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.url && typeof data.url === 'string') {
        const clean = data.url.trim().replace(/\/+$/, '');
        const current = localStorage.getItem(STORAGE_KEYS.SERVER_URL);
        if (clean && clean !== current) {
          localStorage.setItem(STORAGE_KEYS.SERVER_URL, clean);
          healthCache = null;
          window.dispatchEvent(new CustomEvent('mindflix:media-server-url-changed', { detail: { serverUrl: clean } }));
        }
        return clean;
      }
    }
  } catch (err) {
    console.debug('Could not sync media server URL with cloud', err);
  }
  return getMediaServerUrl();
}

// In-memory health cache to prevent lagging requests on every lesson change
let healthCache: { url: string; online: boolean; timestamp: number } | null = null;
const HEALTH_CACHE_TTL_MS = 25000; // 25s

export async function checkServerHealth(serverUrl?: string, force = false): Promise<boolean> {
  const base = serverUrl || getMediaServerUrl();
  if (!base) return false;

  const now = Date.now();
  if (!force && healthCache && healthCache.url === base && (now - healthCache.timestamp) < HEALTH_CACHE_TTL_MS) {
    return healthCache.online;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${base}/api/catalog`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);
    const isOk = res.ok;
    healthCache = { url: base, online: isOk, timestamp: now };
    return isOk;
  } catch {
    healthCache = { url: base, online: false, timestamp: now };
    return false;
  }
}

export async function getActiveMediaProvider(): Promise<'server'> {
  return 'server';
}

export function buildServerStreamUrl(relativePath: string, serverUrl?: string): string {
  const base = serverUrl || getMediaServerUrl();
  const cleanPath = (relativePath || '').replace(/\\/g, '/');
  return `${base}/api/stream?path=${encodeURIComponent(cleanPath)}`;
}

