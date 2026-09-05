import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute, w as createAstro } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_B8JHJTFp.mjs";
import { n as getAllProviders, r as getCategories, t as getAllCourses } from "./catalog__AHOIgcN.mjs";
import { t as $$CourseCard } from "./CourseCard_DkkDtZi6.mjs";
import { t as $$EmptyState } from "./EmptyState_tyI5EO8g.mjs";
//#region src/components/SearchBar.astro
createAstro("https://astro.build");
var $$SearchBar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SearchBar;
	const { placeholder = "Pesquisar cursos, módulos, aulas ou buscar por assunto...", initialValue = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="search-bar-component" data-astro-cid-u57zkn3a><div class="search-input-wrapper" data-astro-cid-u57zkn3a><svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u57zkn3a><circle cx="11" cy="11" r="8" data-astro-cid-u57zkn3a></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-u57zkn3a></line></svg><input type="text" id="global-search-input" class="search-input"${addAttribute(placeholder, "placeholder")}${addAttribute(initialValue, "value")} autocomplete="off" data-astro-cid-u57zkn3a><button type="button" id="clear-search-btn" class="clear-btn" aria-label="Limpar pesquisa" style="display: none;" data-astro-cid-u57zkn3a><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u57zkn3a><line x1="18" y1="6" x2="6" y2="18" data-astro-cid-u57zkn3a></line><line x1="6" y1="6" x2="18" y2="18" data-astro-cid-u57zkn3a></line></svg></button><!-- Trigger AI Subject Search Modal button --><button type="button" id="trigger-ai-modal-btn" class="search-ai-shortcut-btn" title="Buscar por assunto nas transcrições com IA" data-astro-cid-u57zkn3a><span class="ai-sparkle" data-astro-cid-u57zkn3a>✦</span><span class="ai-btn-label" data-astro-cid-u57zkn3a>Buscar Assunto (IA)</span></button></div><!-- Quick Type Filters Bar --><div class="search-quick-filters" data-astro-cid-u57zkn3a><span class="quick-filter-label" data-astro-cid-u57zkn3a>Filtro:</span><button type="button" class="quick-filter-chip active" data-type="all" data-astro-cid-u57zkn3a>Todos</button><button type="button" class="quick-filter-chip" data-type="course" data-astro-cid-u57zkn3a>Cursos</button><button type="button" class="quick-filter-chip" data-type="module" data-astro-cid-u57zkn3a>Módulos</button><button type="button" class="quick-filter-chip" data-type="lesson" data-astro-cid-u57zkn3a>Aulas</button><button type="button" class="quick-filter-chip chip-ai" data-type="ai" data-astro-cid-u57zkn3a><span class="ai-sparkle" data-astro-cid-u57zkn3a>✦</span> Buscar por Assunto (IA)</button></div></div>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/SearchBar.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/SearchBar.astro", void 0);
//#endregion
//#region src/components/CourseFilters.astro
createAstro("https://astro.build");
var $$CourseFilters = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CourseFilters;
	const { categories, providers, selectedCategory = "", selectedProvider = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="filters-bar" id="course-filters-bar" data-astro-cid-u7ygsnaf><div class="filters-group" data-astro-cid-u7ygsnaf><!-- Category Filter --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-category" class="filter-label" data-astro-cid-u7ygsnaf>Categoria</label><select id="filter-category" class="filter-select" data-astro-cid-u7ygsnaf><option value="" data-astro-cid-u7ygsnaf>Todas as Categorias</option>${categories.map((cat) => renderTemplate`<option${addAttribute(cat.id, "value")}${addAttribute(selectedCategory === cat.id, "selected")} data-astro-cid-u7ygsnaf>${cat.name}</option>`)}</select></div><!-- Provider Filter --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-provider" class="filter-label" data-astro-cid-u7ygsnaf>Fornecedor</label><select id="filter-provider" class="filter-select" data-astro-cid-u7ygsnaf><option value="" data-astro-cid-u7ygsnaf>Todos os Fornecedores</option>${providers.map((prov) => renderTemplate`<option${addAttribute(prov, "value")}${addAttribute(selectedProvider === prov, "selected")} data-astro-cid-u7ygsnaf>${prov}</option>`)}</select></div><!-- Status Filter --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-status" class="filter-label" data-astro-cid-u7ygsnaf>Status</label><select id="filter-status" class="filter-select" data-astro-cid-u7ygsnaf><option value="" data-astro-cid-u7ygsnaf>Todos os Status</option><option value="not_started" data-astro-cid-u7ygsnaf>Não iniciado</option><option value="in_progress" data-astro-cid-u7ygsnaf>Em andamento</option><option value="completed" data-astro-cid-u7ygsnaf>Concluído</option><option value="favorited" data-astro-cid-u7ygsnaf>Favoritos</option></select></div><!-- Sorting --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-sort" class="filter-label" data-astro-cid-u7ygsnaf>Ordenar por</label><select id="filter-sort" class="filter-select" data-astro-cid-u7ygsnaf><option value="recent" data-astro-cid-u7ygsnaf>Relevância / Destaques</option><option value="az" data-astro-cid-u7ygsnaf>Nome (A - Z)</option><option value="za" data-astro-cid-u7ygsnaf>Nome (Z - A)</option><option value="lessons_desc" data-astro-cid-u7ygsnaf>Mais Aulas</option><option value="progress_desc" data-astro-cid-u7ygsnaf>Maior Progresso</option></select></div></div><button type="button" id="reset-filters-btn" class="btn btn-ghost btn-reset" style="display: none;" data-astro-cid-u7ygsnaf><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u7ygsnaf><polyline points="1 4 1 10 7 10" data-astro-cid-u7ygsnaf></polyline><polyline points="23 20 23 14 17 14" data-astro-cid-u7ygsnaf></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" data-astro-cid-u7ygsnaf></path></svg><span data-astro-cid-u7ygsnaf>Limpar Filtros</span></button></div>`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseFilters.astro", void 0);
//#endregion
//#region src/pages/courses.astro
var courses_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Courses,
	file: () => $$file,
	url: () => $$url
});
var $$Courses = createComponent(($$result, $$props, $$slots) => {
	const courses = getAllCourses();
	const categories = getCategories();
	const providers = getAllProviders();
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Catálogo Completo — Mindflix",
		"description": "Explore todos os cursos disponíveis na sua biblioteca pessoal com filtros avançados e busca em tempo real.",
		"data-astro-cid-zhpjsyeu": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container catalog-page-container" data-astro-cid-zhpjsyeu><header class="catalog-header" data-astro-cid-zhpjsyeu><h1 class="catalog-title" data-astro-cid-zhpjsyeu>Catálogo de Cursos</h1><p class="catalog-subtitle" data-astro-cid-zhpjsyeu>Explore sua biblioteca completa com mais de ${courses.length} cursos organizados por especialidade.</p></header><div class="catalog-controls" data-astro-cid-zhpjsyeu>${renderComponent($$result, "SearchBar", $$SearchBar, {
		"placeholder": "Pesquise por curso, tecnologia, módulo ou fornecedor...",
		"data-astro-cid-zhpjsyeu": true
	})}${renderComponent($$result, "CourseFilters", $$CourseFilters, {
		"categories": categories,
		"providers": providers,
		"data-astro-cid-zhpjsyeu": true
	})}<!-- Active Filter Chips (Section 33) --><div class="active-filter-chips" id="active-filter-chips" style="display: none;" data-astro-cid-zhpjsyeu><span class="chips-label" data-astro-cid-zhpjsyeu>Filtros ativos:</span><div class="chips-list" id="chips-list" data-astro-cid-zhpjsyeu></div></div></div><!-- Course Grid --><div class="courses-grid" id="catalog-grid" data-astro-cid-zhpjsyeu>${courses.map((course) => {
		const corpus = [
			course.display_title,
			course.provider,
			...course.tags,
			...course.modules.map((m) => m.display_title),
			...course.modules.flatMap((m) => m.lessons.map((l) => l.display_title))
		].join(" ");
		return renderTemplate`<div class="course-grid-item"${addAttribute(course.display_title.toLowerCase(), "data-title")}${addAttribute(course.provider, "data-provider")}${addAttribute(course.categories.join(","), "data-categories")}${addAttribute(course.tags.join(",").toLowerCase(), "data-tags")}${addAttribute(corpus, "data-corpus")}${addAttribute(course.id, "data-course-id")} data-astro-cid-zhpjsyeu>${renderComponent($$result, "CourseCard", $$CourseCard, {
			"course": course,
			"data-astro-cid-zhpjsyeu": true
		})}</div>`;
	})}</div><!-- Empty Results Fallback --><div id="no-results-state" style="display: none;" data-astro-cid-zhpjsyeu>${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Nenhum curso encontrado",
		"description": "Tente ajustar os termos de pesquisa ou resetar os filtros selecionados para ver mais resultados.",
		"actionText": "Ver Todos os Cursos",
		"actionHref": "/courses",
		"data-astro-cid-zhpjsyeu": true
	})}</div></div>` })}${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/courses.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/courses.astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/courses.astro";
var $$url = "/courses";
//#endregion
//#region \0virtual:astro:page:src/pages/courses@_@astro
var page = () => courses_exports;
//#endregion
export { page };
