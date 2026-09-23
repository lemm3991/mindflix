import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { M as maybeRenderHead, P as addAttribute, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
import { t as getAllCourses } from "./catalog_BH-ygd_W.mjs";
import { t as getCourseSourceId } from "./sources_NGS4vvxz.mjs";
import { t as $$CourseCard } from "./CourseCard_umbSu6TR.mjs";
import { t as $$EmptyState } from "./EmptyState_DWk5PmmX.mjs";
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
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container my-list-page" data-astro-cid-7ui6v2kp><header class="page-header" data-astro-cid-7ui6v2kp><h1 class="page-title" data-astro-cid-7ui6v2kp>Minha Lista</h1><p class="page-subtitle" data-astro-cid-7ui6v2kp>Seus cursos favoritos e conteúdos salvos para estudar quando quiser.</p></header><div class="courses-grid" id="my-list-container" data-astro-cid-7ui6v2kp>${courses.map((course) => renderTemplate`<div class="my-list-item"${addAttribute(course.id, "data-course-id")}${addAttribute(getCourseSourceId(course), "data-source")} style="display: none;" data-astro-cid-7ui6v2kp>${renderComponent($$result, "CourseCard", $$CourseCard, {
		"course": course,
		"data-astro-cid-7ui6v2kp": true
	})}</div>`)}</div><div id="empty-list-state" style="display: none;" data-astro-cid-7ui6v2kp>${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Sua lista está vazia",
		"description": "Explore o catálogo e clique no ícone de coração para adicionar cursos que deseja estudar à sua lista pessoal.",
		"actionText": "Explorar Cursos",
		"actionHref": "/courses",
		"data-astro-cid-7ui6v2kp": true
	})}</div></div>` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/my-list.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/my-list.astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/my-list.astro";
var $$url = "/my-list";
//#endregion
//#region \0virtual:astro:page:src/pages/my-list@_@astro
var page = () => my_list_exports;
//#endregion
export { page };
