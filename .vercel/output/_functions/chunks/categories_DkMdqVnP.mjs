import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_B8JHJTFp.mjs";
import { r as getCategories, t as getAllCourses } from "./catalog__AHOIgcN.mjs";
//#region src/pages/categories.astro
var categories_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Categories,
	file: () => $$file,
	url: () => $$url
});
var $$Categories = createComponent(($$result, $$props, $$slots) => {
	const rawCategories = getCategories();
	const allCourses = getAllCourses();
	const categoryMeta = {
		"ia": {
			accent: "#00f2fe",
			accentSoft: "rgba(0, 242, 254, 0.12)",
			grad: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
			group: "ia",
			icon: "sparkles",
			featured: true
		},
		"automacao-agentes": {
			accent: "#a855f7",
			accentSoft: "rgba(168, 85, 247, 0.12)",
			grad: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
			group: "ia",
			icon: "bot"
		},
		"programacao-dev": {
			accent: "#10b981",
			accentSoft: "rgba(16, 185, 129, 0.12)",
			grad: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
			group: "dev",
			icon: "terminal"
		},
		"web-vibe-coding": {
			accent: "#f43f5e",
			accentSoft: "rgba(244, 63, 94, 0.12)",
			grad: "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)",
			group: "dev",
			icon: "layers"
		},
		"backend-infra": {
			accent: "#f59e0b",
			accentSoft: "rgba(245, 158, 11, 0.12)",
			grad: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
			group: "dev",
			icon: "database"
		},
		"dados-datascience": {
			accent: "#06b6d4",
			accentSoft: "rgba(6, 182, 212, 0.12)",
			grad: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
			group: "data",
			icon: "chart",
			featured: true
		},
		"python": {
			accent: "#eab308",
			accentSoft: "rgba(234, 179, 8, 0.12)",
			grad: "linear-gradient(135deg, #eab308 0%, #3b82f6 100%)",
			group: "dev",
			icon: "code"
		},
		"trading": {
			accent: "#22c55e",
			accentSoft: "rgba(34, 197, 94, 0.12)",
			grad: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
			group: "data",
			icon: "trending"
		},
		"negocios": {
			accent: "#8b5cf6",
			accentSoft: "rgba(139, 92, 246, 0.12)",
			grad: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
			group: "other",
			icon: "briefcase"
		},
		"saude-lifestyle": {
			accent: "#fb7185",
			accentSoft: "rgba(251, 113, 133, 0.12)",
			grad: "linear-gradient(135deg, #fb7185 0%, #e11d48 100%)",
			group: "other",
			icon: "heart"
		},
		"musica": {
			accent: "#d946ef",
			accentSoft: "rgba(217, 70, 239, 0.12)",
			grad: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)",
			group: "other",
			icon: "music"
		},
		"formacoes-trilhas": {
			accent: "#38bdf8",
			accentSoft: "rgba(56, 189, 248, 0.12)",
			grad: "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
			group: "other",
			icon: "compass"
		}
	};
	const categories = rawCategories.map((cat) => {
		const catCourses = allCourses.filter((c) => c.categories.includes(cat.id));
		const count = catCourses.length;
		const totalLessons = catCourses.reduce((acc, c) => acc + (c.lessons_count || 0), 0);
		const sampleCourses = catCourses.slice(0, 4).map((c) => c.display_title);
		const meta = categoryMeta[cat.id] || {
			accent: "#00f2fe",
			accentSoft: "rgba(0, 242, 254, 0.12)",
			grad: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
			group: "other",
			icon: "folder"
		};
		return {
			...cat,
			count,
			totalLessons,
			sampleCourses,
			...meta
		};
	});
	const sortedCategories = [...categories].sort((a, b) => {
		if (a.featured && !b.featured) return -1;
		if (!a.featured && b.featured) return 1;
		return b.count - a.count;
	});
	const totalCoursesCount = allCourses.length;
	const totalLessonsCount = allCourses.reduce((acc, c) => acc + (c.lessons_count || 0), 0);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Categorias & Trilhas — Mindflix",
		"description": "Explore os cursos organizados por trilhas temáticas, tecnologias e áreas de conhecimento.",
		"data-astro-cid-m2bg6fd5": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container categories-page" data-astro-cid-m2bg6fd5><!-- Hero Header --><header class="page-header" data-astro-cid-m2bg6fd5><div class="header-badge" data-astro-cid-m2bg6fd5><span class="badge-dot" data-astro-cid-m2bg6fd5></span><span data-astro-cid-m2bg6fd5>Biblioteca Inteligente</span></div><h1 class="page-title" data-astro-cid-m2bg6fd5>Explorar Categorias & Trilhas</h1><p class="page-subtitle" data-astro-cid-m2bg6fd5>Navegue pelas jornadas de conhecimento estruturadas para o seu aprendizado contínuo.</p><!-- Global Stats Pills --><div class="header-stats" data-astro-cid-m2bg6fd5><div class="stat-pill" data-astro-cid-m2bg6fd5><span class="stat-number" data-astro-cid-m2bg6fd5>${categories.length}</span><span class="stat-label" data-astro-cid-m2bg6fd5>Trilhas</span></div><div class="stat-divider" data-astro-cid-m2bg6fd5></div><div class="stat-pill" data-astro-cid-m2bg6fd5><span class="stat-number" data-astro-cid-m2bg6fd5>${totalCoursesCount}</span><span class="stat-label" data-astro-cid-m2bg6fd5>Cursos</span></div><div class="stat-divider" data-astro-cid-m2bg6fd5></div><div class="stat-pill" data-astro-cid-m2bg6fd5><span class="stat-number" data-astro-cid-m2bg6fd5>+${totalLessonsCount.toLocaleString("pt-BR")}</span><span class="stat-label" data-astro-cid-m2bg6fd5>Aulas Disponíveis</span></div></div></header><!-- Filter & Search Controls --><div class="controls-bar" data-astro-cid-m2bg6fd5><!-- Search input --><div class="search-box" data-astro-cid-m2bg6fd5><svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-m2bg6fd5><circle cx="11" cy="11" r="8" data-astro-cid-m2bg6fd5></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-m2bg6fd5></line></svg><input type="text" id="category-search" placeholder="Buscar por nome, tecnologia ou curso..." autocomplete="off" data-astro-cid-m2bg6fd5><button id="clear-search" class="clear-btn" aria-label="Limpar busca" style="display: none;" data-astro-cid-m2bg6fd5><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-m2bg6fd5><line x1="18" y1="6" x2="6" y2="18" data-astro-cid-m2bg6fd5></line><line x1="6" y1="6" x2="18" y2="18" data-astro-cid-m2bg6fd5></line></svg></button></div><!-- Quick Group Tabs --><div class="filter-tabs" role="tablist" data-astro-cid-m2bg6fd5><button class="filter-tab active" data-group="all" data-astro-cid-m2bg6fd5><span data-astro-cid-m2bg6fd5>Todas</span><span class="tab-count" data-astro-cid-m2bg6fd5>${categories.length}</span></button><button class="filter-tab" data-group="ia" data-astro-cid-m2bg6fd5><span data-astro-cid-m2bg6fd5>IA & Agentes</span></button><button class="filter-tab" data-group="dev" data-astro-cid-m2bg6fd5><span data-astro-cid-m2bg6fd5>Dev & Software</span></button><button class="filter-tab" data-group="data" data-astro-cid-m2bg6fd5><span data-astro-cid-m2bg6fd5>Dados & Finanças</span></button><button class="filter-tab" data-group="other" data-astro-cid-m2bg6fd5><span data-astro-cid-m2bg6fd5>Outras Áreas</span></button></div></div><!-- Bento Grid Container --><div class="bento-grid" id="categories-bento-grid" data-astro-cid-m2bg6fd5>${sortedCategories.map((cat) => renderTemplate`<a${addAttribute(`/category/${cat.id}`, "href")}${addAttribute(`bento-cat-card ${cat.featured ? "bento-featured" : ""}`, "class")}${addAttribute(cat.id, "data-cat-id")}${addAttribute(cat.group, "data-cat-group")}${addAttribute(`${cat.name} ${cat.description} ${cat.sampleCourses.join(" ")}`.toLowerCase(), "data-search-content")}${addAttribute(`--cat-accent: ${cat.accent}; --cat-accent-soft: ${cat.accentSoft}; --cat-grad: ${cat.grad};`, "style")} data-astro-cid-m2bg6fd5><!-- Dynamic ambient spotlight inside card --><div class="cat-spotlight-bg" data-astro-cid-m2bg6fd5></div><!-- Card Content Wrapper (with 3D transform preserve) --><div class="cat-card-inner" data-astro-cid-m2bg6fd5><!-- Card Header --><div class="cat-card-header parallax-layer-2" data-astro-cid-m2bg6fd5><div class="cat-icon-box"${addAttribute(`background: ${cat.accentSoft}; border-color: ${cat.accent}40; color: ${cat.accent};`, "style")} data-astro-cid-m2bg6fd5>${cat.icon === "sparkles" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" data-astro-cid-m2bg6fd5></path><path d="M5 3v4" data-astro-cid-m2bg6fd5></path><path d="M19 17v4" data-astro-cid-m2bg6fd5></path><path d="M3 5h4" data-astro-cid-m2bg6fd5></path><path d="M17 19h4" data-astro-cid-m2bg6fd5></path></svg>`}${cat.icon === "bot" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><rect x="3" y="11" width="18" height="10" rx="2" data-astro-cid-m2bg6fd5></rect><circle cx="12" cy="5" r="2" data-astro-cid-m2bg6fd5></circle><path d="M12 7v4" data-astro-cid-m2bg6fd5></path><line x1="8" y1="16" x2="8" y2="16.01" data-astro-cid-m2bg6fd5></line><line x1="16" y1="16" x2="16" y2="16.01" data-astro-cid-m2bg6fd5></line></svg>`}${cat.icon === "terminal" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><polyline points="4 17 10 11 4 5" data-astro-cid-m2bg6fd5></polyline><line x1="12" y1="19" x2="20" y2="19" data-astro-cid-m2bg6fd5></line></svg>`}${cat.icon === "layers" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><polygon points="12 2 2 7 12 12 22 7 12 2" data-astro-cid-m2bg6fd5></polygon><polyline points="2 17 12 22 22 17" data-astro-cid-m2bg6fd5></polyline><polyline points="2 12 12 17 22 12" data-astro-cid-m2bg6fd5></polyline></svg>`}${cat.icon === "database" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><ellipse cx="12" cy="5" rx="9" ry="3" data-astro-cid-m2bg6fd5></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" data-astro-cid-m2bg6fd5></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" data-astro-cid-m2bg6fd5></path></svg>`}${cat.icon === "chart" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><line x1="18" y1="20" x2="18" y2="10" data-astro-cid-m2bg6fd5></line><line x1="12" y1="20" x2="12" y2="4" data-astro-cid-m2bg6fd5></line><line x1="6" y1="20" x2="6" y2="14" data-astro-cid-m2bg6fd5></line></svg>`}${cat.icon === "code" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><polyline points="16 18 22 12 16 6" data-astro-cid-m2bg6fd5></polyline><polyline points="8 6 2 12 8 18" data-astro-cid-m2bg6fd5></polyline></svg>`}${cat.icon === "trending" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" data-astro-cid-m2bg6fd5></polyline><polyline points="17 6 23 6 23 12" data-astro-cid-m2bg6fd5></polyline></svg>`}${cat.icon === "briefcase" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><rect x="2" y="7" width="20" height="14" rx="2" ry="2" data-astro-cid-m2bg6fd5></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" data-astro-cid-m2bg6fd5></path></svg>`}${cat.icon === "heart" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-astro-cid-m2bg6fd5></path></svg>`}${cat.icon === "music" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><path d="M9 18V5l12-2v13" data-astro-cid-m2bg6fd5></path><circle cx="6" cy="18" r="3" data-astro-cid-m2bg6fd5></circle><circle cx="18" cy="16" r="3" data-astro-cid-m2bg6fd5></circle></svg>`}${cat.icon === "compass" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><circle cx="12" cy="12" r="10" data-astro-cid-m2bg6fd5></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" data-astro-cid-m2bg6fd5></polygon></svg>`}${cat.icon === "folder" && renderTemplate`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" data-astro-cid-m2bg6fd5></path></svg>`}</div><div class="cat-badges-wrapper" data-astro-cid-m2bg6fd5>${cat.featured && renderTemplate`<span class="badge-featured"${addAttribute(`border-color: ${cat.accent}50; color: ${cat.accent};`, "style")} data-astro-cid-m2bg6fd5>★ Trilha Principal</span>`}<span class="cat-count-pill" data-astro-cid-m2bg6fd5><strong data-astro-cid-m2bg6fd5>${cat.count}</strong> ${cat.count === 1 ? "curso" : "cursos"}</span></div></div><!-- Card Body --><div class="cat-card-body parallax-layer-1" data-astro-cid-m2bg6fd5><h3 class="cat-title" data-astro-cid-m2bg6fd5>${cat.name}</h3><p class="cat-desc" data-astro-cid-m2bg6fd5>${cat.description}</p></div><!-- Sample Courses Chips / Topics Preview -->${cat.sampleCourses.length > 0 && renderTemplate`<div class="cat-sample-courses parallax-layer-1" data-astro-cid-m2bg6fd5><span class="sample-label" data-astro-cid-m2bg6fd5>Cursos em destaque:</span><div class="sample-chips" data-astro-cid-m2bg6fd5>${cat.sampleCourses.map((courseTitle) => renderTemplate`<span class="course-chip"${addAttribute(courseTitle, "title")} data-astro-cid-m2bg6fd5>${courseTitle}</span>`)}${cat.count > cat.sampleCourses.length && renderTemplate`<span class="course-chip-more"${addAttribute(`color: ${cat.accent};`, "style")} data-astro-cid-m2bg6fd5>+${cat.count - cat.sampleCourses.length} mais</span>`}</div></div>`}<!-- Card Footer --><div class="cat-card-footer parallax-layer-2" data-astro-cid-m2bg6fd5><div class="footer-meta" data-astro-cid-m2bg6fd5><span class="lessons-count" data-astro-cid-m2bg6fd5>${cat.totalLessons} aulas gravadas</span></div><div class="cat-action-btn"${addAttribute(`color: ${cat.accent};`, "style")} data-astro-cid-m2bg6fd5><span data-astro-cid-m2bg6fd5>Acessar trilha</span><svg class="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-m2bg6fd5><line x1="5" y1="12" x2="19" y2="12" data-astro-cid-m2bg6fd5></line><polyline points="12 5 19 12 12 19" data-astro-cid-m2bg6fd5></polyline></svg></div></div></div></a>`)}</div><!-- Empty State for Search Filter --><div id="no-results-state" class="no-results" style="display: none;" data-astro-cid-m2bg6fd5><div class="no-results-icon" data-astro-cid-m2bg6fd5>🔍</div><h3 data-astro-cid-m2bg6fd5>Nenhuma categoria encontrada</h3><p data-astro-cid-m2bg6fd5>Tente buscar por outro termo ou limpe os filtros para ver todas as trilhas.</p><button id="reset-filter-btn" class="btn btn-secondary" data-astro-cid-m2bg6fd5>Limpar Busca</button></div></div>` })}${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/categories.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/categories.astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/categories.astro";
var $$url = "/categories";
//#endregion
//#region \0virtual:astro:page:src/pages/categories@_@astro
var page = () => categories_exports;
//#endregion
export { page };
