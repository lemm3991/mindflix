import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/pages/api/library/backup.ts
var backup_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var PRIMARY_OVERRIDES_PATH = path.resolve(process.cwd(), "src", "data", "manual_overrides.json");
var TMP_OVERRIDES_PATH = path.join(os.tmpdir(), "manual_overrides.json");
var PRIMARY_CATALOG_PATH = path.resolve(process.cwd(), "src", "data", "catalog.json");
var TMP_CATALOG_PATH = path.join(os.tmpdir(), "catalog.json");
function loadJsonSafe(primaryPath, tmpPath) {
	let result = {};
	if (fs.existsSync(primaryPath)) try {
		result = JSON.parse(fs.readFileSync(primaryPath, "utf-8"));
	} catch {}
	if (fs.existsSync(tmpPath)) try {
		const tmpData = JSON.parse(fs.readFileSync(tmpPath, "utf-8"));
		result = {
			...result,
			...tmpData
		};
	} catch {}
	return result;
}
function saveJsonSafe(primaryPath, tmpPath, content) {
	const dataStr = JSON.stringify(content, null, 2);
	try {
		fs.writeFileSync(primaryPath, dataStr, "utf-8");
		return true;
	} catch (err) {
		if (err?.code === "EROFS" || err?.code === "EACCES" || err?.code === "EPERM" || err?.message?.includes("read-only") || err?.message?.includes("EROFS")) try {
			fs.writeFileSync(tmpPath, dataStr, "utf-8");
			return true;
		} catch (tmpErr) {
			console.error("Erro ao escrever no diretório temporário:", tmpErr);
			return false;
		}
		return false;
	}
}
var GET = async () => {
	try {
		const catalog = loadJsonSafe(PRIMARY_CATALOG_PATH, TMP_CATALOG_PATH);
		const overrides = loadJsonSafe(PRIMARY_OVERRIDES_PATH, TMP_OVERRIDES_PATH);
		const backupData = {
			backup_version: "1.0",
			created_at: (/* @__PURE__ */ new Date()).toISOString(),
			overrides,
			catalog
		};
		return new Response(JSON.stringify(backupData, null, 2), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Content-Disposition": "attachment; filename=\"mindflix-catalog-backup.json\""
			}
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err?.message || "Falha ao exportar backup." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var POST = async ({ request }) => {
	try {
		const body = await request.json();
		if (!body || !body.overrides) return new Response(JSON.stringify({ error: "Payload de backup inválido." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		saveJsonSafe(PRIMARY_OVERRIDES_PATH, TMP_OVERRIDES_PATH, body.overrides);
		if (body.catalog && body.catalog.courses) saveJsonSafe(PRIMARY_CATALOG_PATH, TMP_CATALOG_PATH, body.catalog);
		return new Response(JSON.stringify({
			success: true,
			message: "Backup restaurado com sucesso."
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err?.message || "Erro ao restaurar backup." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/library/backup@_@ts
var page = () => backup_exports;
//#endregion
export { page };
