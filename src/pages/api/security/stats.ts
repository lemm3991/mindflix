import type { APIRoute } from 'astro';
import {
  getSecurityStats,
  getBannedIps,
  getWhitelist,
  getAttackLogs,
  getSecuritySettings
} from '../../../lib/server/security-monitor';

export const GET: APIRoute = async ({ url }) => {
  try {
    const limit = Number(url.searchParams.get('limit')) || 100;
    const filterType = url.searchParams.get('type') || undefined;
    const filterSeverity = url.searchParams.get('severity') || undefined;

    const stats = getSecurityStats();
    const bans = getBannedIps();
    const whitelist = getWhitelist();
    const logs = getAttackLogs(limit, filterType, filterSeverity);
    const settings = getSecuritySettings();

    return new Response(JSON.stringify({
      success: true,
      stats,
      bans,
      whitelist,
      logs,
      settings,
      timestamp: Date.now()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao carregar telemetria de segurança.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
