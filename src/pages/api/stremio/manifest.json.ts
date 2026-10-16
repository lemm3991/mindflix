import type { APIRoute } from 'astro';
import { forwardStremioRequest, corsHeaders } from '../../../lib/server/stremioBridge';

export const GET: APIRoute = async ({ url }) => {
  return forwardStremioRequest('manifest.json', url.searchParams);
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
};
