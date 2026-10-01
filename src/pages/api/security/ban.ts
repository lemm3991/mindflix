import type { APIRoute } from 'astro';
import {
  banIp,
  unbanIp,
  getBannedIps,
  isWhitelisted
} from '../../../lib/server/security-monitor';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { ip, reason, durationMinutes } = body;

    if (!ip || typeof ip !== 'string') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Endereço IP inválido ou não informado.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanIp = ip.trim();
    if (isWhitelisted(cleanIp)) {
      return new Response(JSON.stringify({
        success: false,
        error: `O IP ${cleanIp} está na lista de permissões (Whitelist) e não pode ser bloqueado.`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const duration = durationMinutes !== undefined ? Number(durationMinutes) : 60;
    const banReason = reason || 'Bloqueio manual aplicado pelo Administrador';

    const record = banIp(cleanIp, banReason, duration, true);

    return new Response(JSON.stringify({
      success: true,
      message: `IP ${cleanIp} foi bloqueado com sucesso.`,
      record,
      bans: getBannedIps()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao processar bloqueio de IP.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { ip } = body;

    if (!ip || typeof ip !== 'string') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Endereço IP inválido ou não informado.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const cleanIp = ip.trim();
    const unbanned = unbanIp(cleanIp);

    return new Response(JSON.stringify({
      success: true,
      unbanned,
      message: unbanned
        ? `IP ${cleanIp} foi desbloqueado com sucesso.`
        : `IP ${cleanIp} não estava na lista de bloqueios ativos.`,
      bans: getBannedIps()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao processar desbloqueio de IP.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
