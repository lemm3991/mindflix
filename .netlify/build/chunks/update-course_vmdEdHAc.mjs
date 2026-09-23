import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { s as invalidateCatalogCache } from "./catalog_BH-ygd_W.mjs";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
//#region src/pages/api/library/update-course.ts
var update_course_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
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
		return {
			success: true,
			isReadOnly: false
		};
	} catch (err) {
		if (err?.code === "EROFS" || err?.code === "EACCES" || err?.code === "EPERM" || err?.message?.includes("read-only") || err?.message?.includes("EROFS")) try {
			fs.writeFileSync(tmpPath, dataStr, "utf-8");
			return {
				success: true,
				isReadOnly: true
			};
		} catch (tmpErr) {
			console.error("Erro ao escrever no diretório temporário:", tmpErr);
			return {
				success: false,
				isReadOnly: true
			};
		}
		throw err;
	}
}
var POST = async ({ request }) => {
	try {
		const body = await request.json();
		const courseId = body.courseId || body.course_id;
		const { display_title, description, provider, categories, tags, is_hidden, is_featured, cover_image } = body;
		if (!courseId) return new Response(JSON.stringify({ error: "courseId ou course_id é obrigatório." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		let overrides = loadJsonSafe(PRIMARY_OVERRIDES_PATH, TMP_OVERRIDES_PATH);
		overrides[courseId] = {
			...overrides[courseId] || {},
			...display_title !== void 0 ? { display_title: display_title.trim() } : {},
			...description !== void 0 ? { description: description.trim() } : {},
			...provider !== void 0 ? { provider: provider.trim() } : {},
			...categories !== void 0 ? { categories } : {},
			...tags !== void 0 ? { tags } : {},
			...is_hidden !== void 0 ? { is_hidden: Boolean(is_hidden) } : {},
			...is_featured !== void 0 ? { is_featured: Boolean(is_featured) } : {},
			...cover_image !== void 0 ? { cover_image } : {},
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		const writeRes = saveJsonSafe(PRIMARY_OVERRIDES_PATH, TMP_OVERRIDES_PATH, overrides);
		const catalog = loadJsonSafe(PRIMARY_CATALOG_PATH, TMP_CATALOG_PATH);
		if (catalog && catalog.courses) {
			const course = catalog.courses.find((c) => c.id === courseId);
			if (course) {
				if (display_title !== void 0) course.display_title = display_title.trim();
				if (description !== void 0) course.description = description.trim();
				if (provider !== void 0) course.provider = provider.trim();
				if (categories !== void 0) course.categories = categories;
				if (tags !== void 0) course.tags = tags;
				if (is_hidden !== void 0) course.is_hidden = Boolean(is_hidden);
				if (is_featured !== void 0) course.is_featured = Boolean(is_featured);
				if (cover_image !== void 0) course.cover_image = cover_image;
				course.classification_source = "manual";
				saveJsonSafe(PRIMARY_CATALOG_PATH, TMP_CATALOG_PATH, catalog);
			}
		}
		invalidateCatalogCache();
		return new Response(JSON.stringify({
			success: true,
			courseId,
			overrides: overrides[courseId],
			isReadOnlyEnv: writeRes.isReadOnly
		}), {
			status: 200,
			headers: { "Content-Type": "application/json" }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err?.message || "Falha ao atualizar metadados." }), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/library/update-course@_@ts
var page = () => update_course_exports;
//#endregion
export { page };
