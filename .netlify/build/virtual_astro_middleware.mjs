import { St as defineMiddleware, t as sequence } from "./chunks/sequence_BzZU-fGI.mjs";
import { o as verifySessionToken, t as COOKIE_NAME } from "./chunks/auth_CCtkdeAP.mjs";
import { a as createRateLimitResponse, i as checkRateLimitAsync, n as buildRateLimitKey, o as getClientIp, t as RATE_LIMIT_PROFILES } from "./chunks/rate-limit_BV6tTH9A.mjs";
import { l as inspectRequest, m as renderBlockPage, u as isIpBanned } from "./chunks/security-monitor_D7OEO-U_.mjs";
//#region src/middleware.ts
var PUBLIC_ROUTES = [
	"/login",
	"/register",
	"/api/auth/login",
	"/api/auth/logout",
	"/favicon.svg"
];
var onRequest$1 = defineMiddleware(async (context, next) => {
	const { url, request, cookies, redirect } = context;
	const pathname = url.pathname;
	const clientIp = getClientIp(request);
	const banStatus = isIpBanned(clientIp);
	if (banStatus.banned && banStatus.record) {
		if (pathname.startsWith("/api/")) return new Response(JSON.stringify({
			error: "Acesso bloqueado pelo Sistema de Prevenção de Intrusão (IPS).",
			incidentId: banStatus.record.incidentId,
			reason: banStatus.record.reason,
			expiresAt: banStatus.record.expiresAt
		}), {
			status: 403,
			headers: { "Content-Type": "application/json; charset=utf-8" }
		});
		return renderBlockPage(clientIp, banStatus.record.incidentId, banStatus.record.reason, banStatus.record.expiresAt);
	}
	const inspection = await inspectRequest(request, url, clientIp);
	if (inspection.blocked) {
		if (pathname.startsWith("/api/")) return new Response(JSON.stringify({
			error: inspection.reason || "Requisição maliciosa bloqueada pelo Firewall/IPS.",
			incidentId: inspection.incidentId || "INC-THREAT-BLOCKED"
		}), {
			status: 403,
			headers: { "Content-Type": "application/json; charset=utf-8" }
		});
		return renderBlockPage(clientIp, inspection.incidentId || "INC-THREAT-BLOCKED", inspection.reason || "Padrão de ataque identificado e neutralizado.");
	}
	if (pathname.startsWith("/_astro") || pathname.startsWith("/_image") || pathname.startsWith("/fonts") || pathname.startsWith("/images") || pathname === "/favicon.svg") return next();
	const sessionToken = cookies.get(COOKIE_NAME)?.value;
	const session = verifySessionToken(sessionToken);
	const userId = session?.uid;
	if (pathname.startsWith("/api/")) {
		if (pathname.startsWith("/api/challenges/generate")) {
			const key = buildRateLimitKey("ai_challenges", request, userId);
			const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.AI_CHALLENGES);
			if (!limitRes.allowed) return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.AI_CHALLENGES.errorMessage);
		} else if (pathname.startsWith("/api/search/ai")) {
			const key = buildRateLimitKey("ai_search", request, userId);
			const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.AI_SEARCH);
			if (!limitRes.allowed) return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.AI_SEARCH.errorMessage);
		} else if (pathname.startsWith("/api/library/scan")) {
			const key = buildRateLimitKey("library_scan", request, userId);
			const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.LIBRARY_SCAN);
			if (!limitRes.allowed) return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.LIBRARY_SCAN.errorMessage);
		} else if (pathname.startsWith("/api/library/backup")) {
			const key = buildRateLimitKey("library_backup", request, userId);
			const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.LIBRARY_BACKUP);
			if (!limitRes.allowed) return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.LIBRARY_BACKUP.errorMessage);
		} else if (pathname.startsWith("/api/library")) {
			const key = buildRateLimitKey("library_update", request, userId);
			const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.LIBRARY_UPDATE);
			if (!limitRes.allowed) return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.LIBRARY_UPDATE.errorMessage);
		} else if (pathname.startsWith("/api/video")) {
			const key = buildRateLimitKey("video_stream", request, userId);
			const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.VIDEO_STREAM);
			if (!limitRes.allowed) return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.VIDEO_STREAM.errorMessage);
		} else if (pathname.startsWith("/api/auth/change-password")) {
			const key = buildRateLimitKey("auth_pass_change", request, userId);
			const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.AUTH_PASSWORD_CHANGE);
			if (!limitRes.allowed) return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.AUTH_PASSWORD_CHANGE.errorMessage);
		} else if (!pathname.startsWith("/api/auth/login")) {
			const key = buildRateLimitKey("global_api", request, userId);
			const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.GLOBAL_API);
			if (!limitRes.allowed) return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.GLOBAL_API.errorMessage);
		}
	}
	if (pathname === "/register") return redirect("/login");
	if (PUBLIC_ROUTES.includes(pathname)) {
		if (pathname === "/login" && session) return redirect("/");
		return next();
	}
	if (!session) {
		if (pathname.startsWith("/api/")) return new Response(JSON.stringify({
			error: "Acesso não autorizado. Faça login para continuar.",
			authenticated: false
		}), {
			status: 401,
			headers: { "Content-Type": "application/json; charset=utf-8" }
		});
		return redirect("/login?redirect=" + encodeURIComponent(pathname + url.search));
	}
	context.locals.user = session;
	return await next();
});
//#endregion
//#region \0virtual:astro:middleware
var onRequest = sequence(onRequest$1);
//#endregion
export { onRequest };
