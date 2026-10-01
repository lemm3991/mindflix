import type { APIRoute } from 'astro';
import {
  getSecuritySettings,
  updateSecuritySettings
} from '../../../lib/server/security-monitor';

export const GET: APIRoute = async () => {
  try {
    const settings = getSecuritySettings();
    return new Response(JSON.stringify({
      success: true,
      settings
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao obter configurações.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const updated = updateSecuritySettings(body);

    return new Response(JSON.stringify({
      success: true,
      message: 'Configurações do IPS atualizadas com sucesso.',
      settings: updated
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao atualizar configurações.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
