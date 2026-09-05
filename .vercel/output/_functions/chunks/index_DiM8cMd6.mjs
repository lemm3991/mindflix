import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute, w as createAstro } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_B8JHJTFp.mjs";
import { o as getCoursesByCategory, t as getAllCourses } from "./catalog__AHOIgcN.mjs";
import { n as $$ProgressBar, t as $$CourseCard } from "./CourseCard_DkkDtZi6.mjs";
//#region src/components/HeroCourse.astro
createAstro("https://astro.build");
var $$HeroCourse = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$HeroCourse;
	const { featuredCourses } = Astro.props;
	const courses = featuredCourses.length > 0 ? featuredCourses : [];
	return renderTemplate`${maybeRenderHead($$result)}<section class="hero-section" id="home-hero-section" data-astro-cid-jtba5kbm><!-- Parallax Background Layer (Plano 1) --><div class="hero-parallax-bg" id="hero-parallax-bg" data-astro-cid-jtba5kbm><div class="backdrop-gradient" data-astro-cid-jtba5kbm></div><div class="backdrop-pattern" data-astro-cid-jtba5kbm></div><div class="hero-ambient-glow" id="hero-glow" data-astro-cid-jtba5kbm></div></div><!-- Video Backdrop Layer with Feathered Gradient Edges & Dark Overlay --><div class="hero-video-backdrop" id="hero-video-backdrop" data-astro-cid-jtba5kbm>${courses.map((course, idx) => {
		const videoPath = (course.modules[0]?.lessons[0])?.relative_path || "";
		return renderTemplate`<div${addAttribute(`hero-video-item ${idx === 0 ? "active" : ""}`, "class")}${addAttribute(idx, "data-video-index")} data-astro-cid-jtba5kbm>${videoPath && renderTemplate`<video class="hero-bg-video" muted loop playsinline${addAttribute(idx === 0 ? "auto" : "none", "preload")}${addAttribute(idx === 0 ? `/api/video?path=${encodeURIComponent(videoPath)}` : void 0, "src")}${addAttribute(`/api/video?path=${encodeURIComponent(videoPath)}`, "data-src")} data-astro-cid-jtba5kbm></video>`}</div>`;
	})}<!-- Multi-directional dark gradient overlays & feathered edges to protect text readability --><div class="hero-video-veil" data-astro-cid-jtba5kbm></div></div><div class="container hero-content-wrapper" data-astro-cid-jtba5kbm>${courses.map((course, idx) => {
		const firstLesson = course.modules[0]?.lessons[0];
		const watchUrl = firstLesson ? `/watch/${course.id}/${firstLesson.id}` : "/courses";
		return renderTemplate`<div${addAttribute(`hero-slide ${idx === 0 ? "active" : ""}`, "class")}${addAttribute(idx, "data-slide-index")}${addAttribute(course.id, "data-course-id")} data-astro-cid-jtba5kbm><div class="hero-meta" data-astro-cid-jtba5kbm><div class="badges-row" data-astro-cid-jtba5kbm><span class="badge badge-cyan" data-astro-cid-jtba5kbm>${course.provider}</span><span class="badge badge-purple" data-astro-cid-jtba5kbm>${course.modules_count} Módulos</span><span class="badge" data-astro-cid-jtba5kbm>${course.lessons_count} Aulas</span></div><h1 class="hero-title" data-astro-cid-jtba5kbm>${course.display_title}</h1><p class="hero-description" data-astro-cid-jtba5kbm>${course.description}</p><div class="hero-tags" data-astro-cid-jtba5kbm>${course.tags.slice(0, 4).map((tag) => renderTemplate`<span class="tag-pill" data-astro-cid-jtba5kbm>#${tag}</span>`)}</div><!-- Dynamic Progress bar if course has been started --><div class="hero-progress-box"${addAttribute(course.id, "data-progress-course-id")} style="display: none;" data-astro-cid-jtba5kbm><div class="hero-progress-info" data-astro-cid-jtba5kbm><span class="hero-progress-text" data-astro-cid-jtba5kbm>Continuar de onde parou</span><span class="hero-progress-percent" data-astro-cid-jtba5kbm>0%</span></div>${renderComponent($$result, "ProgressBar", $$ProgressBar, {
			"percentage": 0,
			"height": "5px",
			"data-astro-cid-jtba5kbm": true
		})}</div><div class="hero-actions" data-astro-cid-jtba5kbm><a${addAttribute(watchUrl, "href")} class="btn btn-primary btn-hero" data-astro-cid-jtba5kbm><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-jtba5kbm><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-jtba5kbm></polygon></svg><span data-astro-cid-jtba5kbm>Continuar Assistindo</span></a><button type="button" class="btn btn-secondary btn-hero btn-hero-info"${addAttribute(course.id, "data-course-id")} data-astro-cid-jtba5kbm><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-jtba5kbm><circle cx="12" cy="12" r="10" data-astro-cid-jtba5kbm></circle><line x1="12" y1="16" x2="12" y2="12" data-astro-cid-jtba5kbm></line><line x1="12" y1="8" x2="12.01" y2="8" data-astro-cid-jtba5kbm></line></svg><span data-astro-cid-jtba5kbm>Mais Informações</span></button><button class="btn btn-secondary btn-icon hero-fav-btn"${addAttribute(course.id, "data-fav-id")} aria-label="Favoritar" data-astro-cid-jtba5kbm><svg class="heart-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-jtba5kbm><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-astro-cid-jtba5kbm></path></svg></button></div></div></div>`;
	})}<!-- Slide Indicators / Dots -->${courses.length > 1 && renderTemplate`<div class="hero-indicators" data-astro-cid-jtba5kbm>${courses.map((_, idx) => renderTemplate`<button type="button"${addAttribute(`indicator-dot ${idx === 0 ? "active" : ""}`, "class")}${addAttribute(idx, "data-dot-index")}${addAttribute(`Ir para destaque ${idx + 1}`, "aria-label")} data-astro-cid-jtba5kbm></button>`)}</div>`}</div></section>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/HeroCourse.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/HeroCourse.astro", void 0);
//#endregion
//#region src/components/CourseRow.astro
createAstro("https://astro.build");
var $$CourseRow = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CourseRow;
	const { title, courses, viewAllHref, icon } = Astro.props;
	const rowId = `row-${title.toLowerCase().replace(/[^\w]/g, "-")}`;
	return renderTemplate`${courses.length > 0 && renderTemplate`${maybeRenderHead($$result)}<section class="course-row-section"${addAttribute(rowId, "data-row-id")} data-astro-cid-cnfachvz><div class="row-header" data-astro-cid-cnfachvz><div class="title-group" data-astro-cid-cnfachvz><h2 class="row-title" data-astro-cid-cnfachvz>${title}</h2><span class="course-count" data-astro-cid-cnfachvz>(${courses.length})</span></div><div class="row-controls" data-astro-cid-cnfachvz>${viewAllHref && renderTemplate`<a${addAttribute(viewAllHref, "href")} class="view-all-link" data-astro-cid-cnfachvz><span data-astro-cid-cnfachvz>Ver todos</span><svg class="view-all-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-cnfachvz><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-cnfachvz></line><polyline points="12 5 19 12 12 19" data-astro-cid-cnfachvz></polyline></svg></a>`}<div class="nav-arrows" data-astro-cid-cnfachvz><button class="arrow-btn arrow-prev"${addAttribute(rowId, "data-target")} aria-label="Rolar para esquerda" style="opacity: 0; pointer-events: none;" data-astro-cid-cnfachvz><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-cnfachvz><polyline points="15 18 9 12 15 6" data-astro-cid-cnfachvz></polyline></svg></button><button class="arrow-btn arrow-next"${addAttribute(rowId, "data-target")} aria-label="Rolar para direita" data-astro-cid-cnfachvz><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-cnfachvz><polyline points="9 18 15 12 9 6" data-astro-cid-cnfachvz></polyline></svg></button></div></div></div><div class="row-carousel-container" data-astro-cid-cnfachvz><div class="row-track"${addAttribute(rowId, "id")} data-astro-cid-cnfachvz>${courses.map((course) => renderTemplate`<div class="card-item-wrapper" data-astro-cid-cnfachvz>${renderComponent($$result, "CourseCard", $$CourseCard, {
		"course": course,
		"data-astro-cid-cnfachvz": true
	})}</div>`)}</div></div></section>`}${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseRow.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseRow.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const allCourses = getAllCourses();
	const eligibleHeroCourses = allCourses.filter((c) => {
		if (c.is_hidden) return false;
		const firstLesson = c.modules?.[0]?.lessons?.[0];
		return Boolean(firstLesson?.relative_path);
	});
	function getRandomHeroCourses(list, count = 5) {
		const pool = [...list];
		for (let i = pool.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[pool[i], pool[j]] = [pool[j], pool[i]];
		}
		return pool.slice(0, count);
	}
	const featuredCourses = getRandomHeroCourses(eligibleHeroCourses.length >= 5 ? eligibleHeroCourses : allCourses, 5);
	const iaCourses = getCoursesByCategory("ia");
	const automacaoCourses = getCoursesByCategory("automacao-agentes");
	const devCourses = getCoursesByCategory("programacao-dev");
	const webCourses = getCoursesByCategory("web-vibe-coding");
	const backendCourses = getCoursesByCategory("backend-infra");
	const dataCourses = getCoursesByCategory("dados-datascience");
	const tradingCourses = getCoursesByCategory("trading");
	const personalCourses = getCoursesByCategory("desenvolvimento-pessoal");
	const nextInPathCourses = allCourses.filter((c) => c.categories.includes("ia") || c.categories.includes("automacao-agentes") || c.categories.includes("web-vibe-coding")).slice(0, 8);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Mindflix — Biblioteca Pessoal de Cursos",
		"data-astro-cid-lcdefpme": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "HeroCourse", $$HeroCourse, {
		"featuredCourses": featuredCourses,
		"data-astro-cid-lcdefpme": true
	})}${maybeRenderHead($$result)}<div class="container home-rows-container" data-astro-cid-lcdefpme><!-- Dynamic Priority Row: Continue Estudando (1-click resume) --><div id="continue-studying-section" class="dynamic-row" style="display: none;" data-astro-cid-lcdefpme><div class="dynamic-row-header" data-astro-cid-lcdefpme><div class="title-with-badge" data-astro-cid-lcdefpme><h2 class="row-title" data-astro-cid-lcdefpme>Continuar Estudando</h2><span class="badge badge-cyan" data-astro-cid-lcdefpme>Retomar em 1 Clique</span></div><span class="row-subtitle" data-astro-cid-lcdefpme>Suas aulas recentes em andamento</span></div><div class="dynamic-grid" id="continue-studying-grid" data-astro-cid-lcdefpme></div></div><!-- Dynamic "Minha Lista" Row --><div id="my-list-section" class="dynamic-row" style="display: none;" data-astro-cid-lcdefpme><div class="dynamic-row-header" data-astro-cid-lcdefpme><h2 class="row-title" data-astro-cid-lcdefpme>Minha Lista</h2><a href="/my-list" class="view-all-link" data-astro-cid-lcdefpme>Ver lista completa →</a></div><div class="dynamic-grid" id="my-list-grid" data-astro-cid-lcdefpme></div></div><!-- Próximo da sua Trilha (Section 65) -->${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Próximo da sua Trilha — Especialização em IA & NoCode",
		"courses": nextInPathCourses,
		"viewAllHref": "/category/ia",
		"data-astro-cid-lcdefpme": true
	})}<!-- Categorized Streaming Carousels -->${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Inteligência Artificial & LLMs",
		"courses": iaCourses,
		"viewAllHref": "/category/ia",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Automação & Agentes Autônomos",
		"courses": automacaoCourses,
		"viewAllHref": "/category/automacao-agentes",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Web, Apps & Vibe Coding",
		"courses": webCourses,
		"viewAllHref": "/category/web-vibe-coding",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Programação & Desenvolvimento",
		"courses": devCourses,
		"viewAllHref": "/category/programacao-dev",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Backend, Bancos de Dados & Infraestrutura",
		"courses": backendCourses,
		"viewAllHref": "/category/backend-infra",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Dados & Data Science",
		"courses": dataCourses,
		"viewAllHref": "/category/dados-datascience",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Trading & Mercado Financeiro",
		"courses": tradingCourses,
		"viewAllHref": "/category/trading",
		"data-astro-cid-lcdefpme": true
	})}${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": "Desenvolvimento Pessoal & Soft Skills",
		"courses": personalCourses,
		"viewAllHref": "/category/desenvolvimento-pessoal",
		"data-astro-cid-lcdefpme": true
	})}</div>` })}${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/index.astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
