import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { M as maybeRenderHead, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
import { a as getCoursesByCategory, c as isComecePorAqui, t as getAllCourses, u as isProjectCourse } from "./catalog_BH-ygd_W.mjs";
import { t as getCourseSourceId } from "./sources_NGS4vvxz.mjs";
import { n as $$HeroCourse } from "./TrilhaCard_BshegjWH.mjs";
import { n as $$CourseRow, t as $$TrilhasRow } from "./TrilhasRow_BKrWU9U7.mjs";
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const allCourses = getAllCourses();
	const ailabCourses = allCourses.filter((c) => !isComecePorAqui(c) && !isProjectCourse(c) && getCourseSourceId(c) === "ailab");
	const asimovCourses = allCourses.filter((c) => !isComecePorAqui(c) && !isProjectCourse(c) && (getCourseSourceId(c) === "asimov" || getCourseSourceId(c) === "asimov-skills"));
	const hashtagCourses = allCourses.filter((c) => !isComecePorAqui(c) && !isProjectCourse(c) && (getCourseSourceId(c) === "hashtag" || getCourseSourceId(c) === "hashtag-soft-skills"));
	const diversosCourses = allCourses.filter((c) => !isComecePorAqui(c) && !isProjectCourse(c) && getCourseSourceId(c) === "outros");
	const iaCourses = getCoursesByCategory("ia");
	const automacaoCourses = getCoursesByCategory("automacao-agentes");
	const devCourses = getCoursesByCategory("programacao-dev");
	const webCourses = getCoursesByCategory("web-vibe-coding");
	const backendCourses = getCoursesByCategory("backend-infra");
	const dataCourses = getCoursesByCategory("dados-datascience");
	const pythonCourses = getCoursesByCategory("python");
	const tradingCourses = getCoursesByCategory("trading");
	const personalCourses = getCoursesByCategory("desenvolvimento-pessoal");
	const nextInPathCourses = allCourses.filter((c) => !isComecePorAqui(c) && !isProjectCourse(c) && (c.categories.includes("ia") || c.categories.includes("automacao-agentes") || c.categories.includes("web-vibe-coding"))).slice(0, 8);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mindflix — Biblioteca Pessoal de Cursos",
		"data-astro-cid-lcdefpme": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "HeroCourse", $$HeroCourse, { "data-astro-cid-lcdefpme": true })}${maybeRenderHead($$result)}<section class="source-spotlight-section" data-astro-cid-lcdefpme><div class="container" data-astro-cid-lcdefpme><div class="spotlight-header" data-astro-cid-lcdefpme><div class="spotlight-title-group" data-astro-cid-lcdefpme><div class="spotlight-badge" data-astro-cid-lcdefpme><span class="spotlight-pulse" data-astro-cid-lcdefpme></span><span data-astro-cid-lcdefpme>Explorar por Plataforma</span></div><h2 class="spotlight-main-title" data-astro-cid-lcdefpme>Principais Fontes de Estudo</h2></div><span class="spotlight-desc" data-astro-cid-lcdefpme>Acesse os ecossistemas completos e trilhas de cada formação</span></div><div class="source-spotlight-grid" data-astro-cid-lcdefpme><!-- 1. AI LAB --><a href="/source/ailab" class="source-spotlight-card card-ailab" data-astro-cid-lcdefpme><div class="spotlight-card-glow" data-astro-cid-lcdefpme></div><div class="spotlight-top" data-astro-cid-lcdefpme><div class="source-brand-icon-wrap icon-ailab" data-astro-cid-lcdefpme><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-lcdefpme><path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93v2.14a2 2 0 0 1-1.5 1.93v2.14A4 4 0 1 1 12 2z" data-astro-cid-lcdefpme></path><circle cx="12" cy="18" r="2" data-astro-cid-lcdefpme></circle><path d="M6 8a6 6 0 0 1 12 0" data-astro-cid-lcdefpme></path></svg></div><span class="source-card-badge badge-ailab" data-astro-cid-lcdefpme>AI LAB</span></div><div class="spotlight-body" data-astro-cid-lcdefpme><h3 class="source-card-title" data-astro-cid-lcdefpme>AI LAB</h3><span class="source-card-tagline" data-astro-cid-lcdefpme>Inteligência Artificial & Agentes</span><p class="source-card-desc" data-astro-cid-lcdefpme>Laboratório de LLMs, engenharia de prompts, automações e sistemas autônomos.</p></div><div class="spotlight-footer" data-astro-cid-lcdefpme><span class="source-count-pill" data-astro-cid-lcdefpme>${ailabCourses.length} Cursos</span><span class="source-card-action" data-astro-cid-lcdefpme><span data-astro-cid-lcdefpme>Acessar</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-lcdefpme><polyline points="9 18 15 12 9 6" data-astro-cid-lcdefpme></polyline></svg></span></div></a><!-- 2. Asimov --><a href="/source/asimov" class="source-spotlight-card card-asimov" data-astro-cid-lcdefpme><div class="spotlight-card-glow" data-astro-cid-lcdefpme></div><div class="spotlight-top" data-astro-cid-lcdefpme><div class="source-brand-icon-wrap icon-asimov" data-astro-cid-lcdefpme><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-lcdefpme><polyline points="4 17 10 11 4 5" data-astro-cid-lcdefpme></polyline><line x1="12" y1="19" x2="20" y2="19" data-astro-cid-lcdefpme></line></svg></div><span class="source-card-badge badge-asimov" data-astro-cid-lcdefpme>Asimov Academy</span></div><div class="spotlight-body" data-astro-cid-lcdefpme><h3 class="source-card-title" data-astro-cid-lcdefpme>Asimov</h3><span class="source-card-tagline" data-astro-cid-lcdefpme>Cursos, Projetos & Trilhas</span><p class="source-card-desc" data-astro-cid-lcdefpme>Biblioteca completa com Python, Data Science, Finanças, Web e Formações Oficiais.</p></div><div class="spotlight-footer" data-astro-cid-lcdefpme><span class="source-count-pill" data-astro-cid-lcdefpme>${asimovCourses.length} Cursos</span><span class="source-card-action" data-astro-cid-lcdefpme><span data-astro-cid-lcdefpme>Acessar</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-lcdefpme><polyline points="9 18 15 12 9 6" data-astro-cid-lcdefpme></polyline></svg></span></div></a><!-- 3. Hashtag --><a href="/source/hashtag" class="source-spotlight-card card-hashtag" data-astro-cid-lcdefpme><div class="spotlight-card-glow" data-astro-cid-lcdefpme></div><div class="spotlight-top" data-astro-cid-lcdefpme><div class="source-brand-icon-wrap icon-hashtag" data-astro-cid-lcdefpme><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-lcdefpme><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" data-astro-cid-lcdefpme></polygon></svg></div><span class="source-card-badge badge-hashtag" data-astro-cid-lcdefpme>Hashtag Treinamentos</span></div><div class="spotlight-body" data-astro-cid-lcdefpme><h3 class="source-card-title" data-astro-cid-lcdefpme>Hashtag</h3><span class="source-card-tagline" data-astro-cid-lcdefpme>Impressionadores & Soft Skills</span><p class="source-card-desc" data-astro-cid-lcdefpme>Treinamentos práticos de IA, Claude, Lovable, Supabase, NoCode e Alta Performance.</p></div><div class="spotlight-footer" data-astro-cid-lcdefpme><span class="source-count-pill" data-astro-cid-lcdefpme>${hashtagCourses.length} Treinamentos</span><span class="source-card-action" data-astro-cid-lcdefpme><span data-astro-cid-lcdefpme>Acessar</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-lcdefpme><polyline points="9 18 15 12 9 6" data-astro-cid-lcdefpme></polyline></svg></span></div></a><!-- 4. Diversos --><a href="/source/outros" class="source-spotlight-card card-diversos" data-astro-cid-lcdefpme><div class="spotlight-card-glow" data-astro-cid-lcdefpme></div><div class="spotlight-top" data-astro-cid-lcdefpme><div class="source-brand-icon-wrap icon-diversos" data-astro-cid-lcdefpme><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-lcdefpme><polygon points="12 2 2 7 12 12 22 7 12 2" data-astro-cid-lcdefpme></polygon><polyline points="2 17 12 22 22 17" data-astro-cid-lcdefpme></polyline><polyline points="2 12 12 17 22 12" data-astro-cid-lcdefpme></polyline></svg></div><span class="source-card-badge badge-diversos" data-astro-cid-lcdefpme>Diversos</span></div><div class="spotlight-body" data-astro-cid-lcdefpme><h3 class="source-card-title" data-astro-cid-lcdefpme>Diversos</h3><span class="source-card-tagline" data-astro-cid-lcdefpme>Especialidades & Desenvolvimento</span><p class="source-card-desc" data-astro-cid-lcdefpme>Cursos complementares de alta performance pessoal, saúde, PNL e especializações.</p></div><div class="spotlight-footer" data-astro-cid-lcdefpme><span class="source-count-pill" data-astro-cid-lcdefpme>${diversosCourses.length} Cursos</span><span class="source-card-action" data-astro-cid-lcdefpme><span data-astro-cid-lcdefpme>Acessar</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-lcdefpme><polyline points="9 18 15 12 9 6" data-astro-cid-lcdefpme></polyline></svg></span></div></a></div></div></section>${renderComponent($$result, "TrilhasRow", $$TrilhasRow, { "data-astro-cid-lcdefpme": true })}<div class="container home-rows-container" data-astro-cid-lcdefpme><!-- Dynamic Priority Row: Continue Estudando (1-click resume) --><div id="continue-studying-section" class="dynamic-row" style="display: none;" data-astro-cid-lcdefpme><div class="dynamic-row-header" data-astro-cid-lcdefpme><div class="title-with-badge" data-astro-cid-lcdefpme><h2 class="row-title" data-astro-cid-lcdefpme>Continuar Estudando</h2><span class="badge badge-cyan" data-astro-cid-lcdefpme>Retomar em 1 Clique</span></div><span class="row-subtitle" data-astro-cid-lcdefpme>Suas aulas recentes em andamento</span></div><div class="dynamic-grid" id="continue-studying-grid" data-astro-cid-lcdefpme></div></div><!-- Dynamic "Minha Lista" Row --><div id="my-list-section" class="dynamic-row" style="display: none;" data-astro-cid-lcdefpme><div class="dynamic-row-header" data-astro-cid-lcdefpme><h2 class="row-title" data-astro-cid-lcdefpme>Minha Lista</h2><a href="/my-list" class="view-all-link" data-astro-cid-lcdefpme>Ver lista completa →</a></div><div class="dynamic-grid" id="my-list-grid" data-astro-cid-lcdefpme></div></div><!-- Próximo da sua Trilha (Section 65) -->${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Próximo da sua Trilha — Especialização em IA & NoCode",
		"courses": nextInPathCourses,
		"viewAllHref": "/courses?category=ia",
		"eagerCount": 4,
		"data-astro-cid-lcdefpme": true
	})}<!-- Categorized Streaming Carousels (All Categories) -->${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Inteligência Artificial & LLMs",
		"courses": iaCourses,
		"viewAllHref": "/courses?category=ia",
		"eagerCount": 2,
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Automação & Agentes Autônomos",
		"courses": automacaoCourses,
		"viewAllHref": "/courses?category=automacao-agentes",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Web, Apps & Vibe Coding",
		"courses": webCourses,
		"viewAllHref": "/courses?category=web-vibe-coding",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Programação & Desenvolvimento",
		"courses": devCourses,
		"viewAllHref": "/courses?category=programacao-dev",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Backend, Bancos de Dados & Infraestrutura",
		"courses": backendCourses,
		"viewAllHref": "/courses?category=backend-infra",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Dados & Data Science",
		"courses": dataCourses,
		"viewAllHref": "/courses?category=dados-datascience",
		"data-astro-cid-lcdefpme": true
	})}${pythonCourses.length > 0 && renderTemplate`${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Ecossistema Python Aplicado",
		"courses": pythonCourses,
		"viewAllHref": "/courses?category=python",
		"data-astro-cid-lcdefpme": true
	})}`}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Trading & Mercado Financeiro",
		"courses": tradingCourses,
		"viewAllHref": "/courses?category=trading",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Desenvolvimento Pessoal & Soft Skills",
		"courses": personalCourses,
		"viewAllHref": "/courses?category=desenvolvimento-pessoal",
		"data-astro-cid-lcdefpme": true
	})}</div>` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/index.astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
