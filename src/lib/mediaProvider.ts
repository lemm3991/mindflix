// src/lib/mediaProvider.ts - Media Source Provider Manager (Local Server)

export type MediaSourceMode = 'server';

export interface MediaProviderConfig {
  mode: MediaSourceMode;
  serverUrl: string;
}

const STORAGE_KEYS = {
  MODE: 'mindflix_media_mode',
  SERVER_URL: 'mindflix_media_server_url'
};

export const DEFAULT_MEDIA_SERVER_URL = 'https://semester-lover-legs-metal.trycloudflare.com';

export function getMediaMode(): MediaSourceMode {
  return 'server';
}

export function setMediaMode(mode: MediaSourceMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MODE, 'server');
    window.dispatchEvent(new CustomEvent('mindflix:media-mode-changed', { detail: { mode: 'server' } }));
  } catch (e) {
    console.warn('Failed setting media mode', e);
  }
}

export function getMediaServerUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_MEDIA_SERVER_URL;
  try {
    // 1. Verifica parâmetro na URL (?serverUrl=... ou ?mediaServerUrl=...)
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get('serverUrl') || params.get('mediaServerUrl');
    if (paramUrl && paramUrl.trim()) {
      const clean = paramUrl.trim().replace(/\/+$/, '');
      localStorage.setItem(STORAGE_KEYS.SERVER_URL, clean);
      return clean;
    }

    const val = localStorage.getItem(STORAGE_KEYS.SERVER_URL);
    return (val && val.trim()) ? val.trim().replace(/\/+$/, '') : DEFAULT_MEDIA_SERVER_URL;
  } catch {
    return DEFAULT_MEDIA_SERVER_URL;
  }
}

export function setMediaServerUrl(url: string, syncCloud = true): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = url.trim().replace(/\/+$/, '');
    localStorage.setItem(STORAGE_KEYS.SERVER_URL, clean);
    healthCache = null;
    window.dispatchEvent(new CustomEvent('mindflix:media-server-url-changed', { detail: { serverUrl: clean } }));

    if (syncCloud) {
      fetch('/api/media-server-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: clean })
      }).catch((e) => console.debug('Sync cloud URL error:', e));
    }
  } catch (e) {
    console.warn('Failed setting media server URL', e);
  }
}

// Sincroniza a URL do servidor com o Netlify Blobs / API na nuvem
export async function syncMediaServerUrlWithCloud(): Promise<string> {
  if (typeof window === 'undefined') return DEFAULT_MEDIA_SERVER_URL;
  try {
    const res = await fetch('/api/media-server-url', { cache: 'no-store' });
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

// In-memory health cache
let healthCache: { url: string; online: boolean; timestamp: number } | null = null;
const HEALTH_CACHE_TTL_MS = 25000;

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
