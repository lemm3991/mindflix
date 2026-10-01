import type { APIRoute } from 'astro';
import {
  addToWhitelist,
  removeFromWhitelist,
  getWhitelist
} from '../../../lib/server/security-monitor';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { ip, note } = body;

    if (!ip || typeof ip !== 'string') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Endereço IP inválido ou não informado.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    addToWhitelist(ip.trim(), note);

    return new Response(JSON.stringify({
      success: true,
      message: `IP ${ip.trim()} adicionado à Whitelist.`,
      whitelist: getWhitelist()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao adicionar IP à Whitelist.'
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

    const removed = removeFromWhitelist(ip.trim());

    return new Response(JSON.stringify({
      success: true,
      removed,
      message: removed
        ? `IP ${ip.trim()} removido da Whitelist.`
        : `IP ${ip.trim()} não estava na Whitelist.`,
      whitelist: getWhitelist()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao remover IP da Whitelist.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
