import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as updateServerUserPassword, o as verifySessionToken, t as COOKIE_NAME } from "./auth_CCtkdeAP.mjs";
import { o as getClientIp, r as checkRateLimit } from "./rate-limit_BV6tTH9A.mjs";
//#region src/pages/api/auth/change-password.ts
var change_password_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies }) => {
	const rateLimitKey = `pass-change:${getClientIp(request)}`;
	const rateCheck = checkRateLimit(rateLimitKey, 5, 9e5, 9e5);
	if (!rateCheck.allowed) {
		const minutes = Math.ceil(rateCheck.resetSeconds / 60);
		return new Response(JSON.stringify({ error: `Muitas tentativas de alteração de senha. Tente novamente em ${minutes} minuto(s).` }), {
			status: 429,
			headers: { "Content-Type": "application/json" }
		});
	}
	const token = cookies.get(COOKIE_NAME)?.value;
	const session = verifySessionToken(token);
	if (!session) return new Response(JSON.stringify({ error: "Sessão expirada ou não autenticado." }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	try {
		const newPassword = ((await request.json().catch(() => ({}))).newPassword || "").trim();
		if (!newPassword || newPassword.length < 6) return new Response(JSON.stringify({ error: "A nova senha deve possuir no mínimo 6 caracteres." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		if (await updateServerUserPassword(session.username, newPassword)) return new Response(JSON.stringify({
			success: true,
			message: "Senha alterada com sucesso no servidor!"
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
		else return new Response(JSON.stringify({ error: "Falha ao atualizar a senha no servidor." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: "Erro interno ao processar a alteração." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/change-password@_@ts
var page = () => change_password_exports;
//#endregion
export { page };
