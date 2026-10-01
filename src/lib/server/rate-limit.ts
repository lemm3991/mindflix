// src/lib/server/rate-limit.ts - Production Multi-Tier Anti-Abuse & Rate Limiter
// Supports Upstash Redis REST API with automatic in-memory sliding window fallback

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  lockoutDurationMs?: number;
  errorMessage?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds: number;
}

export const RATE_LIMIT_PROFILES = {
  // Authentication & Brute Force Prevention (5 attempts per 15 minutes)
  AUTH_LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    lockoutDurationMs: 15 * 60 * 1000,
    errorMessage: 'Muitas tentativas de login incorretas. Por segurança, tente novamente mais tarde.'
  },
  AUTH_PASSWORD_CHANGE: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    lockoutDurationMs: 15 * 60 * 1000,
    errorMessage: 'Muitas tentativas de alteração de senha. Tente novamente mais tarde.'
  },

  // AI & Heavy Token Generation (Protects Google Gemini API & Compute)
  AI_CHALLENGES: {
    maxAttempts: 20,
    windowMs: 60 * 1000, // 20 requests/min
    lockoutDurationMs: 60 * 1000,
    errorMessage: 'Limite de geração de desafios de IA atingido. Aguarde 1 minuto.'
  },
  AI_SEARCH: {
    maxAttempts: 30,
    windowMs: 60 * 1000, // 30 requests/min
    lockoutDurationMs: 60 * 1000,
    errorMessage: 'Limite de consultas semânticas de IA atingido. Aguarde 1 minuto.'
  },

  // Library & Catalog Management
  LIBRARY_SCAN: {
    maxAttempts: 4,
    windowMs: 10 * 60 * 1000, // 4 scans per 10 minutes
    lockoutDurationMs: 10 * 60 * 1000,
    errorMessage: 'Varredura da biblioteca em processamento ou limite atingido. Aguarde 10 minutos.'
  },
  LIBRARY_UPDATE: {
    maxAttempts: 40,
    windowMs: 60 * 1000, // 40 updates per minute
    lockoutDurationMs: 60 * 1000,
    errorMessage: 'Muitas atualizações no catálogo. Aguarde um instante.'
  },
  LIBRARY_BACKUP: {
    maxAttempts: 8,
    windowMs: 5 * 60 * 1000, // 8 backups per 5 minutes
    lockoutDurationMs: 5 * 60 * 1000,
    errorMessage: 'Limite de operações de backup atingido. Aguarde alguns minutos.'
  },

  // Video Streaming & Chunk Delivery (180 requests/min per IP)
  VIDEO_STREAM: {
    maxAttempts: 180,
    windowMs: 60 * 1000,
    lockoutDurationMs: 30 * 1000,
    errorMessage: 'Limite de requisições de mídia simultâneas atingido. Aguarde alguns segundos.'
  },

  // General API & Public Endpoints (100 requests/min)
  GLOBAL_API: {
    maxAttempts: 100,
    windowMs: 60 * 1000,
    lockoutDurationMs: 60 * 1000,
    errorMessage: 'Limite de requisições da API excedido. Por favor, diminua o ritmo.'
  }
} as const satisfies Record<string, RateLimitConfig>;

interface MemoryRecord {
  timestamps: number[];
  lockedUntil?: number;
}

const memoryStore = new Map<string, MemoryRecord>();

// Cleanup stale memory records every 60 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.lockedUntil && record.lockedUntil > now) continue;
      record.timestamps = record.timestamps.filter(ts => now - ts < 3600000);
      if (record.timestamps.length === 0) {
        memoryStore.delete(key);
      }
    }
  }, 60000).unref?.();
}

// Check Upstash Redis configuration
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const HAS_UPSTASH = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

/**
 * Executes rate limit check via Upstash Redis REST API with 250ms timeout
 */
async function checkUpstashRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult | null> {
  if (!HAS_UPSTASH) return null;

  try {
    const windowSeconds = Math.ceil(config.windowMs / 1000);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 250);

    // Redis Pipeline: INCR + TTL (Atomic)
    const pipelineUrl = `${UPSTASH_URL}/pipeline`;
    const res = await fetch(pipelineUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ['INCR', `ratelimit:${key}`],
        ['EXPIRE', `ratelimit:${key}`, windowSeconds]
      ]),
      signal: controller.signal
    });

    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    const count = Number(data[0]?.result || 1);
    const remaining = Math.max(0, config.maxAttempts - count);
    const resetSeconds = windowSeconds;

    if (count > config.maxAttempts) {
      return {
        allowed: false,
        limit: config.maxAttempts,
        remaining: 0,
        resetSeconds,
        retryAfterSeconds: resetSeconds
      };
    }

    return {
      allowed: true,
      limit: config.maxAttempts,
      remaining,
      resetSeconds,
      retryAfterSeconds: 0
    };
  } catch (err) {
    // Graceful fallback to in-memory on timeout or network error
    return null;
  }
}

/**
 * In-memory sliding window rate limiter
 */
function checkMemoryRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  let record = memoryStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Check lockout
  if (record.lockedUntil && record.lockedUntil > now) {
    const resetSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      allowed: false,
      limit: config.maxAttempts,
      remaining: 0,
      resetSeconds,
      retryAfterSeconds: resetSeconds
    };
  }

  // Filter timestamps within sliding window
  record.timestamps = record.timestamps.filter(ts => now - ts < config.windowMs);

  if (record.timestamps.length >= config.maxAttempts) {
    const lockoutMs = config.lockoutDurationMs || config.windowMs;
    record.lockedUntil = now + lockoutMs;
    const resetSeconds = Math.ceil(lockoutMs / 1000);
    return {
      allowed: false,
      limit: config.maxAttempts,
      remaining: 0,
      resetSeconds,
      retryAfterSeconds: resetSeconds
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, config.maxAttempts - record.timestamps.length);
  const oldest = record.timestamps[0];
  const resetSeconds = Math.max(1, Math.ceil((oldest + config.windowMs - now) / 1000));

  return {
    allowed: true,
    limit: config.maxAttempts,
    remaining,
    resetSeconds,
    retryAfterSeconds: 0
  };
}

/**
 * Unified Rate Limit Check (Redis if available, else in-memory)
 */
export async function checkRateLimitAsync(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redisResult = await checkUpstashRateLimit(key, config);
  if (redisResult !== null) return redisResult;
  return checkMemoryRateLimit(key, config);
}

/**
 * Synchronous in-memory rate limit check
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000,
  lockoutDurationMs: number = 15 * 60 * 1000
): RateLimitResult {
  return checkMemoryRateLimit(key, { maxAttempts, windowMs, lockoutDurationMs });
}

export function resetRateLimit(key: string): void {
  memoryStore.delete(key);
}

/**
 * Extracts real client IP safely across cloud providers (Vercel, Cloudflare, AWS)
 */
export function getClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return '127.0.0.1';
}

/**
 * Builds standard composite identifier (IP + optional User ID)
 */
export function buildRateLimitKey(
  profileName: string,
  request: Request,
  userId?: string
): string {
  const ip = getClientIp(request);
  return userId ? `${profileName}:ip_${ip}:uid_${userId}` : `${profileName}:ip_${ip}`;
}

/**
 * Standard 429 Too Many Requests response builder
 */
export function createRateLimitResponse(
  result: RateLimitResult,
  customMessage?: string
): Response {
  const message = customMessage || 'Muitas requisições. Por favor, aguarde alguns instantes.';
  const retryAfter = Math.max(1, result.retryAfterSeconds || result.resetSeconds);

  return new Response(JSON.stringify({
    error: message,
    statusCode: 429,
    retryAfterSeconds: retryAfter,
    limit: result.limit,
    remaining: result.remaining,
    resetInSeconds: result.resetSeconds
  }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Retry-After': retryAfter.toString(),
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.resetSeconds.toString()
    }
  });
}

/**
 * Injects rate limit headers into an existing Response
 */
export function injectRateLimitHeaders(
  res: Response,
  result: RateLimitResult
): Response {
  res.headers.set('X-RateLimit-Limit', result.limit.toString());
  res.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  res.headers.set('X-RateLimit-Reset', result.resetSeconds.toString());
  return res;
}
