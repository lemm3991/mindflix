import type { APIRoute } from 'astro';
import { clearAttackLogs, getSecurityStats } from '../../../lib/server/security-monitor';

export const POST: APIRoute = async () => {
  try {
    clearAttackLogs();
    return new Response(JSON.stringify({
      success: true,
      message: 'Histórico de eventos e telemetria de ataques limpos com sucesso.',
      stats: getSecurityStats(),
      logs: []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao limpar logs de ataques.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
