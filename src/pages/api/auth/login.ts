import type { APIRoute } from 'astro';
import { verifyCredentials, createSessionToken, COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '../../../lib/server/auth';
import {
  checkRateLimitAsync,
  resetRateLimit,
  buildRateLimitKey,
  createRateLimitResponse,
  RATE_LIMIT_PROFILES
} from '../../../lib/server/rate-limit';

export const POST: APIRoute = async ({ request, cookies }) => {
  const rateLimitKey = buildRateLimitKey('auth_login', request);

  // Rate Limiting: Max 5 failed attempts per 15 minutes
  const rateCheck = await checkRateLimitAsync(rateLimitKey, RATE_LIMIT_PROFILES.AUTH_LOGIN);

  if (!rateCheck.allowed) {
    return createRateLimitResponse(rateCheck, RATE_LIMIT_PROFILES.AUTH_LOGIN.errorMessage);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const username = (body.username || '').trim();
    const password = (body.password || '').trim();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Informe o usuário e a senha.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { success, user } = await verifyCredentials(username, password);

    if (!success || !user) {
      return new Response(JSON.stringify({
        error: 'Nome de usuário ou senha incorretos.',
        remainingAttempts: rateCheck.remaining
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Reset rate limit on successful authentication
    resetRateLimit(rateLimitKey);

    // Create session token & set HttpOnly cookie
    const token = createSessionToken(user);
    const isProduction = import.meta.env.PROD;

    cookies.set(COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS
    });

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.name
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Erro interno ao autenticar.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
