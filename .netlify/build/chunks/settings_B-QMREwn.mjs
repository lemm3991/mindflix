import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { g as updateSecuritySettings, o as getSecuritySettings } from "./security-monitor_D7OEO-U_.mjs";
//#region src/pages/api/security/settings.ts
var settings_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var GET = async () => {
	try {
		const settings = getSecuritySettings();
		return new Response(JSON.stringify({
			success: true,
			settings
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message || "Erro ao obter configurações."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var POST = async ({ request }) => {
	try {
		const body = await request.json();
		const updated = updateSecuritySettings(body);
		return new Response(JSON.stringify({
			success: true,
			message: "Configurações do IPS atualizadas com sucesso.",
			settings: updated
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message || "Erro ao atualizar configurações."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/security/settings@_@ts
var page = () => settings_exports;
//#endregion
export { page };
