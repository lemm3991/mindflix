//#region src/lib/server/rate-limit.ts
var RATE_LIMIT_PROFILES = {
	AUTH_LOGIN: {
		maxAttempts: 5,
		windowMs: 9e5,
		lockoutDurationMs: 9e5,
		errorMessage: "Muitas tentativas de login incorretas. Por segurança, tente novamente mais tarde."
	},
	AUTH_PASSWORD_CHANGE: {
		maxAttempts: 5,
		windowMs: 9e5,
		lockoutDurationMs: 9e5,
		errorMessage: "Muitas tentativas de alteração de senha. Tente novamente mais tarde."
	},
	AI_CHALLENGES: {
		maxAttempts: 20,
		windowMs: 6e4,
		lockoutDurationMs: 6e4,
		errorMessage: "Limite de geração de desafios de IA atingido. Aguarde 1 minuto."
	},
	AI_SEARCH: {
		maxAttempts: 30,
		windowMs: 6e4,
		lockoutDurationMs: 6e4,
		errorMessage: "Limite de consultas semânticas de IA atingido. Aguarde 1 minuto."
	},
	LIBRARY_SCAN: {
		maxAttempts: 4,
		windowMs: 6e5,
		lockoutDurationMs: 6e5,
		errorMessage: "Varredura da biblioteca em processamento ou limite atingido. Aguarde 10 minutos."
	},
	LIBRARY_UPDATE: {
		maxAttempts: 40,
		windowMs: 6e4,
		lockoutDurationMs: 6e4,
		errorMessage: "Muitas atualizações no catálogo. Aguarde um instante."
	},
	LIBRARY_BACKUP: {
		maxAttempts: 8,
		windowMs: 3e5,
		lockoutDurationMs: 3e5,
		errorMessage: "Limite de operações de backup atingido. Aguarde alguns minutos."
	},
	VIDEO_STREAM: {
		maxAttempts: 180,
		windowMs: 6e4,
		lockoutDurationMs: 3e4,
		errorMessage: "Limite de requisições de mídia simultâneas atingido. Aguarde alguns segundos."
	},
	GLOBAL_API: {
		maxAttempts: 100,
		windowMs: 6e4,
		lockoutDurationMs: 6e4,
		errorMessage: "Limite de requisições da API excedido. Por favor, diminua o ritmo."
	}
};
var memoryStore = /* @__PURE__ */ new Map();
if (typeof setInterval !== "undefined") setInterval(() => {
	const now = Date.now();
	for (const [key, record] of memoryStore.entries()) {
		if (record.lockedUntil && record.lockedUntil > now) continue;
		record.timestamps = record.timestamps.filter((ts) => now - ts < 36e5);
		if (record.timestamps.length === 0) memoryStore.delete(key);
	}
}, 6e4).unref?.();
var UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
var UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
var HAS_UPSTASH = Boolean(UPSTASH_URL && UPSTASH_TOKEN);
/**
* Executes rate limit check via Upstash Redis REST API with 250ms timeout
*/
async function checkUpstashRateLimit(key, config) {
	if (!HAS_UPSTASH) return null;
	try {
		const windowSeconds = Math.ceil(config.windowMs / 1e3);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 250);
		const pipelineUrl = `${UPSTASH_URL}/pipeline`;
		const res = await fetch(pipelineUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${UPSTASH_TOKEN}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify([["INCR", `ratelimit:${key}`], [
				"EXPIRE",
				`ratelimit:${key}`,
				windowSeconds
			]]),
			signal: controller.signal
		});
		clearTimeout(timeout);
		if (!res.ok) return null;
		const data = await res.json();
		const count = Number(data[0]?.result || 1);
		const remaining = Math.max(0, config.maxAttempts - count);
		const resetSeconds = windowSeconds;
		if (count > config.maxAttempts) return {
			allowed: false,
			limit: config.maxAttempts,
			remaining: 0,
			resetSeconds,
			retryAfterSeconds: resetSeconds
		};
		return {
			allowed: true,
			limit: config.maxAttempts,
			remaining,
			resetSeconds,
			retryAfterSeconds: 0
		};
	} catch (err) {
		return null;
	}
}
/**
* In-memory sliding window rate limiter
*/
function checkMemoryRateLimit(key, config) {
	const now = Date.now();
	let record = memoryStore.get(key);
	if (!record) {
		record = { timestamps: [] };
		memoryStore.set(key, record);
	}
	if (record.lockedUntil && record.lockedUntil > now) {
		const resetSeconds = Math.ceil((record.lockedUntil - now) / 1e3);
		return {
			allowed: false,
			limit: config.maxAttempts,
			remaining: 0,
			resetSeconds,
			retryAfterSeconds: resetSeconds
		};
	}
	record.timestamps = record.timestamps.filter((ts) => now - ts < config.windowMs);
	if (record.timestamps.length >= config.maxAttempts) {
		const lockoutMs = config.lockoutDurationMs || config.windowMs;
		record.lockedUntil = now + lockoutMs;
		const resetSeconds = Math.ceil(lockoutMs / 1e3);
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
	const resetSeconds = Math.max(1, Math.ceil((oldest + config.windowMs - now) / 1e3));
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
async function checkRateLimitAsync(key, config) {
	const redisResult = await checkUpstashRateLimit(key, config);
	if (redisResult !== null) return redisResult;
	return checkMemoryRateLimit(key, config);
}
/**
* Synchronous in-memory rate limit check
*/
function checkRateLimit(key, maxAttempts = 5, windowMs = 9e5, lockoutDurationMs = 9e5) {
	return checkMemoryRateLimit(key, {
		maxAttempts,
		windowMs,
		lockoutDurationMs
	});
}
function resetRateLimit(key) {
	memoryStore.delete(key);
}
/**
* Extracts real client IP safely across cloud providers (Vercel, Cloudflare, AWS)
*/
function getClientIp(request) {
	const cfConnectingIp = request.headers.get("cf-connecting-ip");
	if (cfConnectingIp) return cfConnectingIp.trim();
	const xRealIp = request.headers.get("x-real-ip");
	if (xRealIp) return xRealIp.trim();
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0].trim();
	return "127.0.0.1";
}
/**
* Builds standard composite identifier (IP + optional User ID)
*/
function buildRateLimitKey(profileName, request, userId) {
	const ip = getClientIp(request);
	return userId ? `${profileName}:ip_${ip}:uid_${userId}` : `${profileName}:ip_${ip}`;
}
/**
* Standard 429 Too Many Requests response builder
*/
function createRateLimitResponse(result, customMessage) {
	const message = customMessage || "Muitas requisições. Por favor, aguarde alguns instantes.";
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
			"Content-Type": "application/json; charset=utf-8",
			"Retry-After": retryAfter.toString(),
			"X-RateLimit-Limit": result.limit.toString(),
			"X-RateLimit-Remaining": result.remaining.toString(),
			"X-RateLimit-Reset": result.resetSeconds.toString()
		}
	});
}
//#endregion
export { createRateLimitResponse as a, checkRateLimitAsync as i, buildRateLimitKey as n, getClientIp as o, checkRateLimit as r, resetRateLimit as s, RATE_LIMIT_PROFILES as t };
