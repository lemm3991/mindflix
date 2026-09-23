import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { r as clearAttackLogs, s as getSecurityStats } from "./security-monitor_D7OEO-U_.mjs";
//#region src/pages/api/security/clear-logs.ts
var clear_logs_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async () => {
	try {
		clearAttackLogs();
		return new Response(JSON.stringify({
			success: true,
			message: "Histórico de eventos e telemetria de ataques limpos com sucesso.",
			stats: getSecurityStats(),
			logs: []
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message || "Erro ao limpar logs de ataques."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/security/clear-logs@_@ts
var page = () => clear_logs_exports;
//#endregion
export { page };
