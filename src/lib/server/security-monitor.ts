// src/lib/server/security-monitor.ts - Real-Time Cyber Threat Monitor & Auto-Ban IPS Engine
import fs from 'node:fs';
import path from 'node:path';

export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AttackType =
  | 'SQL_INJECTION'
  | 'XSS'
  | 'PATH_TRAVERSAL'
  | 'MALICIOUS_SCANNER'
  | 'BAD_USER_AGENT'
  | 'RATE_ABUSE'
  | 'AUTH_BRUTE_FORCE'
  | 'SUSPICIOUS_PAYLOAD'
  | 'PROBE';

export interface AttackLog {
  id: string;
  timestamp: number;
  ip: string;
  method: string;
  path: string;
  attackType: AttackType;
  severity: ThreatSeverity;
  threatScore: number;
  details: string;
  payloadSnippet?: string;
  userAgent?: string;
  actionTaken: 'LOGGED' | 'CHALLENGED' | 'BLOCKED' | 'AUTOBANNED';
}

export interface BannedIpRecord {
  ip: string;
  bannedAt: number;
  expiresAt: number | null; // null = permanent
  reason: string;
  incidentId: string;
  totalThreatScore: number;
  attackCount: number;
  isManual?: boolean;
}

export interface WhitelistRecord {
  ip: string;
  addedAt: number;
  note?: string;
}

export interface ThreatScoreRecord {
  ip: string;
  score: number;
  lastActivity: number;
  attackCount: number;
  history: { type: AttackType; score: number; time: number }[];
}

export interface SecuritySettings {
  enabled: boolean;
  autoBanEnabled: boolean;
  autoBanThreshold: number; // e.g. 100 points
  banDurationMinutes: number; // default 60 minutes, 0 = permanent
  sensitivity: 'LOW' | 'NORMAL' | 'AGGRESSIVE';
  blockPageTheme: 'dark' | 'cyberpunk';
  maxLogs: number;
}

export interface SecurityStats {
  totalRequests: number;
  attacksDetected: number;
  attacksBlocked: number;
  activeBansCount: number;
  threatDistribution: Record<string, number>;
  severityDistribution: Record<string, number>;
  defconLevel: number; // 1 (Critical) to 5 (Normal)
  systemHealth: 'OPTIMAL' | 'ELEVATED_THREAT' | 'UNDER_ATTACK' | 'DEFCON_1';
  lastAttackTimestamp?: number;
}

// In-Memory Storage
const state = {
  totalRequests: 0,
  attacksDetected: 0,
  attacksBlocked: 0,
  lastAttackTimestamp: 0,
  bannedIps: new Map<string, BannedIpRecord>(),
  whitelist: new Map<string, WhitelistRecord>([
    ['127.0.0.1', { ip: '127.0.0.1', addedAt: Date.now(), note: 'Localhost IPv4' }],
    ['::1', { ip: '::1', addedAt: Date.now(), note: 'Localhost IPv6' }],
    ['localhost', { ip: 'localhost', addedAt: Date.now(), note: 'Localhost host' }],
    ['0.0.0.0', { ip: '0.0.0.0', addedAt: Date.now(), note: 'Local loopback' }]
  ]),
  threatScores: new Map<string, ThreatScoreRecord>(),
  logs: [] as AttackLog[],
  settings: {
    enabled: true,
    autoBanEnabled: true,
    autoBanThreshold: 100,
    banDurationMinutes: 60,
    sensitivity: 'NORMAL',
    blockPageTheme: 'cyberpunk',
    maxLogs: 1000
  } as SecuritySettings
};

// Persistence state file
const DATA_DIR = path.resolve(process.cwd(), 'src/data');
const STATE_FILE = path.join(DATA_DIR, 'security_state.json');

function loadPersistedState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf-8');
      const data = JSON.parse(raw);

      if (data.settings) state.settings = { ...state.settings, ...data.settings };
      if (Array.isArray(data.bannedIps)) {
        for (const item of data.bannedIps) {
          // Check if ban has already expired
          if (item.expiresAt && item.expiresAt < Date.now()) continue;
          state.bannedIps.set(item.ip, item);
        }
      }
      if (Array.isArray(data.whitelist)) {
        for (const item of data.whitelist) {
          state.whitelist.set(item.ip, item);
        }
      }
      if (Array.isArray(data.logs)) {
        state.logs = data.logs.slice(-state.settings.maxLogs);
      }
      if (typeof data.totalRequests === 'number') state.totalRequests = data.totalRequests;
      if (typeof data.attacksDetected === 'number') state.attacksDetected = data.attacksDetected;
      if (typeof data.attacksBlocked === 'number') state.attacksBlocked = data.attacksBlocked;
      if (typeof data.lastAttackTimestamp === 'number') state.lastAttackTimestamp = data.lastAttackTimestamp;
    }
  } catch (err) {
    console.error('[SecurityMonitor] Error loading state:', err);
  }
}

let saveDebounceTimeout: any = null;
function saveStateDebounced() {
  if (saveDebounceTimeout) return;
  saveDebounceTimeout = setTimeout(() => {
    saveDebounceTimeout = null;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const dataToSave = {
        settings: state.settings,
        bannedIps: Array.from(state.bannedIps.values()),
        whitelist: Array.from(state.whitelist.values()),
        logs: state.logs.slice(-state.settings.maxLogs),
        totalRequests: state.totalRequests,
        attacksDetected: state.attacksDetected,
        attacksBlocked: state.attacksBlocked,
        lastAttackTimestamp: state.lastAttackTimestamp,
        updatedAt: Date.now()
      };
      fs.writeFileSync(STATE_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('[SecurityMonitor] Error saving state:', err);
    }
  }, 2000);
}

// Initial load
loadPersistedState();

// Threat scoring decay & cleanup routine (runs every 60s)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    // 1. Clean expired bans
    for (const [ip, record] of state.bannedIps.entries()) {
      if (record.expiresAt && record.expiresAt < now) {
        state.bannedIps.delete(ip);
        saveStateDebounced();
      }
    }

    // 2. Decay threat scores older than 30 mins
    for (const [ip, record] of state.threatScores.entries()) {
      if (now - record.lastActivity > 30 * 60 * 1000) {
        // Score reduces by 50% every 30 mins of good behavior
        record.score = Math.floor(record.score * 0.5);
        if (record.score <= 5) {
          state.threatScores.delete(ip);
        }
      }
    }
  }, 60000).unref?.();
}

// --- THREAT SIGNATURE PATTERNS ---

const SIGNATURES = {
  // SQL Injection patterns
  SQLI: [
    /(%27)|(')|(--)|(%23)|(#)/i,
    /(\b(union|select|insert|update|delete|drop|alter|truncate|exec|xp_cmdshell|information_schema|benchmark|sleep)\b)/i,
    /(\b(or|and)\b\s+[\d'"]+\s*=\s*[\d'"]+)/i,
    /(\bgroup_concat\b|\bload_file\b|\bconcat_ws\b|\bcast\s*\(|\bextractvalue\b)/i,
    /(\bhaving\s+1=1\b|\border\s+by\s+\d{2,}\b)/i
  ],

  // Cross-Site Scripting patterns
  XSS: [
    /<script\b[^>]*>([\s\S]*?)<\/script>/i,
    /(javascript|vbscript|livescript):/i,
    /(\bonerror\s*=\b|\bonload\s*=\b|\bonclick\s*=\b|\bonmouseover\s*=\b|\beval\s*\(|\balert\s*\(|\bprompt\s*\(|\bdocument\.cookie\b)/i,
    /<(iframe|object|embed|svg|img|body|link|meta)\b[^>]*(\bsrc|\bhref|\bonerror|\bonload)\s*=/i,
    /(data:\s*text\/html|base64\s*[,;])/i
  ],

  // Path Traversal and Local File Inclusion (LFI)
  PATH_TRAVERSAL: [
    /(\.\.[\/\\]|\%2e\%2e[\/\\]|\%2e\%2e\%2f|\.\.\%2f)/i,
    /(\/etc\/passwd|\/etc\/shadow|\/proc\/self|\/dev\/null|windows\/win\.ini|windows\/system32)/i,
    /(\.env|\.git\/|\.svn\/|\.htaccess|\.htpasswd|\.aws\/|\.ssh\/)/i
  ],

  // Malicious Scanners, Bots, & Known Exploit Probes
  PROBES: [
    /(\/wp-admin|\/wp-login\.php|\/xmlrpc\.php|\/wp-content|\/wp-includes)/i,
    /(\/phpmyadmin|\/pma|\/mysqladmin|\/adminer|\/dbadmin)/i,
    /(\/actuator\/health|\/actuator\/env|\/api\/v1\/swagger\.json|\/swagger-ui)/i,
    /(\/cgi-bin\/|\/\.well-known\/security\.txt\/|\/solr\/|\/manager\/html)/i,
    /(\.php|\.asp|\.aspx|\.jsp|\.cgi|\.pl|\.action|\.do)$/i
  ],

  // Known Attack User-Agents
  BAD_USER_AGENTS: [
    /(sqlmap|nikto|acunetix|masscan|nessus|nmap|dirbuster|gobuster|wpscan|hydra|metasploit|zgrab|morfeus|fuzz|havij|burpcollaborator)/i,
    /^(curl|wget|python-requests|aiohttp|libwww-perl|go-http-client)\b/i
  ]
};

// Check if IP is in whitelist
export function isWhitelisted(ip: string): boolean {
  if (!ip) return false;
  const cleanIp = ip.trim().toLowerCase();
  return (
    state.whitelist.has(cleanIp) ||
    cleanIp === '127.0.0.1' ||
    cleanIp === '::1' ||
    cleanIp === 'localhost' ||
    cleanIp.startsWith('192.168.') ||
    cleanIp.startsWith('10.')
  );
}

// Check if IP is currently banned
export function isIpBanned(ip: string): { banned: boolean; record?: BannedIpRecord; remainingMinutes?: number } {
  if (!ip || isWhitelisted(ip)) return { banned: false };
  const record = state.bannedIps.get(ip);
  if (!record) return { banned: false };

  const now = Date.now();
  if (record.expiresAt && record.expiresAt < now) {
    state.bannedIps.delete(ip);
    saveStateDebounced();
    return { banned: false };
  }

  const remainingMinutes = record.expiresAt
    ? Math.max(1, Math.ceil((record.expiresAt - now) / 60000))
    : undefined;

  return {
    banned: true,
    record,
    remainingMinutes
  };
}

// Ban an IP
export function banIp(
  ip: string,
  reason: string,
  durationMinutes?: number | null,
  isManual: boolean = false,
  incidentId?: string
): BannedIpRecord {
  const now = Date.now();
  const dur = durationMinutes !== undefined ? durationMinutes : state.settings.banDurationMinutes;
  const expiresAt = dur && dur > 0 ? now + dur * 60 * 1000 : null;
  const genIncidentId = incidentId || `INC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const existing = state.bannedIps.get(ip);
  const record: BannedIpRecord = {
    ip,
    bannedAt: now,
    expiresAt,
    reason,
    incidentId: genIncidentId,
    totalThreatScore: existing ? existing.totalThreatScore + 100 : 100,
    attackCount: existing ? existing.attackCount + 1 : 1,
    isManual
  };

  state.bannedIps.set(ip, record);
  saveStateDebounced();
  return record;
}

// Unban an IP
export function unbanIp(ip: string): boolean {
  if (!state.bannedIps.has(ip)) return false;
  state.bannedIps.delete(ip);
  // Also reset threat score
  state.threatScores.delete(ip);
  saveStateDebounced();
  return true;
}

// Add IP to Whitelist
export function addToWhitelist(ip: string, note?: string): boolean {
  state.whitelist.set(ip.trim(), {
    ip: ip.trim(),
    addedAt: Date.now(),
    note: note || 'Adicionado manualmente'
  });
  // Unban if it was banned
  state.bannedIps.delete(ip.trim());
  saveStateDebounced();
  return true;
}

// Remove from Whitelist
export function removeFromWhitelist(ip: string): boolean {
  const res = state.whitelist.delete(ip.trim());
  saveStateDebounced();
  return res;
}

// Record an attack event
export function recordAttack(data: {
  ip: string;
  method: string;
  path: string;
  attackType: AttackType;
  severity: ThreatSeverity;
  threatScore: number;
  details: string;
  payloadSnippet?: string;
  userAgent?: string;
}): AttackLog {
  const now = Date.now();
  const logId = `ATK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  state.attacksDetected++;
  state.lastAttackTimestamp = now;

  // Calculate cumulative threat score for this IP
  let threatRecord = state.threatScores.get(data.ip);
  if (!threatRecord) {
    threatRecord = {
      ip: data.ip,
      score: 0,
      lastActivity: now,
      attackCount: 0,
      history: []
    };
    state.threatScores.set(data.ip, threatRecord);
  }

  threatRecord.score += data.threatScore;
  threatRecord.attackCount++;
  threatRecord.lastActivity = now;
  threatRecord.history.push({
    type: data.attackType,
    score: data.threatScore,
    time: now
  });

  // Decide action
  let actionTaken: AttackLog['actionTaken'] = 'LOGGED';

  // Check if auto-ban triggered
  const isBanned = isIpBanned(data.ip).banned;
  if (!isBanned && !isWhitelisted(data.ip) && state.settings.autoBanEnabled) {
    const threshold = state.settings.autoBanThreshold;
    if (threatRecord.score >= threshold || data.severity === 'CRITICAL') {
      actionTaken = 'AUTOBANNED';
      state.attacksBlocked++;
      banIp(
        data.ip,
        `Bloqueio automático por detecção de ${data.attackType} (Pontuação: ${threatRecord.score}/${threshold})`,
        state.settings.banDurationMinutes,
        false,
        logId
      );
    } else {
      actionTaken = 'CHALLENGED';
      state.attacksBlocked++;
    }
  } else if (isBanned) {
    actionTaken = 'BLOCKED';
    state.attacksBlocked++;
  }

  const log: AttackLog = {
    id: logId,
    timestamp: now,
    ip: data.ip,
    method: data.method,
    path: data.path,
    attackType: data.attackType,
    severity: data.severity,
    threatScore: data.threatScore,
    details: data.details,
    payloadSnippet: data.payloadSnippet?.substring(0, 300),
    userAgent: data.userAgent?.substring(0, 200),
    actionTaken
  };

  state.logs.push(log);
  if (state.logs.length > state.settings.maxLogs) {
    state.logs.shift();
  }

  saveStateDebounced();
  return log;
}

// Deep inspect incoming request
export async function inspectRequest(
  request: Request,
  url: URL,
  clientIp: string
): Promise<{
  allowed: boolean;
  blocked: boolean;
  reason?: string;
  attackLog?: AttackLog;
  incidentId?: string;
}> {
  state.totalRequests++;

  if (!state.settings.enabled) {
    return { allowed: true, blocked: false };
  }

  // 1. Check if IP is already banned
  const banStatus = isIpBanned(clientIp);
  if (banStatus.banned && banStatus.record) {
    state.attacksBlocked++;
    return {
      allowed: false,
      blocked: true,
      reason: banStatus.record.reason,
      incidentId: banStatus.record.incidentId
    };
  }

  // Whitelisted IPs skip deep threat inspection
  if (isWhitelisted(clientIp)) {
    return { allowed: true, blocked: false };
  }

  const rawPath = url.pathname;
  const rawSearch = url.search;
  const fullTarget = rawPath + rawSearch;
  const userAgent = request.headers.get('user-agent') || '';
  const method = request.method;

  // 2. Inspect Path Traversal & Sensitive File Probes
  for (const regex of SIGNATURES.PATH_TRAVERSAL) {
    if (regex.test(fullTarget) || regex.test(decodeURIComponent(fullTarget))) {
      const log = recordAttack({
        ip: clientIp,
        method,
        path: rawPath,
        attackType: 'PATH_TRAVERSAL',
        severity: 'CRITICAL',
        threatScore: 80,
        details: 'Tentativa de Path Traversal / Acesso a arquivo confidencial detectada',
        payloadSnippet: fullTarget,
        userAgent
      });
      return {
        allowed: false,
        blocked: true,
        reason: 'Tentativa de navegação em diretório confidencial bloqueada',
        attackLog: log,
        incidentId: log.id
      };
    }
  }

  // 3. Inspect Malicious Web Scanners / Probes (e.g. wp-login, phpmyadmin)
  for (const regex of SIGNATURES.PROBES) {
    if (regex.test(rawPath)) {
      const log = recordAttack({
        ip: clientIp,
        method,
        path: rawPath,
        attackType: 'MALICIOUS_SCANNER',
        severity: 'HIGH',
        threatScore: 60,
        details: 'Varredura de vulnerabilidade ou rota suspeita de CMS/Admin',
        payloadSnippet: rawPath,
        userAgent
      });
      return {
        allowed: false,
        blocked: true,
        reason: 'Varredura não autorizada de serviços detectada',
        attackLog: log,
        incidentId: log.id
      };
    }
  }

  // 4. Inspect SQL Injection in URL query params
  if (rawSearch) {
    const decodedSearch = decodeURIComponent(rawSearch);
    for (const regex of SIGNATURES.SQLI) {
      if (regex.test(decodedSearch)) {
        const log = recordAttack({
          ip: clientIp,
          method,
          path: rawPath,
          attackType: 'SQL_INJECTION',
          severity: 'CRITICAL',
          threatScore: 90,
          details: 'Assinatura de injeção SQL encontrada nos parâmetros da requisição',
          payloadSnippet: rawSearch,
          userAgent
        });
        return {
          allowed: false,
          blocked: true,
          reason: 'Padrão malicioso de Injeção SQL identificado',
          attackLog: log,
          incidentId: log.id
        };
      }
    }

    // 5. Inspect XSS in URL query params
    for (const regex of SIGNATURES.XSS) {
      if (regex.test(decodedSearch)) {
        const log = recordAttack({
          ip: clientIp,
          method,
          path: rawPath,
          attackType: 'XSS',
          severity: 'HIGH',
          threatScore: 70,
          details: 'Payload de Cross-Site Scripting (XSS) detectado na URL',
          payloadSnippet: rawSearch,
          userAgent
        });
        return {
          allowed: false,
          blocked: true,
          reason: 'Script malicioso (XSS) bloqueado pelo filtro de segurança',
          attackLog: log,
          incidentId: log.id
        };
      }
    }
  }

  // 6. Inspect Malicious User-Agent
  if (userAgent) {
    for (const regex of SIGNATURES.BAD_USER_AGENTS) {
      if (regex.test(userAgent)) {
        // High threat if using automated attack tool
        const log = recordAttack({
          ip: clientIp,
          method,
          path: rawPath,
          attackType: 'BAD_USER_AGENT',
          severity: 'HIGH',
          threatScore: 50,
          details: `User-Agent de ferramenta de ataque ou scanner automatizado: "${userAgent}"`,
          userAgent
        });
        if (state.threatScores.get(clientIp)?.score! >= state.settings.autoBanThreshold) {
          return {
            allowed: false,
            blocked: true,
            reason: 'User-Agent identificado em lista negra de ferramentas maliciosas',
            attackLog: log,
            incidentId: log.id
          };
        }
      }
    }
  }

  return { allowed: true, blocked: false };
}

// Compute DEFCON & Health
export function getSecurityStats(): SecurityStats {
  const activeBans = Array.from(state.bannedIps.values()).filter(
    b => !b.expiresAt || b.expiresAt > Date.now()
  );

  const threatDist: Record<string, number> = {};
  const sevDist: Record<string, number> = {};

  for (const log of state.logs) {
    threatDist[log.attackType] = (threatDist[log.attackType] || 0) + 1;
    sevDist[log.severity] = (sevDist[log.severity] || 0) + 1;
  }

  // Calculate DEFCON: 5 (Green/Normal) to 1 (Red/Under heavy attack)
  const now = Date.now();
  const recentAttacks10m = state.logs.filter(l => now - l.timestamp < 10 * 60 * 1000).length;
  
  let defcon = 5;
  let health: SecurityStats['systemHealth'] = 'OPTIMAL';

  if (recentAttacks10m > 50 || activeBans.length > 20) {
    defcon = 1;
    health = 'DEFCON_1';
  } else if (recentAttacks10m > 20 || activeBans.length > 10) {
    defcon = 2;
    health = 'UNDER_ATTACK';
  } else if (recentAttacks10m > 5 || activeBans.length > 0) {
    defcon = 3;
    health = 'ELEVATED_THREAT';
  } else if (recentAttacks10m > 0) {
    defcon = 4;
    health = 'OPTIMAL';
  }

  return {
    totalRequests: state.totalRequests,
    attacksDetected: state.attacksDetected,
    attacksBlocked: state.attacksBlocked,
    activeBansCount: activeBans.length,
    threatDistribution: threatDist,
    severityDistribution: sevDist,
    defconLevel: defcon,
    systemHealth: health,
    lastAttackTimestamp: state.lastAttackTimestamp || undefined
  };
}

// Get Logs with filtering
export function getAttackLogs(limit: number = 100, filterType?: string, filterSeverity?: string): AttackLog[] {
  let list = [...state.logs].reverse();
  if (filterType && filterType !== 'ALL') {
    list = list.filter(l => l.attackType === filterType);
  }
  if (filterSeverity && filterSeverity !== 'ALL') {
    list = list.filter(l => l.severity === filterSeverity);
  }
  return list.slice(0, limit);
}

// Get active bans
export function getBannedIps(): BannedIpRecord[] {
  const now = Date.now();
  return Array.from(state.bannedIps.values())
    .filter(b => !b.expiresAt || b.expiresAt > now)
    .sort((a, b) => b.bannedAt - a.bannedAt);
}

// Get Whitelist
export function getWhitelist(): WhitelistRecord[] {
  return Array.from(state.whitelist.values()).sort((a, b) => b.addedAt - a.addedAt);
}

// Settings
export function getSecuritySettings(): SecuritySettings {
  return { ...state.settings };
}

export function updateSecuritySettings(newSettings: Partial<SecuritySettings>): SecuritySettings {
  state.settings = { ...state.settings, ...newSettings };
  saveStateDebounced();
  return { ...state.settings };
}

// Clear Logs
export function clearAttackLogs(): void {
  state.logs = [];
  state.attacksDetected = 0;
  state.attacksBlocked = 0;
  saveStateDebounced();
}

// Render Cyber Defense 403 HTML Shield Page
export function renderBlockPage(
  ip: string,
  incidentId: string = 'INC-SECURITY-01',
  reason: string = 'Acesso bloqueado por diretrizes do Firewall de Proteção da Plataforma',
  expiresAt?: number | null
): Response {
  const expirationText = expiresAt
    ? `Expiração automática do ban: ${new Date(expiresAt).toLocaleString('pt-BR')}`
    : 'Bloqueio contínuo e permanente até liberação pelo administrador.';

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>403 - Acesso Negado | Mindflix Shield</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at center, #0f0c1b 0%, #050409 100%);
      color: #e2e8f0;
      font-family: 'Space Grotesk', -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(239, 68, 68, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(239, 68, 68, 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
    .glow {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0) 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      filter: blur(40px);
      pointer-events: none;
    }
    .card {
      position: relative;
      background: rgba(15, 12, 27, 0.85);
      border: 1px solid rgba(239, 68, 68, 0.35);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 580px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(239, 68, 68, 0.15);
      text-align: center;
    }
    .shield-icon {
      width: 72px;
      height: 72px;
      margin: 0 auto 1.5rem;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.3));
      border: 2px solid #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ef4444;
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
      animation: pulse 2s infinite ease-in-out;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }
      50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(239, 68, 68, 0.7); }
    }
    .badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.85rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }
    p.desc {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1.75rem;
    }
    .terminal-box {
      background: #090810;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 1.25rem;
      text-align: left;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.825rem;
      color: #cbd5e1;
      margin-bottom: 1.75rem;
    }
    .terminal-row {
      display: flex;
      justify-content: space-between;
      padding: 0.35rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .terminal-row:last-child { border-bottom: none; }
    .label { color: #64748b; }
    .val { color: #f87171; font-weight: 600; word-break: break-all; }
    .footer-note {
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="grid-overlay"></div>
  <div class="glow"></div>
  <div class="card">
    <div class="shield-icon">
      <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-11a9 9 0 00-9 9c0 5.523 4.477 10 9 10s9-4.477 9-10a9 9 0 00-9-9z" />
      </svg>
    </div>
    <div class="badge">MINDFLIX CYBER SHIELD • IPS ACTIVE</div>
    <h1>403 • Acesso Bloqueado</h1>
    <p class="desc">Sua conexão foi temporariamente interrompida pelo Sistema de Prevenção de Intrusão (IPS) após a identificação de tráfego incompatível com as políticas de segurança da plataforma.</p>
    
    <div class="terminal-box">
      <div class="terminal-row">
        <span class="label">IP de Origem:</span>
        <span class="val">${ip}</span>
      </div>
      <div class="terminal-row">
        <span class="label">Protocolo de Incidente:</span>
        <span class="val">${incidentId}</span>
      </div>
      <div class="terminal-row">
        <span class="label">Motivo do Bloqueio:</span>
        <span class="val">${reason}</span>
      </div>
      <div class="terminal-row">
        <span class="label">Status:</span>
        <span class="val" style="color: #fbbf24;">${expirationText}</span>
      </div>
    </div>

    <div class="footer-note">
      Se você acredita que este bloqueio foi indevido, entre em contato com o suporte técnico informando o seu Protocolo de Incidente.
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 403,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Security-Incident': incidentId
    }
  });
}
