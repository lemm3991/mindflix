import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import fs from "node:fs";
import nodePath from "node:path";
import { exec } from "node:child_process";
//#region src/pages/api/library/scan.ts
var scan_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var SCRIPT_PATH = nodePath.resolve(process.cwd(), "scan_library.py");
var SUMMARY_PATH = nodePath.resolve(process.cwd(), "src", "data", "catalog_summary.json");
var POST = async ({ request }) => {
	try {
		let body = {};
		try {
			body = await request.json();
		} catch {
			body = {};
		}
		const dryRun = body.dry_run !== false;
		const customRoot = body.root ? ` --root "${body.root}"` : "";
		const cmd = `python "${SCRIPT_PATH}" ${dryRun ? "--dry-run" : "--apply"}${customRoot}`;
		return new Promise((resolve) => {
			exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
				if (error) return resolve(new Response(JSON.stringify({
					error: error.message,
					stderr: stderr.toString()
				}), {
					status: 500,
					headers: { "Content-Type": "application/json" }
				}));
				let summary = null;
				if (fs.existsSync(SUMMARY_PATH)) try {
					summary = JSON.parse(fs.readFileSync(SUMMARY_PATH, "utf-8"));
				} catch {}
				return resolve(new Response(JSON.stringify({
					success: true,
					dry_run: dryRun,
					output: stdout.toString(),
					summary: summary || {
						status: "completed",
						dry_run: dryRun,
						scanned_at: (/* @__PURE__ */ new Date()).toISOString()
					}
				}), {
					status: 200,
					headers: { "Content-Type": "application/json" }
				}));
			});
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err?.message || "Falha ao executar scanner." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/library/scan@_@ts
var page = () => scan_exports;
//#endregion
export { page };
