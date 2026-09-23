// src/lib/mediaProvider.ts - Media Source Provider Manager (Server vs Google Drive)

export type MediaSourceMode = 'auto' | 'server' | 'drive';

export interface MediaProviderConfig {
  mode: MediaSourceMode;
  serverUrl: string;
}

const STORAGE_KEYS = {
  MODE: 'mindflix_media_mode',
  SERVER_URL: 'mindflix_media_server_url'
};

export const DEFAULT_MEDIA_SERVER_URL = 'https://par-movie-neighbors-authorized.trycloudflare.com';

export function getMediaMode(): MediaSourceMode {
  if (typeof window === 'undefined') return 'auto';
  try {
    const val = localStorage.getItem(STORAGE_KEYS.MODE) as MediaSourceMode;
    if (val === 'server' || val === 'drive' || val === 'auto') return val;
    return 'auto';
  } catch {
    return 'auto';
  }
}

export function setMediaMode(mode: MediaSourceMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MODE, mode);
    window.dispatchEvent(new CustomEvent('mindflix:media-mode-changed', { detail: { mode } }));
  } catch (e) {
    console.warn('Failed setting media mode', e);
  }
}

export function getMediaServerUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_MEDIA_SERVER_URL;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SERVER_URL);
    return (val && val.trim()) ? val.trim().replace(/\/+$/, '') : DEFAULT_MEDIA_SERVER_URL;
  } catch {
    return DEFAULT_MEDIA_SERVER_URL;
  }
}

export function setMediaServerUrl(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = url.trim().replace(/\/+$/, '');
    localStorage.setItem(STORAGE_KEYS.SERVER_URL, clean);
    // Invalidate cached health status
    healthCache = null;
    window.dispatchEvent(new CustomEvent('mindflix:media-server-url-changed', { detail: { serverUrl: clean } }));
  } catch (e) {
    console.warn('Failed setting media server URL', e);
  }
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
    const timeoutId = setTimeout(() => controller.abort(), 2000);
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

export async function getActiveMediaProvider(): Promise<'server' | 'drive'> {
  const mode = getMediaMode();
  if (mode === 'drive') return 'drive';
  if (mode === 'server') return 'server';

  // Mode is 'auto': ping server health
  const isOnline = await checkServerHealth();
  return isOnline ? 'server' : 'drive';
}

export function buildServerStreamUrl(relativePath: string, serverUrl?: string): string {
  const base = serverUrl || getMediaServerUrl();
  const cleanPath = (relativePath || '').replace(/\\/g, '/');
  return `${base}/api/stream?path=${encodeURIComponent(cleanPath)}`;
}
