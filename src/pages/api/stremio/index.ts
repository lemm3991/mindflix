import type { APIRoute } from 'astro';
import { renderInstallHtml, corsHeaders } from '../../../lib/server/stremioBridge';

export const GET: APIRoute = async ({ url }) => {
  const fixedManifestUrl = `${url.origin}/api/stremio/manifest.json`;
  return new Response(renderInstallHtml(fixedManifestUrl), {
    status: 200,
    headers: corsHeaders('text/html; charset=utf-8')
  });
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
};
