// src/pages/api/auth/me.ts - Returns currently authenticated session user
import type { APIRoute } from 'astro';
import { verifySessionToken, COOKIE_NAME } from '../../../lib/server/auth';

export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get(COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    authenticated: true,
    user: {
      id: session.uid,
      username: session.username,
      name: session.name
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
