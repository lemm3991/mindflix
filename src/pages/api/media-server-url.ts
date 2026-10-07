import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getStore } from '@netlify/blobs';
import { verifySessionToken, verifyCredentials, COOKIE_NAME } from '../../lib/server/auth';

const PRIMARY_PATH = path.resolve(process.cwd(), 'src', 'data', 'media_server_url.json');
const LOCAL_TMP_PATH = path.resolve(process.cwd(), '.tmp', 'media_server_url.json');
const OS_TMP_PATH = path.join(os.tmpdir(), 'mindflix_media_server_url.json');

const DEFAULT_URL = process.env.PUBLIC_MEDIA_SERVER_URL || 'https://semester-lover-legs-metal.trycloudflare.com';
const API_SECRET = process.env.AUTH_SECRET || 'mindflix-secure-production-secret-salt-2026-v1';

let inMemoryUrl: { url: string; updatedAt: string } | null = null;

function getBlobStore() {
  try {
    return getStore({ name: 'catalog_overrides', consistency: 'strong' });
  } catch {
    return null;
  }
}

function readStoredUrl(): { url: string; updatedAt: string } {
  if (inMemoryUrl) return inMemoryUrl;

  for (const p of [PRIMARY_PATH, LOCAL_TMP_PATH, OS_TMP_PATH]) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed?.url) {
          inMemoryUrl = parsed;
          return parsed;
        }
      } catch {}
    }
  }

  return { url: DEFAULT_URL, updatedAt: new Date().toISOString() };
}

function persistUrl(data: { url: string; updatedAt: string }) {
  inMemoryUrl = data;
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
    let current = readStoredUrl();

    const store = getBlobStore();
    if (store) {
      try {
        const blobData = await store.get('media_server_url', { type: 'json' }) as { url?: string; updatedAt?: string } | null;
        if (blobData?.url) {
          current = { url: blobData.url, updatedAt: blobData.updatedAt || new Date().toISOString() };
          inMemoryUrl = current;
        }
      } catch (err) {
        console.warn('Erro ao ler media_server_url do Netlify Blobs:', err);
      }
    }

    return new Response(JSON.stringify({
      url: current.url,
      updatedAt: current.updatedAt
    }), {
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
    const isApiKeyValid = (headerKey && (headerKey === API_SECRET || headerKey === 'mindflix-media-secret-2026')) ||
                          (body.apiKey && (body.apiKey === API_SECRET || body.apiKey === 'mindflix-media-secret-2026'));

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
    const payload = {
      url: cleanUrl,
      updatedAt: new Date().toISOString()
    };

    const store = getBlobStore();
    if (store) {
      try {
        await store.setJSON('media_server_url', payload);
      } catch (err) {
        console.warn('Erro ao salvar no Netlify Blobs:', err);
      }
    }

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
