import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as getBannedIps, d as isWhitelisted, h as unbanIp, n as banIp } from "./security-monitor_D7OEO-U_.mjs";
//#region src/pages/api/security/ban.ts
var ban_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	POST: () => POST
});
var POST = async ({ request }) => {
	try {
		const { ip, reason, durationMinutes } = await request.json();
		if (!ip || typeof ip !== "string") return new Response(JSON.stringify({
			success: false,
			error: "Endereço IP inválido ou não informado."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const cleanIp = ip.trim();
		if (isWhitelisted(cleanIp)) return new Response(JSON.stringify({
			success: false,
			error: `O IP ${cleanIp} está na lista de permissões (Whitelist) e não pode ser bloqueado.`
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const duration = durationMinutes !== void 0 ? Number(durationMinutes) : 60;
		const record = banIp(cleanIp, reason || "Bloqueio manual aplicado pelo Administrador", duration, true);
		return new Response(JSON.stringify({
			success: true,
			message: `IP ${cleanIp} foi bloqueado com sucesso.`,
			record,
			bans: getBannedIps()
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message || "Erro ao processar bloqueio de IP."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var DELETE = async ({ request }) => {
	try {
		const { ip } = await request.json();
		if (!ip || typeof ip !== "string") return new Response(JSON.stringify({
			success: false,
			error: "Endereço IP inválido ou não informado."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const cleanIp = ip.trim();
		const unbanned = unbanIp(cleanIp);
		return new Response(JSON.stringify({
			success: true,
			unbanned,
			message: unbanned ? `IP ${cleanIp} foi desbloqueado com sucesso.` : `IP ${cleanIp} não estava na lista de bloqueios ativos.`,
			bans: getBannedIps()
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message || "Erro ao processar desbloqueio de IP."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/security/ban@_@ts
var page = () => ban_exports;
//#endregion
export { page };
