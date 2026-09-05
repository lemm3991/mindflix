import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_B8JHJTFp.mjs";
import { t as getAllCourses } from "./catalog__AHOIgcN.mjs";
import { t as $$CourseCard } from "./CourseCard_DkkDtZi6.mjs";
import { t as $$EmptyState } from "./EmptyState_tyI5EO8g.mjs";
//#region src/pages/my-list.astro
var my_list_exports = /* @__PURE__ */ __exportAll({
	default: () => $$MyList,
	file: () => $$file,
	url: () => $$url
});
var $$MyList = createComponent(($$result, $$props, $$slots) => {
	const courses = getAllCourses();
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Minha Lista — Mindflix",
		"data-astro-cid-7ui6v2kp": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container my-list-page" data-astro-cid-7ui6v2kp><header class="page-header" data-astro-cid-7ui6v2kp><h1 class="page-title" data-astro-cid-7ui6v2kp>Minha Lista</h1><p class="page-subtitle" data-astro-cid-7ui6v2kp>Seus cursos favoritos e conteúdos salvos para estudar quando quiser.</p></header><div class="courses-grid" id="my-list-container" data-astro-cid-7ui6v2kp>${courses.map((course) => renderTemplate`<div class="my-list-item"${addAttribute(course.id, "data-course-id")} style="display: none;" data-astro-cid-7ui6v2kp>${renderComponent($$result, "CourseCard", $$CourseCard, {
		"course": course,
		"data-astro-cid-7ui6v2kp": true
	})}</div>`)}</div><div id="empty-list-state" style="display: none;" data-astro-cid-7ui6v2kp>${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Sua lista está vazia",
		"description": "Explore o catálogo e clique no ícone de coração para adicionar cursos que deseja estudar à sua lista pessoal.",
		"actionText": "Explorar Cursos",
		"actionHref": "/courses",
		"data-astro-cid-7ui6v2kp": true
	})}</div></div>` })}${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/my-list.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/my-list.astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/my-list.astro";
var $$url = "/my-list";
//#endregion
//#region \0virtual:astro:page:src/pages/my-list@_@astro
var page = () => my_list_exports;
//#endregion
export { page };
