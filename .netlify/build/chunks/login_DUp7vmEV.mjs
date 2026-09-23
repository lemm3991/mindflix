import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as verifyCredentials, n as SESSION_MAX_AGE_SECONDS, r as createSessionToken, t as COOKIE_NAME } from "./auth_CCtkdeAP.mjs";
import { a as createRateLimitResponse, i as checkRateLimitAsync, n as buildRateLimitKey, s as resetRateLimit, t as RATE_LIMIT_PROFILES } from "./rate-limit_BV6tTH9A.mjs";
//#region src/pages/api/auth/login.ts
var login_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies }) => {
	const rateLimitKey = buildRateLimitKey("auth_login", request);
	const rateCheck = await checkRateLimitAsync(rateLimitKey, RATE_LIMIT_PROFILES.AUTH_LOGIN);
	if (!rateCheck.allowed) return createRateLimitResponse(rateCheck, RATE_LIMIT_PROFILES.AUTH_LOGIN.errorMessage);
	try {
		const body = await request.json().catch(() => ({}));
		const username = (body.username || "").trim();
		const password = (body.password || "").trim();
		if (!username || !password) return new Response(JSON.stringify({ error: "Informe o usuário e a senha." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const { success, user } = await verifyCredentials(username, password);
		if (!success || !user) return new Response(JSON.stringify({
			error: "Nome de usuário ou senha incorretos.",
			remainingAttempts: rateCheck.remaining
		}), {
			status: 401,
			headers: { "Content-Type": "application/json" }
		});
		resetRateLimit(rateLimitKey);
		const token = createSessionToken(user);
		cookies.set(COOKIE_NAME, token, {
			path: "/",
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			maxAge: SESSION_MAX_AGE_SECONDS
		});
		return new Response(JSON.stringify({
			success: true,
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				full_name: user.name
			}
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: "Erro interno ao autenticar." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/login@_@ts
var page = () => login_exports;
//#endregion
export { page };
