// src/pages/api/auth/change-password.ts - Secure Password Change Endpoint
import type { APIRoute } from 'astro';
import { verifySessionToken, updateServerUserPassword, COOKIE_NAME } from '../../../lib/server/auth';
import { checkRateLimit, getClientIp } from '../../../lib/server/rate-limit';

export const POST: APIRoute = async ({ request, cookies }) => {
  const ip = getClientIp(request);
  const rateLimitKey = `pass-change:${ip}`;

  // Rate Limiting: Max 5 attempts per 15 minutes
  const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000, 15 * 60 * 1000);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil(rateCheck.resetSeconds / 60);
    return new Response(JSON.stringify({
      error: `Muitas tentativas de alteração de senha. Tente novamente em ${minutes} minuto(s).`
    }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verify session cookie
  const token = cookies.get(COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return new Response(JSON.stringify({ error: 'Sessão expirada ou não autenticado.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const newPassword = (body.newPassword || '').trim();

    if (!newPassword || newPassword.length < 6) {
      return new Response(JSON.stringify({ error: 'A nova senha deve possuir no mínimo 6 caracteres.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const success = await updateServerUserPassword(session.username, newPassword);

    if (success) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Senha alterada com sucesso no servidor!'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Falha ao atualizar a senha no servidor.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Erro interno ao processar a alteração.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
