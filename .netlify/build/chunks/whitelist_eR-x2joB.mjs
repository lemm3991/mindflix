import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { c as getWhitelist, p as removeFromWhitelist, t as addToWhitelist } from "./security-monitor_D7OEO-U_.mjs";
//#region src/pages/api/security/whitelist.ts
var whitelist_exports = /* @__PURE__ */ __exportAll({
	DELETE: () => DELETE,
	POST: () => POST
});
var POST = async ({ request }) => {
	try {
		const { ip, note } = await request.json();
		if (!ip || typeof ip !== "string") return new Response(JSON.stringify({
			success: false,
			error: "Endereço IP inválido ou não informado."
		}), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		addToWhitelist(ip.trim(), note);
		return new Response(JSON.stringify({
			success: true,
			message: `IP ${ip.trim()} adicionado à Whitelist.`,
			whitelist: getWhitelist()
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message || "Erro ao adicionar IP à Whitelist."
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
		const removed = removeFromWhitelist(ip.trim());
		return new Response(JSON.stringify({
			success: true,
			removed,
			message: removed ? `IP ${ip.trim()} removido da Whitelist.` : `IP ${ip.trim()} não estava na Whitelist.`,
			whitelist: getWhitelist()
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message || "Erro ao remover IP da Whitelist."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/security/whitelist@_@ts
var page = () => whitelist_exports;
//#endregion
export { page };
