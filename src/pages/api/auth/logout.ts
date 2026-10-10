// src/pages/api/auth/logout.ts - Server Logout Endpoint
import type { APIRoute } from 'astro';
import { COOKIE_NAME } from '../../../lib/server/auth';

export const POST: APIRoute = async ({ cookies }) => {
  cookies.delete(COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': COOKIE_NAME + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
    }
  });
};

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD
  });

  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/login?logout=1',
      'Set-Cookie': COOKIE_NAME + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
    }
  });
};
