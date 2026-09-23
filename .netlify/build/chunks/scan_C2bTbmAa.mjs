import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { s as invalidateCatalogCache } from "./catalog_BH-ygd_W.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
//#region src/pages/api/library/scan.ts
var scan_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var SCRIPT_PATH = path.resolve(process.cwd(), "scan_library.py");
var SUMMARY_PATH = path.resolve(process.cwd(), "src", "data", "catalog_summary.json");
var POST = async ({ request }) => {
	try {
		let body = {};
		try {
			body = await request.json();
		} catch {
			body = {};
		}
		const dryRun = body.dry_run !== false;
		const args = [SCRIPT_PATH, dryRun ? "--dry-run" : "--apply"];
		if (body.drive !== false) args.push("--drive");
		else args.push("--no-drive");
		if (body.root && typeof body.root === "string") {
			const sanitizedRoot = path.resolve(body.root.trim());
			if (fs.existsSync(sanitizedRoot)) args.push("--root", sanitizedRoot);
		}
		const venvPythonWin = path.resolve(process.cwd(), ".venv", "Scripts", "python.exe");
		const venvPythonUnix = path.resolve(process.cwd(), ".venv", "bin", "python");
		let pythonBin = "python";
		if (fs.existsSync(venvPythonWin)) pythonBin = venvPythonWin;
		else if (fs.existsSync(venvPythonUnix)) pythonBin = venvPythonUnix;
		return new Promise((resolve) => {
			execFile(pythonBin, args, { cwd: process.cwd() }, (error, stdout, stderr) => {
				if (!dryRun) invalidateCatalogCache();
				if (error) return resolve(new Response(JSON.stringify({
					error: error.message,
					stderr: stderr ? stderr.toString() : ""
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
					output: stdout ? stdout.toString() : "",
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
