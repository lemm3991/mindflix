import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as getBannedIps, c as getWhitelist, i as getAttackLogs, o as getSecuritySettings, s as getSecurityStats } from "./security-monitor_D7OEO-U_.mjs";
//#region src/pages/api/security/stats.ts
var stats_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ url }) => {
	try {
		const limit = Number(url.searchParams.get("limit")) || 100;
		const filterType = url.searchParams.get("type") || void 0;
		const filterSeverity = url.searchParams.get("severity") || void 0;
		const stats = getSecurityStats();
		const bans = getBannedIps();
		const whitelist = getWhitelist();
		const logs = getAttackLogs(limit, filterType, filterSeverity);
		const settings = getSecuritySettings();
		return new Response(JSON.stringify({
			success: true,
			stats,
			bans,
			whitelist,
			logs,
			settings,
			timestamp: Date.now()
		}), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Cache-Control": "no-store, max-age=0"
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({
			success: false,
			error: error.message || "Erro ao carregar telemetria de segurança."
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/security/stats@_@ts
var page = () => stats_exports;
//#endregion
export { page };
