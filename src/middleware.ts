import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken, COOKIE_NAME } from './lib/server/auth';
import {
  checkRateLimitAsync,
  buildRateLimitKey,
  createRateLimitResponse,
  injectRateLimitHeaders,
  getClientIp,
  RATE_LIMIT_PROFILES
} from './lib/server/rate-limit';
import {
  inspectRequest,
  isIpBanned,
  renderBlockPage
} from './lib/server/security-monitor';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/logout',
  '/favicon.svg'
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, cookies, redirect } = context;
  const pathname = url.pathname;

  // 0. Extract client IP & Cyber Threat Defense Guard (IPS Interceptor)
  const clientIp = getClientIp(request);

  // Check if IP is currently banned
  const banStatus = isIpBanned(clientIp);
  if (banStatus.banned && banStatus.record) {
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        error: 'Acesso bloqueado pelo Sistema de Prevenção de Intrusão (IPS).',
        incidentId: banStatus.record.incidentId,
        reason: banStatus.record.reason,
        expiresAt: banStatus.record.expiresAt
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    return renderBlockPage(
      clientIp,
      banStatus.record.incidentId,
      banStatus.record.reason,
      banStatus.record.expiresAt
    );
  }

  // Deep threat inspection (SQLi, XSS, Path Traversal, Scanners, Suspicious Payloads)
  const inspection = await inspectRequest(request, url, clientIp);
  if (inspection.blocked) {
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        error: inspection.reason || 'Requisição maliciosa bloqueada pelo Firewall/IPS.',
        incidentId: inspection.incidentId || 'INC-THREAT-BLOCKED'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    return renderBlockPage(
      clientIp,
      inspection.incidentId || 'INC-THREAT-BLOCKED',
      inspection.reason || 'Padrão de ataque identificado e neutralizado.'
    );
  }

  // 1. Allow public static assets and system bundles immediately
  if (
    pathname.startsWith('/_astro') ||
    pathname.startsWith('/_image') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.svg'
  ) {
    return next();
  }

  // 2. Extract and verify session token
  const sessionToken = cookies.get(COOKIE_NAME)?.value;
  const session = verifySessionToken(sessionToken);
  const userId = session?.uid;

  // 3. Multi-tier API rate limiting & anti-abuse guards
  if (pathname.startsWith('/api/')) {
    // A. AI Challenges Generation
    if (pathname.startsWith('/api/challenges/generate')) {
      const key = buildRateLimitKey('ai_challenges', request, userId);
      const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.AI_CHALLENGES);
      if (!limitRes.allowed) {
        return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.AI_CHALLENGES.errorMessage);
      }
    }
    // B. AI Semantic Search
    else if (pathname.startsWith('/api/search/ai')) {
      const key = buildRateLimitKey('ai_search', request, userId);
      const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.AI_SEARCH);
      if (!limitRes.allowed) {
        return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.AI_SEARCH.errorMessage);
      }
    }
    // C. Library Scan (Heavy Subprocess)
    else if (pathname.startsWith('/api/library/scan')) {
      const key = buildRateLimitKey('library_scan', request, userId);
      const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.LIBRARY_SCAN);
      if (!limitRes.allowed) {
        return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.LIBRARY_SCAN.errorMessage);
      }
    }
    // D. Library Catalog Backup
    else if (pathname.startsWith('/api/library/backup')) {
      const key = buildRateLimitKey('library_backup', request, userId);
      const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.LIBRARY_BACKUP);
      if (!limitRes.allowed) {
        return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.LIBRARY_BACKUP.errorMessage);
      }
    }
    // E. Library Course & Category Updates
    else if (pathname.startsWith('/api/library')) {
      const key = buildRateLimitKey('library_update', request, userId);
      const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.LIBRARY_UPDATE);
      if (!limitRes.allowed) {
        return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.LIBRARY_UPDATE.errorMessage);
      }
    }
    // F. Video Streaming & Media Chunks
    else if (pathname.startsWith('/api/video')) {
      const key = buildRateLimitKey('video_stream', request, userId);
      const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.VIDEO_STREAM);
      if (!limitRes.allowed) {
        return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.VIDEO_STREAM.errorMessage);
      }
    }
    // G. Password Change
    else if (pathname.startsWith('/api/auth/change-password')) {
      const key = buildRateLimitKey('auth_pass_change', request, userId);
      const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.AUTH_PASSWORD_CHANGE);
      if (!limitRes.allowed) {
        return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.AUTH_PASSWORD_CHANGE.errorMessage);
      }
    }
    // H. General API Endpoints
    else if (!pathname.startsWith('/api/auth/login')) {
      const key = buildRateLimitKey('global_api', request, userId);
      const limitRes = await checkRateLimitAsync(key, RATE_LIMIT_PROFILES.GLOBAL_API);
      if (!limitRes.allowed) {
        return createRateLimitResponse(limitRes, RATE_LIMIT_PROFILES.GLOBAL_API.errorMessage);
      }
    }
  }

  // 4. Registration route protection (Spam prevention)
  if (pathname === '/register') {
    return redirect('/login');
  }

  // 5. Allow public login routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    // If already authenticated and trying to access /login, redirect to home
    if (pathname === '/login' && session) {
      return redirect('/');
    }
    return next();
  }

  // 6. Enforce Authentication on All Protected Routes & APIs
  if (!session) {
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({
        error: 'Acesso não autorizado. Faça login para continuar.',
        authenticated: false
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const redirectUrl = '/login?redirect=' + encodeURIComponent(pathname + url.search);
    return redirect(redirectUrl);
  }

  // Attach verified user to locals
  // @ts-ignore
  context.locals.user = session;

  const response = await next();
  return response;
});
