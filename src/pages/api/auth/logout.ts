// src/pages/api/auth/logout.ts - Server Logout Endpoint
import type { APIRoute } from 'astro';
import { COOKIE_NAME } from '../../../lib/server/auth';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(COOKIE_NAME, {
    path: '/'
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(COOKIE_NAME, {
    path: '/'
  });

  return redirect('/login');
};
