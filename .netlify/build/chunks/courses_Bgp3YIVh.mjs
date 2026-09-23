import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { H as createAstro, M as maybeRenderHead, P as addAttribute, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
import { c as isComecePorAqui, n as getAllProviders, r as getCategories, t as getAllCourses } from "./catalog_BH-ygd_W.mjs";
import { t as getCourseSourceId } from "./sources_NGS4vvxz.mjs";
import { t as $$CourseCard } from "./CourseCard_umbSu6TR.mjs";
import { n as $$HeroCourse, t as $$TrilhaCard } from "./TrilhaCard_BshegjWH.mjs";
import { t as getAllTrilhas } from "./trilhas_CUzDCp4m.mjs";
import { t as $$EmptyState } from "./EmptyState_DWk5PmmX.mjs";
//#region src/components/SearchBar.astro
createAstro("https://astro.build");
var $$SearchBar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SearchBar;
	const { placeholder = "Pesquisar cursos, módulos, aulas ou buscar por assunto...", initialValue = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="search-bar-component" data-astro-cid-u57zkn3a><div class="search-input-wrapper" data-astro-cid-u57zkn3a><svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u57zkn3a><circle cx="11" cy="11" r="8" data-astro-cid-u57zkn3a></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-u57zkn3a></line></svg><input type="text" id="global-search-input" class="search-input"${addAttribute(placeholder, "placeholder")}${addAttribute(initialValue, "value")} autocomplete="off" data-astro-cid-u57zkn3a><button type="button" id="clear-search-btn" class="clear-btn" aria-label="Limpar pesquisa" style="display: none;" data-astro-cid-u57zkn3a><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u57zkn3a><line x1="18" y1="6" x2="6" y2="18" data-astro-cid-u57zkn3a></line><line x1="6" y1="6" x2="18" y2="18" data-astro-cid-u57zkn3a></line></svg></button><!-- Trigger AI Subject Search Modal button --><button type="button" id="trigger-ai-modal-btn" class="search-ai-shortcut-btn" title="Buscar por assunto nas transcrições com IA" data-astro-cid-u57zkn3a><span class="ai-sparkle" data-astro-cid-u57zkn3a>✦</span><span class="ai-btn-label" data-astro-cid-u57zkn3a>Buscar Assunto (IA)</span></button></div><!-- Quick Type Filters Bar --><div class="search-quick-filters" data-astro-cid-u57zkn3a><span class="quick-filter-label" data-astro-cid-u57zkn3a>Filtro:</span><button type="button" class="quick-filter-chip active" data-type="all" data-astro-cid-u57zkn3a>Todos</button><button type="button" class="quick-filter-chip" data-type="course" data-astro-cid-u57zkn3a>Cursos</button><button type="button" class="quick-filter-chip" data-type="module" data-astro-cid-u57zkn3a>Módulos</button><button type="button" class="quick-filter-chip" data-type="lesson" data-astro-cid-u57zkn3a>Aulas</button><button type="button" class="quick-filter-chip chip-ai" data-type="ai" data-astro-cid-u57zkn3a><span class="ai-sparkle" data-astro-cid-u57zkn3a>✦</span> Buscar por Assunto (IA)</button></div></div>${renderScript($$result, "D:/projetos antigravity/mindflix/src/components/SearchBar.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/components/SearchBar.astro", void 0);
//#endregion
//#region src/components/CourseFilters.astro
createAstro("https://astro.build");
var $$CourseFilters = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CourseFilters;
	const { categories, providers, selectedCategory = "", selectedProvider = "" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="filters-bar" id="course-filters-bar" data-astro-cid-u7ygsnaf><div class="filters-group" data-astro-cid-u7ygsnaf><!-- Content Type Filter --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-type" class="filter-label" data-astro-cid-u7ygsnaf>Tipo</label><select id="filter-type" class="filter-select" data-astro-cid-u7ygsnaf><option value="" data-astro-cid-u7ygsnaf>Todos (Cursos & Trilhas)</option><option value="course" data-astro-cid-u7ygsnaf>Apenas Cursos</option><option value="trilha" data-astro-cid-u7ygsnaf>Apenas Trilhas</option></select></div><!-- Category Filter --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-category" class="filter-label" data-astro-cid-u7ygsnaf>Categoria</label><select id="filter-category" class="filter-select" data-astro-cid-u7ygsnaf><option value="" data-astro-cid-u7ygsnaf>Todas as Categorias</option>${categories.map((cat) => renderTemplate`<option${addAttribute(cat.id, "value")}${addAttribute(selectedCategory === cat.id, "selected")} data-astro-cid-u7ygsnaf>${cat.name}</option>`)}</select></div><!-- Provider Filter --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-provider" class="filter-label" data-astro-cid-u7ygsnaf>Fornecedor</label><select id="filter-provider" class="filter-select" data-astro-cid-u7ygsnaf><option value="" data-astro-cid-u7ygsnaf>Todos os Fornecedores</option>${providers.map((prov) => renderTemplate`<option${addAttribute(prov, "value")}${addAttribute(selectedProvider === prov, "selected")} data-astro-cid-u7ygsnaf>${prov}</option>`)}</select></div><!-- Status Filter --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-status" class="filter-label" data-astro-cid-u7ygsnaf>Status</label><select id="filter-status" class="filter-select" data-astro-cid-u7ygsnaf><option value="" data-astro-cid-u7ygsnaf>Todos os Status</option><option value="not_started" data-astro-cid-u7ygsnaf>Não iniciado</option><option value="in_progress" data-astro-cid-u7ygsnaf>Em andamento</option><option value="completed" data-astro-cid-u7ygsnaf>Concluído</option><option value="favorited" data-astro-cid-u7ygsnaf>Favoritos</option></select></div><!-- Sorting --><div class="filter-item" data-astro-cid-u7ygsnaf><label for="filter-sort" class="filter-label" data-astro-cid-u7ygsnaf>Ordenar por</label><select id="filter-sort" class="filter-select" data-astro-cid-u7ygsnaf><option value="recent" data-astro-cid-u7ygsnaf>Relevância / Destaques</option><option value="az" data-astro-cid-u7ygsnaf>Nome (A - Z)</option><option value="za" data-astro-cid-u7ygsnaf>Nome (Z - A)</option><option value="lessons_desc" data-astro-cid-u7ygsnaf>Mais Aulas</option><option value="progress_desc" data-astro-cid-u7ygsnaf>Maior Progresso</option></select></div></div><button type="button" id="reset-filters-btn" class="btn btn-ghost btn-reset" style="display: none;" data-astro-cid-u7ygsnaf><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-u7ygsnaf><polyline points="1 4 1 10 7 10" data-astro-cid-u7ygsnaf></polyline><polyline points="23 20 23 14 17 14" data-astro-cid-u7ygsnaf></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" data-astro-cid-u7ygsnaf></path></svg><span data-astro-cid-u7ygsnaf>Limpar Filtros</span></button></div>`;
}, "D:/projetos antigravity/mindflix/src/components/CourseFilters.astro", void 0);
//#endregion
//#region src/pages/courses.astro
var courses_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Courses,
	file: () => $$file,
	url: () => $$url
});
var $$Courses = createComponent(($$result, $$props, $$slots) => {
	const courses = getAllCourses().filter((c) => !isComecePorAqui(c));
	const trilhas = getAllTrilhas();
	const categories = getCategories();
	const providers = getAllProviders();
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Catálogo Completo — Mindflix",
		"description": "Explore todos os cursos e trilhas de formação disponíveis na sua biblioteca pessoal com filtros avançados e busca em tempo real.",
		"data-astro-cid-zhpjsyeu": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "HeroCourse", $$HeroCourse, { "data-astro-cid-zhpjsyeu": true })}${maybeRenderHead($$result)}<div class="container catalog-page-container" data-astro-cid-zhpjsyeu><header class="catalog-header" data-astro-cid-zhpjsyeu><h1 class="catalog-title" data-astro-cid-zhpjsyeu>Catálogo de Cursos & Trilhas</h1><p class="catalog-subtitle" id="catalog-subtitle" data-astro-cid-zhpjsyeu>Explore sua biblioteca completa com mais de ${courses.length} cursos e ${trilhas.length} trilhas estruturadas.</p></header><div class="catalog-controls" data-astro-cid-zhpjsyeu>${renderComponent($$result, "SearchBar", $$SearchBar, {
		"placeholder": "Pesquise por curso, trilha, tecnologia, módulo ou fornecedor...",
		"data-astro-cid-zhpjsyeu": true
	})}${renderComponent($$result, "CourseFilters", $$CourseFilters, {
		"categories": categories,
		"providers": providers,
		"data-astro-cid-zhpjsyeu": true
	})}<!-- Active Filter Chips (Section 33) --><div class="active-filter-chips" id="active-filter-chips" style="display: none;" data-astro-cid-zhpjsyeu><span class="chips-label" data-astro-cid-zhpjsyeu>Filtros ativos:</span><div class="chips-list" id="chips-list" data-astro-cid-zhpjsyeu></div></div></div><!-- Course & Trilha Grid --><div class="courses-grid" id="catalog-grid" data-astro-cid-zhpjsyeu>${courses.map((course, idx) => {
		const corpus = [
			course.display_title,
			course.provider,
			...course.tags,
			...course.modules.map((m) => m.display_title),
			...course.modules.flatMap((m) => m.lessons.map((l) => l.display_title))
		].join(" ");
		const sourceId = getCourseSourceId(course);
		return renderTemplate`<div class="course-grid-item" data-type="course"${addAttribute(course.display_title.toLowerCase(), "data-title")}${addAttribute(course.provider, "data-provider")}${addAttribute(course.categories.join(","), "data-categories")}${addAttribute(course.tags.join(",").toLowerCase(), "data-tags")}${addAttribute(corpus, "data-corpus")}${addAttribute(course.id, "data-course-id")}${addAttribute(sourceId, "data-source")} data-astro-cid-zhpjsyeu>${renderComponent($$result, "CourseCard", $$CourseCard, {
			"course": course,
			"loading": idx < 4 ? "eager" : "lazy",
			"fetchpriority": idx < 2 ? "high" : "auto",
			"data-astro-cid-zhpjsyeu": true
		})}</div>`;
	})}${trilhas.map((trilha) => {
		const corpus = [
			trilha.title,
			trilha.provider,
			trilha.description,
			...trilha.courses.map((c) => c.course_title || c.nome_trilha)
		].join(" ");
		return renderTemplate`<div class="course-grid-item" data-type="trilha"${addAttribute(trilha.title.toLowerCase(), "data-title")}${addAttribute(trilha.provider, "data-provider")} data-categories="trilha" data-tags="trilha,formacao,trilhas"${addAttribute(corpus, "data-corpus")}${addAttribute(trilha.id, "data-trilha-id")}${addAttribute(trilha.source, "data-source")} data-astro-cid-zhpjsyeu>${renderComponent($$result, "TrilhaCard", $$TrilhaCard, {
			"trilha": trilha,
			"data-astro-cid-zhpjsyeu": true
		})}</div>`;
	})}</div><!-- Empty Results Fallback --><div id="no-results-state" style="display: none;" data-astro-cid-zhpjsyeu>${renderComponent($$result, "EmptyState", $$EmptyState, {
		"title": "Nenhum conteúdo encontrado",
		"description": "Tente ajustar os termos de pesquisa ou selecionar outra opção de filtro acima.",
		"actionText": "Ver Todo o Catálogo",
		"actionHref": "/courses",
		"data-astro-cid-zhpjsyeu": true
	})}</div></div>` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/courses.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/courses.astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/courses.astro";
var $$url = "/courses";
//#endregion
//#region \0virtual:astro:page:src/pages/courses@_@astro
var page = () => courses_exports;
//#endregion
export { page };
