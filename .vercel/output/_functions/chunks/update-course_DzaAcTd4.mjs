import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import fs from "node:fs";
import nodePath from "node:path";
//#region src/pages/api/library/update-course.ts
var update_course_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var OVERRIDES_PATH = nodePath.resolve(process.cwd(), "src", "data", "manual_overrides.json");
var CATALOG_PATH = nodePath.resolve(process.cwd(), "src", "data", "catalog.json");
var POST = async ({ request }) => {
	try {
		const body = await request.json();
		const courseId = body.courseId || body.course_id;
		const { display_title, description, provider, categories, tags, is_hidden, is_featured, cover_image } = body;
		if (!courseId) return new Response(JSON.stringify({ error: "courseId ou course_id é obrigatório." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		let overrides = {};
		if (fs.existsSync(OVERRIDES_PATH)) try {
			overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf-8"));
		} catch {
			overrides = {};
		}
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
		fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2), "utf-8");
		if (fs.existsSync(CATALOG_PATH)) try {
			const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8"));
			const course = catalog.courses?.find((c) => c.id === courseId);
			if (course) {
				if (display_title) course.display_title = display_title.trim();
				if (description) course.description = description.trim();
				if (provider) course.provider = provider.trim();
				if (categories) course.categories = categories;
				if (tags) course.tags = tags;
				if (is_hidden !== void 0) course.is_hidden = Boolean(is_hidden);
				if (is_featured !== void 0) course.is_featured = Boolean(is_featured);
				if (cover_image) course.cover_image = cover_image;
				course.classification_source = "manual";
				fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf-8");
			}
		} catch (err) {
			console.warn("Could not hot-patch catalog.json:", err);
		}
		return new Response(JSON.stringify({
			success: true,
			courseId,
			overrides: overrides[courseId]
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
