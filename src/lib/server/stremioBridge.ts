import { supabase, isSupabaseConfigured } from '../supabase';

const SUPABASE_REST_URL = 'https://lpzrpbmikwbqknfbilvl.supabase.co/rest/v1/user_preferences';
const SUPABASE_API_KEY = 'sb_publishable_ZdHnC_q8whq1xEBHRlhImg_Pu0xLRmw';

const DEFAULT_FALLBACK_URL = process.env.PUBLIC_MEDIA_SERVER_URL || '';

let inMemoryTunnelUrl: { url: string; cachedAt: number } | null = null;
const CACHE_TTL_MS = 5000; // 5 segundos de cache em memória

export const FALLBACK_MANIFEST = {
  id: 'community.movhunter',
  version: '1.1.0',
  name: 'MovHunter',
  description: 'Descoberta e reprodução dinâmica de filmes no VRunner para Stremio (Ponte Fixa Vercel)',
  resources: ['catalog', 'stream'],
  types: ['movie'],
  catalogs: [
    {
      type: 'movie',
      id: 'movhunter-catalog',
      name: 'MovHunter - Filmes',
      extra: [
        { name: 'search', isRequired: false },
        { name: 'skip', isRequired: false }
      ]
    }
  ],
  idPrefixes: ['tt'],
  behaviorHints: {
    configurable: false,
    configurationRequired: false
  }
};

export async function getActiveTunnelUrl(): Promise<string> {
  const now = Date.now();
  if (inMemoryTunnelUrl && (now - inMemoryTunnelUrl.cachedAt) < CACHE_TTL_MS) {
    return inMemoryTunnelUrl.url;
  }

  // 1. Consulta Supabase SDK
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('gemini_api_key, updated_at')
        .eq('user_id', 'global_media_server')
        .maybeSingle();

      if (!error && data?.gemini_api_key) {
        const clean = data.gemini_api_key.trim().replace(/\/+$/, '');
        inMemoryTunnelUrl = { url: clean, cachedAt: now };
        return clean;
      }
    }
  } catch {}

  // 2. Fallback direto via REST fetch
  try {
    const res = await fetch(`${SUPABASE_REST_URL}?user_id=eq.global_media_server&select=gemini_api_key`, {
      headers: {
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows[0]?.gemini_api_key) {
        const clean = rows[0].gemini_api_key.trim().replace(/\/+$/, '');
        inMemoryTunnelUrl = { url: clean, cachedAt: now };
        return clean;
      }
    }
  } catch {}

  return DEFAULT_FALLBACK_URL;
}

export function corsHeaders(contentType = 'application/json; charset=utf-8'): Record<string, string> {
  return {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  };
}

export async function forwardStremioRequest(
  subpath: string,
  searchParams?: URLSearchParams
): Promise<Response> {
  const cleanSubpath = subpath.replace(/^\/+/, '');
  const tunnelUrl = await getActiveTunnelUrl();
  const queryStr = searchParams && searchParams.toString() ? `?${searchParams.toString()}` : '';

  // Se não temos URL de túnel ou o PC estiver desligado
  if (!tunnelUrl) {
    if (cleanSubpath === 'manifest.json') {
      return new Response(JSON.stringify(FALLBACK_MANIFEST), {
        status: 200,
        headers: corsHeaders()
      });
    }
    if (cleanSubpath.startsWith('catalog')) {
      return new Response(JSON.stringify({ metas: [] }), {
        status: 200,
        headers: corsHeaders()
      });
    }
    if (cleanSubpath.startsWith('stream')) {
      return new Response(JSON.stringify({ streams: [] }), {
        status: 200,
        headers: corsHeaders()
      });
    }
    return new Response(JSON.stringify({ error: 'Túnel do PC não encontrado no momento.' }), {
      status: 503,
      headers: corsHeaders()
    });
  }

  const targetUrl = `${tunnelUrl}/${cleanSubpath}${queryStr}`;

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mindflix-Stremio-Bridge/1.0',
        'Accept': 'application/json, text/plain, */*'
      },
      signal: AbortSignal.timeout(15000)
    });

    if (res.ok) {
      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: corsHeaders(res.headers.get('content-type') || 'application/json; charset=utf-8')
      });
    }

    // Se o PC retornou erro (ex: 404 ou 502)
    if (cleanSubpath === 'manifest.json') {
      return new Response(JSON.stringify(FALLBACK_MANIFEST), {
        status: 200,
        headers: corsHeaders()
      });
    }
    if (cleanSubpath.startsWith('catalog')) {
      return new Response(JSON.stringify({ metas: [] }), {
        status: 200,
        headers: corsHeaders()
      });
    }
    if (cleanSubpath.startsWith('stream')) {
      return new Response(JSON.stringify({ streams: [] }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    const errText = await res.text().catch(() => '');
    return new Response(errText || JSON.stringify({ error: `Servidor retornou status ${res.status}` }), {
      status: res.status,
      headers: corsHeaders()
    });
  } catch (err: any) {
    // Falha de conexão com o túnel do PC (ex: PC offline ou timeout)
    if (cleanSubpath === 'manifest.json') {
      return new Response(JSON.stringify(FALLBACK_MANIFEST), {
        status: 200,
        headers: corsHeaders()
      });
    }
    if (cleanSubpath.startsWith('catalog')) {
      return new Response(JSON.stringify({ metas: [] }), {
        status: 200,
        headers: corsHeaders()
      });
    }
    if (cleanSubpath.startsWith('stream')) {
      return new Response(JSON.stringify({ streams: [] }), {
        status: 200,
        headers: corsHeaders()
      });
    }

    return new Response(JSON.stringify({
      error: 'Falha ao contatar o MovHunter no PC.',
      details: err?.message || 'Timeout de conexão'
    }), {
      status: 504,
      headers: corsHeaders()
    });
  }
}

export function renderInstallHtml(manifestUrl: string): string {
  const stremioProtocol = manifestUrl.replace(/^https?:\/\//, 'stremio://');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MovHunter — Ponte Fixa Stremio</title>
  <style>
    :root {
      --bg: #0b0e14;
      --card-bg: #151922;
      --border: #252d3d;
      --accent: #7c4dff;
      --accent-hover: #651fff;
      --accent-glow: rgba(124, 77, 255, 0.25);
      --text: #e6edf3;
      --text-muted: #8b949e;
      --success: #00e676;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.6;
      padding: 32px 16px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .container { max-width: 680px; width: 100%; }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 36px 30px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.45);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--accent-glow);
      color: #b388ff;
      border: 1px solid rgba(124, 77, 255, 0.4);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 { font-size: 2.2rem; color: #fff; font-weight: 800; margin-bottom: 10px; }
    .subtitle { font-size: 1.05rem; color: var(--text-muted); margin-bottom: 28px; line-height: 1.5; }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 230, 118, 0.1);
      border: 1px solid rgba(0, 230, 118, 0.3);
      color: var(--success);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .dot { width: 8px; height: 8px; background: var(--success); border-radius: 50%; box-shadow: 0 0 8px var(--success); }
    .actions { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .btn-install {
      background: linear-gradient(135deg, #7c4dff, #651fff);
      color: #fff;
      text-decoration: none;
      padding: 16px 28px;
      border-radius: 10px;
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 6px 20px var(--accent-glow);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .btn-install:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124, 77, 255, 0.4); }
    .btn-secondary {
      background: #21262d;
      color: var(--text);
      border: 1px solid var(--border);
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .btn-secondary:hover { background: #30363d; color: #fff; }
    .manifest-box {
      background: #0b0e14;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
      font-family: monospace;
      font-size: 0.88rem;
      color: #9ecbff;
      word-break: break-all;
      margin-bottom: 12px;
      text-align: left;
    }
    .guide-section {
      text-align: left;
      border-top: 1px solid var(--border);
      padding-top: 24px;
      margin-top: 24px;
    }
    .guide-title {
      font-size: 1.1rem;
      color: #fff;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .steps-list { list-style: none; counter-reset: step-counter; }
    .steps-list li {
      counter-increment: step-counter;
      position: relative;
      padding-left: 38px;
      margin-bottom: 14px;
      font-size: 0.92rem;
      color: var(--text);
    }
    .steps-list li::before {
      content: counter(step-counter);
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      background: rgba(124, 77, 255, 0.2);
      border: 1px solid rgba(124, 77, 255, 0.4);
      color: #b388ff;
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="badge">Ponte Fixa Vercel — MovHunter</div>
      <h1>MovHunter para Stremio</h1>
      <p class="subtitle">Descoberta inteligente de filmes dublados e legendados com endereço fixo e permanente para a sua Smart TV Philips.</p>
      
      <div class="status-pill">
        <span class="dot"></span>
        <span>Endereço Fixo e Sincronizado</span>
      </div>

      <div class="actions">
        <a href="${stremioProtocol}" class="btn-install">
          <span>🚀 Instalar no Stremio com 1 Clique</span>
        </a>
        <div class="manifest-box" id="manifestUrlText">${manifestUrl}</div>
        <button class="btn-secondary" onclick="copyManifestUrl()">
          <span id="copyIcon">📋</span>
          <span id="copyBtnText">Copiar Link do Manifesto Fixo</span>
        </button>
      </div>

      <div class="guide-section">
        <div class="guide-title">📺 Como instalar na Smart TV Philips (Passo a Passo)</div>
        <ol class="steps-list">
          <li><strong>No PC ou Celular (Recomendado):</strong> Faça login no Stremio com a mesma conta conectada na sua TV e clique no botão acima <em>"Instalar no Stremio com 1 Clique"</em>. O Stremio sincronizará e o complemento aparecerá instantaneamente na TV!</li>
          <li><strong>Direto na TV Philips:</strong> Abra o Stremio na TV, vá no ícone de <strong>Complementos (Addons)</strong>, selecione a barra de pesquisa/URL e digite o endereço fixo acima: <code>${manifestUrl}</code></li>
          <li><strong>Pronto para sempre:</strong> Você nunca mais precisará atualizar o link na TV quando reiniciar o seu PC ou abrir o <code>iniciar-com-cloudflare.bat</code>. A ponte fixa na Vercel encaminha as buscas automaticamente para o túnel ativo!</li>
        </ol>
      </div>
    </div>
  </div>

  <script>
    function copyManifestUrl() {
      const text = document.getElementById('manifestUrlText').innerText.trim();
      navigator.clipboard.writeText(text).then(() => {
        const btnText = document.getElementById('copyBtnText');
        const icon = document.getElementById('copyIcon');
        btnText.innerText = 'Copiado para a Área de Transferência!';
        icon.innerText = '✅';
        setTimeout(() => {
          btnText.innerText = 'Copiar Link do Manifesto Fixo';
          icon.innerText = '📋';
        }, 3000);
      });
    }
  </script>
</body>
</html>`;
}
