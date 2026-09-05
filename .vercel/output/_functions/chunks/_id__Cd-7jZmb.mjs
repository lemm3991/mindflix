import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, w as createAstro } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { t as $$Layout } from "./Layout_B8JHJTFp.mjs";
import { i as getCategoryById, o as getCoursesByCategory } from "./catalog__AHOIgcN.mjs";
import { t as $$CourseCard } from "./CourseCard_DkkDtZi6.mjs";
import { t as $$EmptyState } from "./EmptyState_tyI5EO8g.mjs";
//#region src/pages/category/[id].astro
var _id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Id,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Id = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Id;
	const { id } = Astro.params;
	const category = id ? getCategoryById(id) : void 0;
	if (!category) return Astro.redirect("/404");
	const courses = getCoursesByCategory(category.id);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${category.name} — Mindflix`,
		"data-astro-cid-z477blyf": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container category-page" data-astro-cid-z477blyf><div class="breadcrumb" data-astro-cid-z477blyf><a href="/categories" data-astro-cid-z477blyf>Categorias</a><span data-astro-cid-z477blyf>/</span><span class="active" data-astro-cid-z477blyf>${category.name}</span></div><header class="category-header" data-astro-cid-z477blyf><div class="cat-title-row" data-astro-cid-z477blyf><h1 class="cat-title" data-astro-cid-z477blyf>${category.name}</h1><span class="badge badge-cyan" data-astro-cid-z477blyf>${courses.length} cursos</span></div><p class="cat-desc" data-astro-cid-z477blyf>${category.description}</p></header>${courses.length > 0 ? renderTemplate`<div class="courses-grid" data-astro-cid-z477blyf>${courses.map((course) => renderTemplate`${renderComponent($$result, "CourseCard", $$CourseCard, {
		"course": course,
		"data-astro-cid-z477blyf": true
	})}`)}</div>` : renderTemplate`${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Nenhum curso nesta categoria",
		"description": "Esta categoria ainda não possui cursos catalogados.",
		"actionText": "Ver Todas as Categorias",
		"actionHref": "/categories",
		"data-astro-cid-z477blyf": true
	})}`}</div>` })}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/category/[id].astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/category/[id].astro";
var $$url = "/category/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/category/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
