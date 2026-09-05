import { c as renderSlot, d as renderTemplate, f as maybeRenderHead, g as createRenderInstruction, h as defineScriptVars, i as renderComponent, m as addAttribute, p as renderHead, w as createAstro } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { t as getAllCourses } from "./catalog__AHOIgcN.mjs";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/components/Navbar.astro
createAstro("https://astro.build");
var $$Navbar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Navbar;
	const { currentPath = "/" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<header class="navbar" id="main-navbar" data-astro-cid-l7arcky5><div class="container nav-content" data-astro-cid-l7arcky5><div class="nav-left" data-astro-cid-l7arcky5><a href="/" class="brand-logo" aria-label="Mindflix Home" data-astro-cid-l7arcky5><span class="logo-icon" data-astro-cid-l7arcky5><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-l7arcky5><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-l7arcky5></polygon></svg></span><span class="logo-text" data-astro-cid-l7arcky5>MIND<span data-astro-cid-l7arcky5>FLIX</span></span></a><nav class="nav-links" aria-label="Menu Principal" data-astro-cid-l7arcky5>${[
		{
			label: "Início",
			href: "/"
		},
		{
			label: "Cursos",
			href: "/courses"
		},
		{
			label: "Categorias",
			href: "/categories"
		},
		{
			label: "Minha Lista",
			href: "/my-list"
		},
		{
			label: "Biblioteca",
			href: "/library"
		}
	].map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`nav-link ${currentPath === item.href ? "active" : ""}`, "class")} data-astro-cid-l7arcky5>${item.label}</a>`)}</nav></div><div class="nav-right" data-astro-cid-l7arcky5><!-- Command Palette Trigger Button --><button type="button" class="cmd-trigger-btn" id="open-search-modal-btn" aria-label="Abrir busca (Ctrl+K)" data-astro-cid-l7arcky5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-l7arcky5><circle cx="11" cy="11" r="8" data-astro-cid-l7arcky5></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-l7arcky5></line></svg><span class="cmd-trigger-text" data-astro-cid-l7arcky5>Buscar cursos...</span><div class="cmd-badges" data-astro-cid-l7arcky5><kbd class="cmd-kbd" data-astro-cid-l7arcky5>Ctrl</kbd><kbd class="cmd-kbd" data-astro-cid-l7arcky5>K</kbd></div></button><!-- Profile Avatar Button --><div class="user-menu-container" data-astro-cid-l7arcky5><a href="/profile" class="user-avatar-btn" aria-label="Perfil do Usuário" data-astro-cid-l7arcky5><div class="avatar-circle" data-astro-cid-l7arcky5><span id="user-initials" data-astro-cid-l7arcky5>ED</span></div></a></div></div></div></header>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/Navbar.astro", void 0);
//#endregion
//#region src/components/InteractiveBackground.astro
createAstro("https://astro.build");
var $$InteractiveBackground = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$InteractiveBackground;
	const { disableInteraction = false } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="bg-viewport" aria-hidden="true" data-astro-cid-jezl3i2q><!-- Subtle ambient glow orbs --><div class="glow-orb orb-cyan" data-astro-cid-jezl3i2q></div><div class="glow-orb orb-indigo" data-astro-cid-jezl3i2q></div><div class="glow-orb orb-purple" data-astro-cid-jezl3i2q></div><!-- Interactive Canvas Lines & Particles --><canvas id="interactive-lines-canvas" class="interactive-lines-canvas"${addAttribute(disableInteraction ? "true" : "false", "data-disable-interaction")} data-astro-cid-jezl3i2q></canvas><!-- Balanced vignette overlay allowing lines to remain clearly visible --><div class="bg-vignette" data-astro-cid-jezl3i2q></div></div>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/InteractiveBackground.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/InteractiveBackground.astro", void 0);
//#endregion
//#region src/components/CommandPalette.astro
var $$CommandPalette = createComponent(($$result, $$props, $$slots) => {
	const allCourses = getAllCourses();
	const searchIndex = [];
	allCourses.forEach((c) => {
		const firstLessonId = c.modules[0]?.lessons[0]?.id;
		searchIndex.push({
			type: "course",
			title: c.display_title,
			subtitle: `${c.provider} • ${c.lessons_count} aulas`,
			url: "#",
			courseId: c.id,
			category: "Cursos",
			icon: "book"
		});
		c.modules.forEach((m) => {
			const modFirstLessonId = m.lessons[0]?.id || firstLessonId;
			searchIndex.push({
				type: "module",
				title: m.display_title,
				subtitle: `Módulo em: ${c.display_title}`,
				url: modFirstLessonId ? `/watch/${c.id}/${modFirstLessonId}` : `/courses`,
				courseId: c.id,
				category: "Módulos",
				icon: "folder"
			});
			m.lessons.forEach((l) => {
				searchIndex.push({
					type: "lesson",
					title: l.display_title,
					subtitle: `Aula em: ${c.display_title} • ${m.display_title}`,
					url: `/watch/${c.id}/${l.id}`,
					courseId: c.id,
					category: "Aulas",
					icon: "play"
				});
			});
		});
	});
	return renderTemplate`${maybeRenderHead($$result)}<div id="cmd-palette-backdrop" class="cmd-palette-backdrop" style="display: none;" aria-hidden="true" data-astro-cid-oqgw6c2e><div class="cmd-palette-dialog" role="dialog" aria-modal="true" aria-label="Busca Global" data-astro-cid-oqgw6c2e><!-- Header / Input --><div class="cmd-input-row" data-astro-cid-oqgw6c2e><svg class="cmd-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-oqgw6c2e><circle cx="11" cy="11" r="8" data-astro-cid-oqgw6c2e></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-oqgw6c2e></line></svg><input type="text" id="cmd-palette-input" class="cmd-input" placeholder="Buscar cursos, aulas, módulos, tags... (↑ ↓ para navegar)" autocomplete="off" spellcheck="false" data-astro-cid-oqgw6c2e><button type="button" id="cmd-ai-search-btn" class="cmd-action-ai-btn" style="display: none;" data-astro-cid-oqgw6c2e><span data-astro-cid-oqgw6c2e>Analisar com IA</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-oqgw6c2e><polyline points="9 18 15 12 9 6" data-astro-cid-oqgw6c2e></polyline></svg></button><span class="cmd-kbd-esc" data-astro-cid-oqgw6c2e>ESC</span></div><!-- Type Filters Tabs Bar (Curso, Módulo, Aulas & IA) --><div class="cmd-filters-bar" id="cmd-filters-bar" data-astro-cid-oqgw6c2e><button type="button" class="cmd-filter-tab active" data-type="all" data-astro-cid-oqgw6c2e>Todos</button><button type="button" class="cmd-filter-tab" data-type="course" data-astro-cid-oqgw6c2e>Cursos</button><button type="button" class="cmd-filter-tab" data-type="module" data-astro-cid-oqgw6c2e>Módulos</button><button type="button" class="cmd-filter-tab" data-type="lesson" data-astro-cid-oqgw6c2e>Aulas</button><button type="button" class="cmd-filter-tab cmd-filter-ai" data-type="ai" data-astro-cid-oqgw6c2e><span class="ai-sparkle" data-astro-cid-oqgw6c2e>✦</span> Buscar por Assunto (IA)</button></div><!-- Results Area --><div class="cmd-results-wrapper" id="cmd-results-list" data-astro-cid-oqgw6c2e><!-- Populated via script --></div><!-- Footer Hints --><div class="cmd-palette-footer" data-astro-cid-oqgw6c2e><span class="cmd-hint" id="cmd-hint-nav" data-astro-cid-oqgw6c2e><kbd data-astro-cid-oqgw6c2e>↑</kbd> <kbd data-astro-cid-oqgw6c2e>↓</kbd> Navegar</span><span class="cmd-hint" id="cmd-hint-select" data-astro-cid-oqgw6c2e><kbd data-astro-cid-oqgw6c2e>↵</kbd> <span id="cmd-hint-action-text" data-astro-cid-oqgw6c2e>Selecionar</span></span><span class="cmd-hint" data-astro-cid-oqgw6c2e><kbd data-astro-cid-oqgw6c2e>ESC</kbd> Fechar</span></div></div></div><script>(function(){${defineScriptVars({ searchIndex })}
  const backdrop = document.getElementById('cmd-palette-backdrop');
  const input = document.getElementById('cmd-palette-input');
  const resultsContainer = document.getElementById('cmd-results-list');
  const aiSearchBtn = document.getElementById('cmd-ai-search-btn');
  const filterTabs = document.querySelectorAll('.cmd-filter-tab');
  const hintActionText = document.getElementById('cmd-hint-action-text');

  let activeIndex = -1;
  let currentResults = [];
  let currentFilter = 'all'; // 'all' | 'course' | 'module' | 'lesson' | 'ai'
  let isAiSearching = false;
  let lastAiQuery = '';

  const norm = (s) => (s || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().trim();

  function openPalette(initialFilter = 'all', initialQuery = '') {
    if (!backdrop || !input) return;
    backdrop.style.display = 'flex';
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (initialQuery) {
      input.value = initialQuery;
    }
    
    setFilter(initialFilter, false);

    if (initialFilter === 'ai' && initialQuery.trim()) {
      runAiSearch(initialQuery.trim());
    } else {
      renderResults(input.value);
    }

    setTimeout(() => input.focus(), 50);
  }

  function closePalette() {
    if (!backdrop) return;
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      backdrop.style.display = 'none';
    }, 150);
  }

  function setFilter(type, shouldRender = true) {
    currentFilter = type;
    filterTabs.forEach(tab => {
      if (tab.getAttribute('data-type') === type) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (type === 'ai') {
      input.placeholder = "Pergunte sobre qualquer assunto no acervo (ex: 'prompt para criar imagem?')...";
      if (aiSearchBtn) aiSearchBtn.style.display = 'flex';
      if (hintActionText) hintActionText.textContent = 'Pesquisar com IA';
      if (shouldRender) {
        if (input.value.trim().length >= 3) {
          runAiSearch(input.value.trim());
        } else {
          renderAiWelcome();
        }
      }
    } else {
      if (aiSearchBtn) aiSearchBtn.style.display = 'none';
      if (hintActionText) hintActionText.textContent = 'Selecionar';

      if (type === 'course') input.placeholder = "Filtrar por nome do curso ou fornecedor...";
      else if (type === 'module') input.placeholder = "Filtrar módulos da biblioteca...";
      else if (type === 'lesson') input.placeholder = "Buscar aulas específicas no catálogo...";
      else input.placeholder = "Buscar cursos, aulas, módulos, tags... (↑ ↓ para navegar)";

      if (shouldRender) renderResults(input.value);
    }
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.getAttribute('data-type') || 'all';
      setFilter(type, true);
    });
  });

  // Keyboard shortcut Ctrl+K / Cmd+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (backdrop?.style.display === 'flex') {
        closePalette();
      } else {
        openPalette('all', '');
      }
    } else if (e.key === 'Escape' && backdrop?.style.display === 'flex') {
      closePalette();
    }
  });

  // External open trigger (e.g. from navbar or searchbar)
  window.addEventListener('mindflix:open-search', (e) => {
    const detail = e.detail || {};
    openPalette(detail.type || 'all', detail.query || '');
  });

  // Close on backdrop click outside dialog
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closePalette();
    }
  });

  // Render AI Welcome prompt when user enters AI mode without query
  function renderAiWelcome() {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = \`
      <div class="cmd-ai-welcome">
        <div class="ai-welcome-glow">✦</div>
        <h3>Busca Inteligente por Assunto nas Transcrições</h3>
        <p>A IA varre as transcrições das mais de 2.400 aulas e artigos do acervo para responder onde o tema é ensinado, citando trechos exatos e marcas de tempo.</p>
        <div class="ai-suggested-pills">
          <span class="ai-pill-label">Exemplos populares:</span>
          <button type="button" class="ai-sample-pill" data-query="prompt para criar imagem">"prompt para criar imagem"</button>
          <button type="button" class="ai-sample-pill" data-query="como criar agentes no n8n">"como criar agentes no n8n"</button>
          <button type="button" class="ai-sample-pill" data-query="leilão de carros judiciais">"leilão de carros judiciais"</button>
          <button type="button" class="ai-sample-pill" data-query="backtesting dados historicos">"backtesting com python"</button>
        </div>
      </div>
    \`;

    resultsContainer.querySelectorAll('.ai-sample-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-query') || '';
        input.value = q;
        runAiSearch(q);
      });
    });
  }

  // Execute RAG Search over /api/search/ai
  async function runAiSearch(query) {
    if (!query || isAiSearching || !resultsContainer) return;
    isAiSearching = true;
    lastAiQuery = query;

    resultsContainer.innerHTML = \`
      <div class="cmd-ai-loading">
        <div class="ai-pulse-orb"></div>
        <h4 class="ai-loading-title">Analisando mais de 2.400 transcrições do acervo...</h4>
        <p class="ai-loading-desc">Cruzando aulas, trechos comentados e sintetizando os melhores pontos de estudo para "\${query}"</p>
      </div>
    \`;

    try {
      // Check for user-configured gemini key in localStorage
      let apiKey = '';
      try {
        const prefs = JSON.parse(localStorage.getItem('mindflix_preferences') || '{}');
        apiKey = prefs.gemini_api_key || '';
      } catch {}

      const res = await fetch('/api/search/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'x-gemini-api-key': apiKey } : {})
        },
        body: JSON.stringify({ query, apiKey })
      });

      if (!res.ok) throw new Error('Falha na resposta do servidor.');
      const data = await res.json();
      renderAiResults(data);
    } catch (err) {
      resultsContainer.innerHTML = \`
        <div class="cmd-empty">
          <p>Ocorreu um erro ao consultar o acervo com IA: \${err.message || 'Erro desconhecido'}</p>
          <button type="button" class="btn btn-secondary btn-sm" id="btn-retry-ai" style="margin-top: 1rem;">Tentar Novamente</button>
        </div>
      \`;
      document.getElementById('btn-retry-ai')?.addEventListener('click', () => runAiSearch(query));
    } finally {
      isAiSearching = false;
    }
  }

  // Format AI summary markdown to HTML
  function formatSummaryHtml(text) {
    if (!text) return '';
    return text
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
      .replace(/\\n\\n/g, '<br><br>')
      .replace(/\\n/g, '<br>');
  }

  // Highlight keywords in snippet
  function highlightSnippet(snippet, keywords) {
    if (!keywords || keywords.length === 0) return snippet;
    let text = snippet;
    keywords.forEach(kw => {
      if (kw.length >= 3) {
        const regex = new RegExp(\`(\${kw})\`, 'gi');
        text = text.replace(regex, '<mark class="ai-term-mark">$1</mark>');
      }
    });
    return text;
  }

  // Render AI Results Section
  function renderAiResults(data) {
    if (!resultsContainer) return;
    const { query, summary, matches, totalMatches, searchTimeMs, hasGeminiKey } = data;

    if (!matches || matches.length === 0) {
      resultsContainer.innerHTML = \`
        <div class="cmd-empty">
          <p>Nenhuma menção direta ao tema "<strong>\${query}</strong>" foi encontrada nas transcrições.</p>
          <p style="font-size: 0.8125rem; margin-top: 0.5rem; color: var(--text-muted);">Tente buscar por termos sinônimos ou conceitos relacionados.</p>
        </div>
      \`;
      return;
    }

    let html = \`
      <div class="ai-results-wrapper">
        <!-- AI Synthesis Card -->
        <div class="ai-summary-card">
          <div class="ai-summary-header">
            <div class="ai-badge-group">
              <span class="ai-sparkle-badge">✦ Análise Inteligente do Acervo</span>
              <span class="ai-mode-tag">\${hasGeminiKey ? 'Gemini 2.5' : 'Motor RAG Local'}</span>
            </div>
            <span class="ai-meta-time">\${totalMatches} referências em \${searchTimeMs}ms</span>
          </div>
          <div class="ai-summary-body">
            \${formatSummaryHtml(summary)}
          </div>
        </div>

        <!-- Matching Lessons Header -->
        <div class="ai-matches-header">
          <span class="ai-matches-title">Aulas Recomendadas no Acervo</span>
          <span class="ai-matches-count">\${matches.length} principais aulas encontradas</span>
        </div>

        <!-- Lessons Cards List -->
        <div class="ai-matches-list">
    \`;

    matches.forEach(m => {
      html += \`
        <div class="ai-match-card">
          <div class="ai-match-top">
            <div class="ai-match-tags">
              <span class="ai-course-tag">\${m.courseTitle}</span>
              <span class="ai-tag-sep">•</span>
              <span class="ai-module-tag">\${m.moduleTitle}</span>
            </div>
            \${m.timestamp ? \`<span class="ai-timestamp-pill">⏱ \${m.timestamp}</span>\` : ''}
          </div>

          <h4 class="ai-match-title">\${m.lessonTitle}</h4>

          <div class="ai-match-snippet">
            <p>"\${highlightSnippet(m.snippet, m.highlightWords)}"</p>
          </div>

          <div class="ai-match-footer">
            <a href="\${m.watchUrl}" class="ai-watch-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span>Assistir Aula no Player</span>
            </a>
          </div>
        </div>
      \`;
    });

    html += \`
        </div>
      </div>
    \`;

    resultsContainer.innerHTML = html;
  }

  // Standard Metadata Search Rendering
  function renderResults(query) {
    if (!resultsContainer) return;
    const q = norm(query);

    let filtered = searchIndex;
    if (currentFilter !== 'all') {
      filtered = searchIndex.filter(item => item.type === currentFilter);
    }

    if (!q) {
      currentResults = filtered.slice(0, 12);
    } else {
      currentResults = filtered
        .filter(item => norm(item.title).includes(q) || norm(item.subtitle).includes(q))
        .slice(0, 16);
    }

    activeIndex = currentResults.length > 0 ? 0 : -1;

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = \`
        <div class="cmd-empty">
          <p>Nenhum resultado encontrado para "<strong>\${query}</strong>"</p>
          <p style="font-size: 0.8125rem; margin-top: 0.5rem;">Dica: experimente a aba <strong>✦ Buscar por Assunto (IA)</strong> para pesquisar nas transcrições!</p>
        </div>
      \`;
      return;
    }

    let html = '';
    currentResults.forEach((item, idx) => {
      const isSelected = idx === activeIndex ? 'selected' : '';
      html += \`
        <a href="\${item.url}" class="cmd-result-item \${isSelected}" data-index="\${idx}">
          <div class="cmd-item-left">
            <span class="cmd-badge-type">\${item.category}</span>
            <div class="cmd-item-titles">
              <strong class="cmd-item-title">\${item.title}</strong>
              <span class="cmd-item-subtitle">\${item.subtitle}</span>
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </a>
      \`;
    });

    resultsContainer.innerHTML = html;
  }

  input?.addEventListener('input', () => {
    if (currentFilter === 'ai') {
      // In AI mode, typing can suggest sample queries or user can press Enter
      if (!input.value.trim()) {
        renderAiWelcome();
      }
    } else {
      renderResults(input.value);
    }
  });

  aiSearchBtn?.addEventListener('click', () => {
    if (input.value.trim()) {
      runAiSearch(input.value.trim());
    }
  });

  function executeItem(item: any) {
    if (!item) return;
    if (item.type === 'course' && item.courseId) {
      closePalette();
      if ((window as any).openCourseModal) {
        (window as any).openCourseModal(item.courseId);
      } else {
        document.dispatchEvent(new CustomEvent('open-course-modal', { detail: { courseId: item.courseId } }));
      }
    } else if (item.url && item.url !== '#') {
      window.location.href = item.url;
    }
  }

  resultsContainer?.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest('.cmd-result-item');
    if (link) {
      const idx = parseInt(link.getAttribute('data-index') || '-1', 10);
      if (idx >= 0 && currentResults[idx]) {
        e.preventDefault();
        executeItem(currentResults[idx]);
      }
    }
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentFilter === 'ai') {
        if (input.value.trim()) {
          runAiSearch(input.value.trim());
        }
      } else {
        if (activeIndex >= 0 && activeIndex < currentResults.length) {
          executeItem(currentResults[activeIndex]);
        }
      }
    } else if (currentFilter !== 'ai') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentResults.length > 0) {
          activeIndex = (activeIndex + 1) % currentResults.length;
          updateSelectedUI();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentResults.length > 0) {
          activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
          updateSelectedUI();
        }
      }
    }
  });

  function updateSelectedUI() {
    const items = resultsContainer?.querySelectorAll('.cmd-result-item');
    items?.forEach((el, idx) => {
      if (idx === activeIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest' });
      } else {
        el.classList.remove('selected');
      }
    });
  }
})();<\/script>`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CommandPalette.astro", void 0);
//#endregion
//#region src/components/CourseDetailModal.astro
var $$CourseDetailModal = createComponent(($$result, $$props, $$slots) => {
	getAllCourses();
	return renderTemplate`${maybeRenderHead($$result)}<!-- Global Course Detail Glassmorphism Modal --><div id="course-detail-modal-backdrop" class="course-modal-backdrop" style="display: none;" aria-hidden="true" data-astro-cid-qswrabxb><div class="course-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-course-title" data-astro-cid-qswrabxb><!-- Top Close Button (Desktop & Mobile) --><button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Fechar modal" data-astro-cid-qswrabxb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-qswrabxb><line x1="18" y1="6" x2="6" y2="18" data-astro-cid-qswrabxb></line><line x1="6" y1="6" x2="18" y2="18" data-astro-cid-qswrabxb></line></svg></button><!-- Scrollable Modal Content --><div class="modal-scroll-body" id="modal-scroll-body" data-astro-cid-qswrabxb><!-- Hero Header Section --><div class="modal-hero" id="modal-hero" data-astro-cid-qswrabxb><div class="modal-hero-cover-wrap" id="modal-hero-cover-wrap" data-astro-cid-qswrabxb><img id="modal-cover-img" class="modal-cover-img" src="" alt="" style="display: none;" data-astro-cid-qswrabxb><div class="modal-cover-gradient" id="modal-cover-gradient" data-astro-cid-qswrabxb></div><div class="modal-cover-overlay" data-astro-cid-qswrabxb></div></div><div class="modal-hero-content" data-astro-cid-qswrabxb><div class="modal-badges-row" data-astro-cid-qswrabxb><span class="provider-pill" id="modal-provider" data-astro-cid-qswrabxb>Provider</span><span class="badge badge-cyan" id="modal-modules-count" data-astro-cid-qswrabxb>0 Módulos</span><span class="badge" id="modal-lessons-count" data-astro-cid-qswrabxb>0 Aulas</span><button type="button" class="modal-fav-btn" id="modal-fav-btn" aria-label="Favoritar" data-astro-cid-qswrabxb><svg class="heart-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-qswrabxb><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-astro-cid-qswrabxb></path></svg></button></div><h2 class="modal-course-title" id="modal-course-title" data-astro-cid-qswrabxb>Título do Curso</h2><p class="modal-course-desc" id="modal-course-desc" data-astro-cid-qswrabxb>Descrição completa do curso...</p><div class="modal-tags-row" id="modal-tags-row" data-astro-cid-qswrabxb></div><!-- Progress Bar Section --><div class="modal-progress-card" id="modal-progress-card" style="display: none;" data-astro-cid-qswrabxb><div class="modal-progress-info" data-astro-cid-qswrabxb><span class="progress-label" data-astro-cid-qswrabxb>Seu Progresso:</span><strong class="progress-pct" id="modal-progress-pct" data-astro-cid-qswrabxb>0% concluído</strong></div><div class="modal-progress-track" data-astro-cid-qswrabxb><div class="modal-progress-fill" id="modal-progress-fill" style="width: 0%;" data-astro-cid-qswrabxb></div></div></div><!-- CTA Watch Row --><div class="modal-cta-row" data-astro-cid-qswrabxb><a href="#" class="btn btn-primary modal-play-btn" id="modal-play-btn" data-astro-cid-qswrabxb><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-qswrabxb><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-qswrabxb></polygon></svg><span id="modal-play-btn-text" data-astro-cid-qswrabxb>Assistir Agora</span></a><span class="modal-next-lesson-hint" id="modal-next-lesson-hint" data-astro-cid-qswrabxb></span></div></div></div><!-- Curriculum / Grade de Aulas Section --><div class="modal-curriculum-section" data-astro-cid-qswrabxb><div class="curriculum-header" data-astro-cid-qswrabxb><div class="curriculum-title-wrap" data-astro-cid-qswrabxb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-qswrabxb><polygon points="12 2 2 7 12 12 22 7 12 2" data-astro-cid-qswrabxb></polygon><polyline points="2 17 12 22 22 17" data-astro-cid-qswrabxb></polyline><polyline points="2 12 12 17 22 12" data-astro-cid-qswrabxb></polyline></svg><h3 data-astro-cid-qswrabxb>Grade Completa de Aulas</h3></div><span class="curriculum-meta" id="modal-curriculum-meta" data-astro-cid-qswrabxb>Aulas estruturadas passo a passo</span></div><!-- Modules List Accordion Container --><div class="modal-modules-accordion" id="modal-modules-list" data-astro-cid-qswrabxb></div></div></div></div></div>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseDetailModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseDetailModal.astro", void 0);
//#endregion
//#region src/components/Toast.astro
var $$Toast = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div id="toast-container" class="toast-container" aria-live="polite" aria-atomic="true" data-astro-cid-hyvcqdav></div>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/Toast.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/Toast.astro", void 0);
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "Mindflix — Plataforma Pessoal de Cursos & Estudos", description = "Organize, assista e acompanhe o progresso da sua biblioteca pessoal de cursos de IA, automações, programação e dados.", hideNavbar = false, disableBgInteraction = false } = Astro.props;
	const currentPath = Astro.url.pathname;
	const isWatchPage = disableBgInteraction || currentPath.startsWith("/watch");
	return renderTemplate`<html lang="pt-BR" data-astro-cid-ju4pidww><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>${title}</title><meta name="description"${addAttribute(description, "content")}>${renderHead($$result)}</head><body data-astro-cid-ju4pidww><!-- Plano 1: Interactive Canvas Background -->${renderComponent($$result, "InteractiveBackground", $$InteractiveBackground, {
		"disableInteraction": isWatchPage,
		"data-astro-cid-ju4pidww": true
	})}<!-- Plano 3: Navbar -->${!hideNavbar && renderTemplate`${renderComponent($$result, "Navbar", $$Navbar, {
		"currentPath": currentPath,
		"data-astro-cid-ju4pidww": true
	})}`}<!-- Main Content Area --><main id="main-content" data-astro-cid-ju4pidww>${renderSlot($$result, $$slots["default"])}</main><!-- Global Command Palette Modal (Ctrl+K) -->${renderComponent($$result, "CommandPalette", $$CommandPalette, { "data-astro-cid-ju4pidww": true })}<!-- Global Course Detail Modal (Glassmorphism & Background Blur) -->${renderComponent($$result, "CourseDetailModal", $$CourseDetailModal, { "data-astro-cid-ju4pidww": true })}<!-- Global Toast Container -->${renderComponent($$result, "Toast", $$Toast, { "data-astro-cid-ju4pidww": true })}${!hideNavbar && renderTemplate`<footer class="app-footer" data-astro-cid-ju4pidww><div class="container footer-content" data-astro-cid-ju4pidww><div class="footer-left" data-astro-cid-ju4pidww><span class="footer-logo" data-astro-cid-ju4pidww>MIND<span data-astro-cid-ju4pidww>FLIX</span></span><p class="footer-copy" data-astro-cid-ju4pidww>Sua biblioteca pessoal de cursos, estudos e evolução contínua.</p></div><div class="footer-right" data-astro-cid-ju4pidww><a href="/settings" class="footer-link" data-astro-cid-ju4pidww>Preferências</a><a href="/profile" class="footer-link" data-astro-cid-ju4pidww>Minha Conta</a><a href="/courses" class="footer-link" data-astro-cid-ju4pidww>Catálogo</a></div></div></footer>`}</body></html>`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/layouts/Layout.astro", void 0);
//#endregion
export { renderScript as n, $$Layout as t };
