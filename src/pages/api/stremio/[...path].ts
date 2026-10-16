import type { APIRoute } from 'astro';
import { forwardStremioRequest, corsHeaders, renderInstallHtml } from '../../../lib/server/stremioBridge';

export const GET: APIRoute = async ({ params, url }) => {
  const rawPath = params.path || '';

  // 1. Página Web de Instalação e Guia
  if (rawPath === 'install' || rawPath === 'stremio' || rawPath === 'gui' || rawPath === '') {
    const fixedManifestUrl = `${url.origin}/api/stremio/manifest.json`;
    return new Response(renderInstallHtml(fixedManifestUrl), {
      status: 200,
      headers: corsHeaders('text/html; charset=utf-8')
    });
  }

  // 2. Encaminhamento dinâmico para o túnel ativo do PC (catálogo, streams, etc.)
  return forwardStremioRequest(rawPath, url.searchParams);
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
};
