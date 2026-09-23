import { H as createAstro, M as maybeRenderHead, P as addAttribute, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript } from "./Layout_DQEGFcGL.mjs";
import { t as getCourseSourceId } from "./sources_NGS4vvxz.mjs";
import { t as $$CourseCard } from "./CourseCard_umbSu6TR.mjs";
import { t as $$TrilhaCard } from "./TrilhaCard_BshegjWH.mjs";
import { i as getTrilhasBySource, t as getAllTrilhas } from "./trilhas_CUzDCp4m.mjs";
//#region src/components/CourseRow.astro
createAstro("https://astro.build");
var $$CourseRow = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CourseRow;
	const { title, courses, viewAllHref, icon, eagerCount = 0 } = Astro.props;
	const rowId = `row-${title.toLowerCase().replace(/[^\w]/g, "-")}`;
	return renderTemplate`${courses.length > 0 && renderTemplate`${maybeRenderHead($$result)}<section class="course-row-section"${addAttribute(rowId, "data-row-id")} data-astro-cid-cnfachvz><div class="row-header" data-astro-cid-cnfachvz><div class="title-group" data-astro-cid-cnfachvz><h2 class="row-title" data-astro-cid-cnfachvz>${title}</h2><span class="course-count" data-astro-cid-cnfachvz>(${courses.length})</span></div><div class="row-controls" data-astro-cid-cnfachvz>${viewAllHref && renderTemplate`<a${addAttribute(viewAllHref, "href")} class="view-all-link" data-astro-cid-cnfachvz><span data-astro-cid-cnfachvz>Ver todos</span><svg class="view-all-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-cnfachvz><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-cnfachvz></line><polyline points="12 5 19 12 12 19" data-astro-cid-cnfachvz></polyline></svg></a>`}<div class="nav-arrows" data-astro-cid-cnfachvz><button class="arrow-btn arrow-prev"${addAttribute(rowId, "data-target")} aria-label="Rolar para esquerda" style="opacity: 0; pointer-events: none;" data-astro-cid-cnfachvz><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-cnfachvz><polyline points="15 18 9 12 15 6" data-astro-cid-cnfachvz></polyline></svg></button><button class="arrow-btn arrow-next"${addAttribute(rowId, "data-target")} aria-label="Rolar para direita" data-astro-cid-cnfachvz><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-cnfachvz><polyline points="9 18 15 12 9 6" data-astro-cid-cnfachvz></polyline></svg></button></div></div></div><div class="row-carousel-container" data-astro-cid-cnfachvz><div class="row-track"${addAttribute(rowId, "id")} data-astro-cid-cnfachvz>${courses.map((course, idx) => renderTemplate`<div class="card-item-wrapper"${addAttribute(getCourseSourceId(course), "data-source")} data-astro-cid-cnfachvz>${renderComponent($$result, "CourseCard", $$CourseCard, {
		"course": course,
		"loading": idx < eagerCount ? "eager" : "lazy",
		"fetchpriority": idx < eagerCount && idx < 2 ? "high" : "auto",
		"data-astro-cid-cnfachvz": true
	})}</div>`)}</div></div></section>`}${renderScript($$result, "D:/projetos antigravity/mindflix/src/components/CourseRow.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/components/CourseRow.astro", void 0);
//#endregion
//#region src/components/TrilhasRow.astro
createAstro("https://astro.build");
var $$TrilhasRow = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TrilhasRow;
	const { source, title = "Trilhas de Aprendizado", badge = "Formações Oficiais & Trilhas", subtitle = "Sequências completas e cronológicas de cursos e projetos para dominar uma especialidade." } = Astro.props;
	const trilhas = source && source !== "all" ? getTrilhasBySource(source) : getAllTrilhas();
	return renderTemplate`${trilhas.length > 0 && renderTemplate`${maybeRenderHead($$result)}<section class="trilhas-section" id="trilhas-asimov-section"${addAttribute(source || "", "data-fixed-source")} data-astro-cid-hvuy5jxn><div class="container" data-astro-cid-hvuy5jxn><div class="trilhas-header" data-astro-cid-hvuy5jxn><div class="trilhas-title-wrap" data-astro-cid-hvuy5jxn><div class="trilhas-badge" data-astro-cid-hvuy5jxn><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-hvuy5jxn><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" data-astro-cid-hvuy5jxn></polygon></svg><span data-astro-cid-hvuy5jxn>${badge}</span></div><h2 class="trilhas-main-title" data-astro-cid-hvuy5jxn>${title}</h2><p class="trilhas-subtitle" data-astro-cid-hvuy5jxn>${subtitle}</p></div><div class="trilhas-nav-controls" data-astro-cid-hvuy5jxn><button type="button" class="trilhas-nav-btn prev" id="trilhas-prev-btn" aria-label="Rolar trilhas para esquerda" data-astro-cid-hvuy5jxn><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-hvuy5jxn><polyline points="15 18 9 12 15 6" data-astro-cid-hvuy5jxn></polyline></svg></button><button type="button" class="trilhas-nav-btn next" id="trilhas-next-btn" aria-label="Rolar trilhas para direita" data-astro-cid-hvuy5jxn><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-hvuy5jxn><polyline points="9 18 15 12 9 6" data-astro-cid-hvuy5jxn></polyline></svg></button></div></div><div class="trilhas-carousel-wrapper" data-astro-cid-hvuy5jxn><div class="trilhas-carousel-track" id="trilhas-carousel" data-astro-cid-hvuy5jxn>${trilhas.map((trilha) => renderTemplate`${renderComponent($$result, "TrilhaCard", $$TrilhaCard, {
		"trilha": trilha,
		"data-astro-cid-hvuy5jxn": true
	})}`)}</div></div></div></section>`}${renderScript($$result, "D:/projetos antigravity/mindflix/src/components/TrilhasRow.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/components/TrilhasRow.astro", void 0);
//#endregion
export { $$CourseRow as n, $$TrilhasRow as t };
