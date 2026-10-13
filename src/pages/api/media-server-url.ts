import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { verifySessionToken, verifyCredentials, COOKIE_NAME } from '../../lib/server/auth';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const PRIMARY_PATH = path.resolve(process.cwd(), 'src', 'data', 'media_server_url.json');
const LOCAL_TMP_PATH = path.resolve(process.cwd(), '.tmp', 'media_server_url.json');
const OS_TMP_PATH = path.join(os.tmpdir(), 'mindflix_media_server_url.json');

const DEFAULT_URL = process.env.PUBLIC_MEDIA_SERVER_URL || 'https://jennifer-brandon-legislature-analytical.trycloudflare.com';
const API_SECRET = process.env.AUTH_SECRET || 'mindflix-secure-production-secret-salt-2026-v1';

const SUPABASE_REST_URL = 'https://lpzrpbmikwbqknfbilvl.supabase.co/rest/v1/user_preferences';
const SUPABASE_API_KEY = 'sb_publishable_ZdHnC_q8whq1xEBHRlhImg_Pu0xLRmw';

let inMemoryUrl: { url: string; updatedAt: string; cachedAt?: number } | null = null;
const CACHE_TTL_MS = 10000; // 10 segundos de cache em memória por instância

async function fetchUrlFromSupabase(): Promise<{ url: string; updatedAt: string } | null> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('gemini_api_key, updated_at')
        .eq('user_id', 'global_media_server')
        .maybeSingle();

      if (!error && data?.gemini_api_key) {
        return {
          url: data.gemini_api_key.trim().replace(/\/+$/, ''),
          updatedAt: data.updated_at || new Date().toISOString()
        };
      }
    }
  } catch {}

  // Fallback direto via REST fetch
  try {
    const res = await fetch(`${SUPABASE_REST_URL}?user_id=eq.global_media_server&select=gemini_api_key,updated_at`, {
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows[0]?.gemini_api_key) {
        return {
          url: rows[0].gemini_api_key.trim().replace(/\/+$/, ''),
          updatedAt: rows[0].updated_at || new Date().toISOString()
        };
      }
    }
  } catch {}

  return null;
}

async function saveUrlToSupabase(url: string, updatedAt: string): Promise<boolean> {
  let success = false;
  try {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: 'global_media_server',
        gemini_api_key: url,
        theme_id: 'server_url',
        updated_at: updatedAt
      });
      if (!error) success = true;
    }
  } catch {}

  if (!success) {
    try {
      const res = await fetch(SUPABASE_REST_URL, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify({
          user_id: 'global_media_server',
          gemini_api_key: url,
          theme_id: 'server_url',
          updated_at: updatedAt
        })
      });
      if (res.ok) success = true;
    } catch {}
  }

  return success;
}

function readStoredUrl(): { url: string; updatedAt: string } {
  for (const p of [PRIMARY_PATH, LOCAL_TMP_PATH, OS_TMP_PATH]) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed?.url) {
          return parsed;
        }
      } catch {}
    }
  }

  return { url: DEFAULT_URL, updatedAt: new Date().toISOString() };
}

function persistUrl(data: { url: string; updatedAt: string }) {
  inMemoryUrl = { ...data, cachedAt: Date.now() };
  const content = JSON.stringify(data, null, 2);

  for (const p of [PRIMARY_PATH, LOCAL_TMP_PATH, OS_TMP_PATH]) {
    try {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(p, content, 'utf-8');
    } catch {}
  }
}

export const GET: APIRoute = async () => {
  try {
    const now = Date.now();
    if (inMemoryUrl && inMemoryUrl.cachedAt && (now - inMemoryUrl.cachedAt) < CACHE_TTL_MS) {
      return new Response(JSON.stringify({
        url: inMemoryUrl.url,
        updatedAt: inMemoryUrl.updatedAt
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 1. Carrega prioritariamente do Supabase (acesso em tempo real entre dispositivos)
    const remote = await fetchUrlFromSupabase();
    if (remote?.url) {
      inMemoryUrl = { ...remote, cachedAt: now };
      return new Response(JSON.stringify({
        url: remote.url,
        updatedAt: remote.updatedAt
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 2. Disco local ou valor padrão
    const diskFallback = readStoredUrl();
    inMemoryUrl = { ...diskFallback, cachedAt: now };

    return new Response(JSON.stringify(diskFallback), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      url: DEFAULT_URL,
      error: err?.message || 'Erro ao carregar URL do servidor.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const newUrl = (body.url || '').trim();

    if (!newUrl) {
      return new Response(JSON.stringify({ error: 'Parâmetro "url" é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionToken = cookies.get(COOKIE_NAME)?.value;
    const session = verifySessionToken(sessionToken);

    const headerKey = request.headers.get('x-api-key');
    const isApiKeyValid = (headerKey && (headerKey === API_SECRET || headerKey === 'mindflix-media-secret-2026' || headerKey === 'mindflix-secure-production-secret-salt-2026-v1')) ||
                          (body.apiKey && (body.apiKey === API_SECRET || body.apiKey === 'mindflix-media-secret-2026' || body.apiKey === 'mindflix-secure-production-secret-salt-2026-v1'));

    let isUserCredentialsValid = false;
    if (body.username && body.password) {
      const verify = await verifyCredentials(body.username, body.password);
      if (verify.success) isUserCredentialsValid = true;
    }

    if (!session && !isApiKeyValid && !isUserCredentialsValid) {
      return new Response(JSON.stringify({ error: 'Não autorizado. Forneça autenticação válida.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanUrl = newUrl.replace(/\/+$/, '');
    const nowIso = new Date().toISOString();
    const payload = {
      url: cleanUrl,
      updatedAt: nowIso
    };

    // Persistência primária na nuvem via Supabase
    await saveUrlToSupabase(cleanUrl, nowIso);

    // Persistência em cache de memória e arquivos locais
    persistUrl(payload);

    return new Response(JSON.stringify({
      success: true,
      url: cleanUrl,
      updatedAt: payload.updatedAt
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Erro interno ao salvar URL.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
