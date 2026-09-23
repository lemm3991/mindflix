import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { E as Fragment, F as defineScriptVars, H as createAstro, M as maybeRenderHead, P as addAttribute, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { t as $$Layout } from "./Layout_DQEGFcGL.mjs";
import { c as isComecePorAqui, l as isPlayableVideoLesson, o as getFirstPlayableLesson, t as getAllCourses, u as isProjectCourse } from "./catalog_BH-ygd_W.mjs";
import { n as getSourceById, r as normalizeSourceId } from "./sources_NGS4vvxz.mjs";
import { t as $$CourseCard } from "./CourseCard_umbSu6TR.mjs";
import { n as $$HeroCourse } from "./TrilhaCard_BshegjWH.mjs";
import { n as $$CourseRow, t as $$TrilhasRow } from "./TrilhasRow_BKrWU9U7.mjs";
//#region src/pages/source/[id].astro
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
	const sourceId = normalizeSourceId(id || "");
	if (sourceId === "all") return Astro.redirect("/");
	const source = getSourceById(sourceId);
	if (!source) return Astro.redirect("/");
	const sourceCourses = getAllCourses().filter((c) => {
		if (c.is_hidden || c.missing || isComecePorAqui(c) || isProjectCourse(c)) return false;
		const directSrc = (c.source || "").toLowerCase();
		const rel = (c.modules?.[0]?.lessons?.[0]?.relative_path || c.relative_path || "").toLowerCase();
		if (source.id === "hashtag-soft-skills") return directSrc === "hashtag-soft-skills" || directSrc === "hashtag_soft_skills" || rel.includes("hashtag/soft skills") || rel.includes("hashtag\\soft skills");
		if (source.id === "asimov-skills") return directSrc === "asimov-skills" || directSrc === "asimov_skills" || rel.includes("asimov skills") || rel.includes("asimov/asimov skills") || rel.includes("asimov\\asimov skills");
		if (source.id === "ailab") return directSrc === "ailab" || directSrc === "ai-lab" || rel.startsWith("ai lab") || rel.includes("/ai lab") || rel.includes("\\ai lab") || (c.provider || "").toLowerCase().includes("ai lab");
		if (source.id === "asimov") return !(directSrc === "asimov-skills" || directSrc === "asimov_skills" || rel.includes("asimov skills")) && (directSrc === "asimov" || rel.startsWith("asimov") || rel.includes("/asimov") || rel.includes("\\asimov") || (c.provider || "").toLowerCase().includes("asimov"));
		if (source.id === "hashtag") return !(directSrc === "hashtag-soft-skills" || directSrc === "hashtag_soft_skills" || rel.includes("soft skills")) && (directSrc === "hashtag" || rel.includes("hashtag") || (c.provider || "").toLowerCase().includes("hashtag") || (c.display_title || "").toLowerCase().includes("impressionador"));
		if (source.id === "sctec") return directSrc === "sctec" || rel.startsWith("sctec") || rel.includes("/sctec") || rel.includes("\\sctec") || (c.provider || "").toLowerCase().includes("sctec");
		if (source.id === "outros") return directSrc === "outros" || directSrc === "diversos" || !rel.includes("asimov") && !rel.includes("hashtag") && !rel.includes("sctec") && !rel.includes("ai lab");
		return false;
	});
	const totalCourses = sourceCourses.length;
	const totalLessons = sourceCourses.reduce((sum, c) => {
		const modLessons = (c.modules || []).reduce((mSum, m) => mSum + (m.lessons?.length || 0), 0);
		return sum + (c.lessons_count || modLessons || 0);
	}, 0);
	const totalSeconds = sourceCourses.reduce((sum, c) => sum + (c.duration_seconds || 0), 0);
	const totalHours = Math.round(totalSeconds / 3600);
	const eligibleHero = sourceCourses.filter((c) => {
		const firstVideo = getFirstPlayableLesson(c);
		return Boolean(firstVideo && isPlayableVideoLesson(firstVideo));
	});
	function shuffle(arr, count = 4) {
		const copy = [...arr];
		for (let i = copy.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[copy[i], copy[j]] = [copy[j], copy[i]];
		}
		return copy.slice(0, count);
	}
	const featuredCourses = eligibleHero.length > 0 ? shuffle(eligibleHero, Math.min(4, eligibleHero.length)) : shuffle(sourceCourses, Math.min(4, sourceCourses.length));
	const categoryMap = /* @__PURE__ */ new Map();
	sourceCourses.forEach((course) => {
		course.categories.forEach((cat) => {
			if (!categoryMap.has(cat)) categoryMap.set(cat, []);
			categoryMap.get(cat).push(course);
		});
	});
	const categoryRows = Array.from(categoryMap.entries()).filter(([_, list]) => list.length >= 2).sort((a, b) => b[1].length - a[1].length);
	const categoryLabels = {
		"ia": "Inteligência Artificial & LLMs",
		"automacao-agentes": "Automação & Agentes de IA",
		"web-vibe-coding": "Web, Apps & Vibe Coding",
		"programacao-dev": "Programação & Engenharia de Software",
		"backend-infra": "Backend, Bancos de Dados & Infra",
		"dados-datascience": "Ciência de Dados & Dashboards",
		"python": "Ecossistema Python Aplicado",
		"trading": "Trading & Algoritmos Financeiros",
		"desenvolvimento-pessoal": "Desenvolvimento Pessoal & Alta Performance"
	};
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${source.name} — Mindflix`,
		"data-astro-cid-nfik4jol": true
	}, { "default": ($$result) => renderTemplate`${featuredCourses.length > 0 ? renderTemplate`${renderComponent($$result, "HeroCourse", $$HeroCourse, {
		"featuredCourses": featuredCourses,
		"data-astro-cid-nfik4jol": true
	})}` : renderTemplate`${maybeRenderHead($$result)}<div class="source-header-hero"${addAttribute(`--source-color: ${source.color};`, "style")} data-astro-cid-nfik4jol><div class="container" data-astro-cid-nfik4jol><div class="source-hero-content" data-astro-cid-nfik4jol><div class="source-hero-badge"${addAttribute(`background: ${source.color}20; border-color: ${source.color}40; color: ${source.color};`, "style")} data-astro-cid-nfik4jol><span class="source-hero-dot"${addAttribute(`background: ${source.color}; box-shadow: 0 0 10px ${source.color};`, "style")} data-astro-cid-nfik4jol></span><span data-astro-cid-nfik4jol>${source.badge}</span></div><h1 class="source-hero-title" data-astro-cid-nfik4jol>${source.name}</h1><p class="source-hero-desc" data-astro-cid-nfik4jol>${source.description}</p><div class="source-hero-metrics" data-astro-cid-nfik4jol><div class="hero-metric-pill" data-astro-cid-nfik4jol><span class="metric-num" data-astro-cid-nfik4jol>${totalCourses}</span><span class="metric-name" data-astro-cid-nfik4jol>Cursos</span></div><div class="hero-metric-pill" data-astro-cid-nfik4jol><span class="metric-num" data-astro-cid-nfik4jol>${totalLessons}</span><span class="metric-name" data-astro-cid-nfik4jol>Aulas</span></div>${totalHours > 0 && renderTemplate`<div class="hero-metric-pill" data-astro-cid-nfik4jol><span class="metric-num" data-astro-cid-nfik4jol>${totalHours}h</span><span class="metric-name" data-astro-cid-nfik4jol>de Conteúdo</span></div>`}</div></div></div></div>`}<div class="source-identity-bar"${addAttribute(`--source-color: ${source.color};`, "style")} data-astro-cid-nfik4jol><div class="container source-bar-inner" data-astro-cid-nfik4jol><div class="source-bar-left" data-astro-cid-nfik4jol><div class="source-bar-icon-wrap"${addAttribute(`background: ${source.color}20; border-color: ${source.color}40; color: ${source.color};`, "style")} data-astro-cid-nfik4jol><span class="source-bar-dot"${addAttribute(`background: ${source.color}; box-shadow: 0 0 12px ${source.color};`, "style")} data-astro-cid-nfik4jol></span></div><div class="source-bar-text" data-astro-cid-nfik4jol><div class="source-bar-title-row" data-astro-cid-nfik4jol><h2 class="source-bar-title" data-astro-cid-nfik4jol>${source.name}</h2><span class="source-bar-pill" data-astro-cid-nfik4jol>${source.badge}</span></div><p class="source-bar-desc" data-astro-cid-nfik4jol>${source.description}</p></div></div><div class="source-bar-stats" data-astro-cid-nfik4jol><div class="source-stat-item" data-astro-cid-nfik4jol><strong data-astro-cid-nfik4jol>${totalCourses}</strong><span data-astro-cid-nfik4jol>Cursos</span></div><div class="source-stat-divider" data-astro-cid-nfik4jol></div><div class="source-stat-item" data-astro-cid-nfik4jol><strong data-astro-cid-nfik4jol>${totalLessons}</strong><span data-astro-cid-nfik4jol>Aulas</span></div>${totalHours > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<div class="source-stat-divider" data-astro-cid-nfik4jol></div><div class="source-stat-item" data-astro-cid-nfik4jol><strong data-astro-cid-nfik4jol>${totalHours}h</strong><span data-astro-cid-nfik4jol>Duração</span></div>` })}`}</div></div></div>${(source.id === "asimov" || source.id === "hashtag" || source.id === "hashtag-soft-skills" || source.id === "ailab" || source.id === "sctec") && renderTemplate`${renderComponent($$result, "TrilhasRow", $$TrilhasRow, {
		"source": source.id,
		"title": source.id === "sctec" ? "Trilhas de Formação SCTEC" : source.id === "ailab" ? "Trilha de Formação AI LAB" : source.id === "hashtag-soft-skills" ? "Trilhas de Soft Skills & Alta Performance" : source.id === "hashtag" ? "Formações Impressionador" : "Trilhas de Aprendizado",
		"badge": source.id === "sctec" ? "Formações Oficiais SCTEC" : source.id === "ailab" ? "Formação Oficial AI LAB" : source.id.startsWith("hashtag") ? "Formações Oficiais Hashtag" : "Formações Oficiais Asimov",
		"subtitle": source.id === "sctec" ? "Formações aceleradas em Carreira Tech, IA, Data Science, Front-End e Back-End." : source.id === "ailab" ? "Trilha completa para criação e monetização de influenciadores digitais ultrarrealistas com IA." : source.id === "hashtag-soft-skills" ? "Trilhas completas de desenvolvimento pessoal, inteligência emocional, oratória e liderança." : source.id === "hashtag" ? "Formações completas de IA, Low-Code, Claude, Lovable, Supabase e automações da Hashtag." : "Sequências completas e cronológicas de cursos e projetos para dominar uma especialidade.",
		"data-astro-cid-nfik4jol": true
	})}`}<div class="container source-page-content" data-astro-cid-nfik4jol><!-- Dynamic Priority Row: Continue Estudando nesta Fonte --><div id="continue-studying-section" class="dynamic-row" style="display: none;" data-astro-cid-nfik4jol><div class="dynamic-row-header" data-astro-cid-nfik4jol><div class="title-with-badge" data-astro-cid-nfik4jol><h2 class="row-title" data-astro-cid-nfik4jol>Continuar Estudando em ${source.shortName}</h2><span class="badge badge-cyan" data-astro-cid-nfik4jol>Retomar em 1 Clique</span></div><span class="row-subtitle" data-astro-cid-nfik4jol>Aulas em andamento desta fonte</span></div><div class="dynamic-grid" id="continue-studying-grid" data-astro-cid-nfik4jol></div></div><!-- Categorized Streaming Rows for this Source -->${categoryRows.length > 0 && renderTemplate`<div class="source-category-rows" data-astro-cid-nfik4jol>${categoryRows.slice(0, 4).map(([catId, courses]) => renderTemplate`${renderComponent($$result, "CourseRow", $$CourseRow, {
		"title": categoryLabels[catId] || catId,
		"courses": courses,
		"viewAllHref": `/courses?category=${catId}&source=${source.id}`,
		"eagerCount": 2,
		"data-astro-cid-nfik4jol": true
	})}`)}</div>`}<!-- Complete Catalog Section for this Source --><section class="source-catalog-section" id="source-all-courses" data-astro-cid-nfik4jol><div class="catalog-section-header" data-astro-cid-nfik4jol><div class="catalog-title-group" data-astro-cid-nfik4jol><h2 class="catalog-heading" data-astro-cid-nfik4jol>Todos os Cursos de ${source.shortName}</h2><span class="catalog-counter" id="source-catalog-counter" data-astro-cid-nfik4jol>Exibindo ${sourceCourses.length} cursos</span></div><!-- Filter & Search Controls --><div class="source-controls-row" data-astro-cid-nfik4jol><div class="search-box-wrap" data-astro-cid-nfik4jol><svg class="search-box-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-nfik4jol><circle cx="11" cy="11" r="8" data-astro-cid-nfik4jol></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-nfik4jol></line></svg><input type="text" id="source-search-input"${addAttribute(`Buscar cursos em ${source.shortName}...`, "placeholder")}${addAttribute(`Buscar em ${source.shortName}`, "aria-label")} data-astro-cid-nfik4jol></div><div class="filter-selects-wrap" data-astro-cid-nfik4jol><select id="source-category-select" aria-label="Filtrar por Categoria" data-astro-cid-nfik4jol><option value="" data-astro-cid-nfik4jol>Todas as Categorias</option>${Array.from(categoryMap.keys()).map((catId) => renderTemplate`<option${addAttribute(catId, "value")} data-astro-cid-nfik4jol>${categoryLabels[catId] || catId}</option>`)}</select><select id="source-status-select" aria-label="Filtrar por Status" data-astro-cid-nfik4jol><option value="" data-astro-cid-nfik4jol>Todos os Status</option><option value="in_progress" data-astro-cid-nfik4jol>Em Andamento</option><option value="completed" data-astro-cid-nfik4jol>Concluídos</option><option value="not_started" data-astro-cid-nfik4jol>Não Iniciados</option><option value="favorited" data-astro-cid-nfik4jol>Favoritados</option></select><select id="source-sort-select" aria-label="Ordenar Cursos" data-astro-cid-nfik4jol><option value="recommended" data-astro-cid-nfik4jol>Recomendados</option><option value="az" data-astro-cid-nfik4jol>Nome (A - Z)</option><option value="za" data-astro-cid-nfik4jol>Nome (Z - A)</option><option value="lessons" data-astro-cid-nfik4jol>Mais Aulas</option></select></div></div></div><!-- Course Grid --><div class="source-courses-grid" id="source-courses-grid" data-astro-cid-nfik4jol>${sourceCourses.map((course, idx) => renderTemplate`<div class="source-course-card-wrap"${addAttribute(course.id, "data-course-id")}${addAttribute(course.display_title || course.raw_title, "data-title")}${addAttribute(course.categories.join(","), "data-categories")}${addAttribute(course.lessons_count || 0, "data-lessons-count")} data-astro-cid-nfik4jol>${renderComponent($$result, "CourseCard", $$CourseCard, {
		"course": course,
		"loading": idx < 8 ? "eager" : "lazy",
		"fetchpriority": idx < 4 ? "high" : "auto",
		"data-astro-cid-nfik4jol": true
	})}</div>`)}</div><!-- Empty Filter State --><div class="source-empty-state" id="source-empty-state" style="display: none;" data-astro-cid-nfik4jol><div class="empty-icon" data-astro-cid-nfik4jol>🔍</div><h3 class="empty-title" data-astro-cid-nfik4jol>Nenhum curso encontrado</h3><p class="empty-desc" data-astro-cid-nfik4jol>Tente ajustar seus termos de busca ou filtros.</p><button type="button" class="btn btn-secondary btn-sm" id="btn-clear-filters" data-astro-cid-nfik4jol>Limpar Filtros</button></div></section></div>` })}<script>(function(){${defineScriptVars({ currentSourceId: source.id })}
  // Client-side interactions for Source Page
  import { getAllLocalProgress, getRecentCourseIds, isCourseFavorite, getCourseCompletionStats } from '../../lib/progress';
  import { setActiveSource } from '../../lib/sources';

  // Ensure active source is synchronized in navbar and local storage
  setActiveSource(currentSourceId);

  // 1. Render "Continuar Estudando nesta Fonte"
  function renderContinueStudying() {
    const continueSection = document.getElementById('continue-studying-section');
    const continueGrid = document.getElementById('continue-studying-grid');
    if (!continueSection || !continueGrid) return;

    const allCards = Array.from(document.querySelectorAll<HTMLElement>('.source-course-card-wrap'));
    const cardsToClone: HTMLElement[] = [];

    allCards.forEach(cardWrapper => {
      const courseId = cardWrapper.getAttribute('data-course-id');
      if (!courseId) return;

      const stats = getCourseCompletionStats(courseId, 100);
      if (stats.percentage > 0 && stats.percentage < 90) {
        const cloned = cardWrapper.cloneNode(true) as HTMLElement;
        cloned.style.display = 'block';
        cardsToClone.push(cloned);
      }
    });

    continueGrid.innerHTML = '';
    if (cardsToClone.length > 0) {
      continueSection.style.display = 'block';
      cardsToClone.slice(0, 4).forEach(card => continueGrid.appendChild(card));
    } else {
      continueSection.style.display = 'none';
    }
  }

  // 2. Filter & Sort Source Courses Grid
  const searchInput = document.getElementById('source-search-input') as HTMLInputElement | null;
  const categorySelect = document.getElementById('source-category-select') as HTMLSelectElement | null;
  const statusSelect = document.getElementById('source-status-select') as HTMLSelectElement | null;
  const sortSelect = document.getElementById('source-sort-select') as HTMLSelectElement | null;
  const counterEl = document.getElementById('source-catalog-counter');
  const emptyEl = document.getElementById('source-empty-state');
  const gridEl = document.getElementById('source-courses-grid');
  const clearBtn = document.getElementById('btn-clear-filters');

  function norm(str: string): string {
    return str.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').trim();
  }

  function filterAndSortCourses() {
    const query = norm(searchInput?.value || '');
    const selectedCat = categorySelect?.value || '';
    const selectedStatus = statusSelect?.value || '';
    const selectedSort = sortSelect?.value || 'recommended';

    const cardWrappers = Array.from(document.querySelectorAll<HTMLElement>('#source-courses-grid .source-course-card-wrap'));
    let visibleCount = 0;

    cardWrappers.forEach(wrapper => {
      const title = norm(wrapper.getAttribute('data-title') || '');
      const categories = (wrapper.getAttribute('data-categories') || '').split(',');
      const courseId = wrapper.getAttribute('data-course-id') || '';

      const matchesSearch = !query || title.includes(query);
      const matchesCategory = !selectedCat || categories.includes(selectedCat);

      let matchesStatus = true;
      if (selectedStatus) {
        const stats = getCourseCompletionStats(courseId, 100);
        const isFav = isCourseFavorite(courseId);
        if (selectedStatus === 'not_started') matchesStatus = stats.percentage === 0;
        else if (selectedStatus === 'in_progress') matchesStatus = stats.percentage > 0 && stats.percentage < 90;
        else if (selectedStatus === 'completed') matchesStatus = stats.percentage >= 90;
        else if (selectedStatus === 'favorited') matchesStatus = isFav;
      }

      if (matchesSearch && matchesCategory && matchesStatus) {
        wrapper.style.display = 'block';
        visibleCount++;
      } else {
        wrapper.style.display = 'none';
      }
    });

    if (counterEl) {
      counterEl.textContent = \`Exibindo \${visibleCount} curso(s)\`;
    }

    if (emptyEl) {
      emptyEl.style.display = visibleCount === 0 ? 'flex' : 'none';
    }

    // Sort visible items
    if (gridEl && visibleCount > 0) {
      const visibleItems = cardWrappers.filter(w => w.style.display !== 'none');
      visibleItems.sort((a, b) => {
        const titleA = a.getAttribute('data-title') || '';
        const titleB = b.getAttribute('data-title') || '';
        const lessonsA = parseInt(a.getAttribute('data-lessons-count') || '0', 10);
        const lessonsB = parseInt(b.getAttribute('data-lessons-count') || '0', 10);

        if (selectedSort === 'az') return titleA.localeCompare(titleB);
        if (selectedSort === 'za') return titleB.localeCompare(titleA);
        if (selectedSort === 'lessons') return lessonsB - lessonsA;
        return 0; // recommended / original
      });

      visibleItems.forEach(item => gridEl.appendChild(item));
    }
  }

  searchInput?.addEventListener('input', filterAndSortCourses);
  categorySelect?.addEventListener('change', filterAndSortCourses);
  statusSelect?.addEventListener('change', filterAndSortCourses);
  sortSelect?.addEventListener('change', filterAndSortCourses);

  clearBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = '';
    if (statusSelect) statusSelect.value = '';
    if (sortSelect) sortSelect.value = 'recommended';
    filterAndSortCourses();
  });

  document.addEventListener('astro:page-load', () => {
    renderContinueStudying();
    filterAndSortCourses();
  });

  renderContinueStudying();
  filterAndSortCourses();
})();<\/script>`;
}, "D:/projetos antigravity/mindflix/src/pages/source/[id].astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/source/[id].astro";
var $$url = "/source/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/source/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
