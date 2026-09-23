import { F as defineScriptVars, H as createAstro, I as createRenderInstruction, M as maybeRenderHead, N as renderHead, O as renderSlot, P as addAttribute, S as renderTransition, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { t as getAllCourses } from "./catalog_BH-ygd_W.mjs";
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
//#region node_modules/astro/components/ClientRouter.astro
createAstro("https://astro.build");
var $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ClientRouter;
	const { fallback = "animate" } = Astro.props;
	return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "D:/projetos antigravity/mindflix/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/node_modules/astro/components/ClientRouter.astro", void 0);
//#endregion
//#region src/components/Navbar.astro
createAstro("https://astro.build");
var $$Navbar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Navbar;
	const { currentPath = "/" } = Astro.props;
	const navItems = [
		{
			label: "Cursos",
			href: "/courses"
		},
		{
			label: "Minha Lista",
			href: "/my-list"
		},
		{
			label: "Minhas Anotações",
			href: "/anotacoes"
		},
		{
			label: "Biblioteca",
			href: "/library",
			adminOnly: true
		},
		{
			label: "Segurança & IPS",
			href: "/security-monitor",
			adminOnly: true
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<header data-astro-transition-persist="main-navbar" class="navbar" id="main-navbar" data-astro-cid-l7arcky5><div class="container nav-content" data-astro-cid-l7arcky5><div class="nav-left" data-astro-cid-l7arcky5><a href="/" class="brand-logo" aria-label="Mindflix Home" data-astro-cid-l7arcky5><span class="logo-icon" data-astro-cid-l7arcky5><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-l7arcky5><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-l7arcky5></polygon></svg></span><span class="logo-text" data-astro-cid-l7arcky5>MIND<span data-astro-cid-l7arcky5>FLIX</span></span></a><nav class="nav-links" aria-label="Menu Principal" data-astro-cid-l7arcky5>${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`nav-link ${currentPath === item.href ? "active" : ""} ${item.adminOnly ? "admin-only-link" : ""}`, "class")}${addAttribute(item.adminOnly ? "true" : "false", "data-admin-only")}${addAttribute(item.adminOnly ? "display: none;" : "", "style")} data-astro-cid-l7arcky5>${item.label}</a>`)}</nav></div><!-- Center: Collapsed Study Source Selector --><div class="source-switcher-wrapper" data-astro-cid-l7arcky5><div class="source-dropdown-group" id="header-source-dropdown-group" data-astro-cid-l7arcky5><button type="button" class="single-source-btn" id="single-source-btn" role="button" aria-haspopup="true" aria-expanded="false" title="Clique para selecionar a Fonte de Estudo" data-astro-cid-l7arcky5><span class="source-pill-dot dot-all" id="single-source-dot" data-astro-cid-l7arcky5></span><span class="source-pill-label" id="single-source-label" data-astro-cid-l7arcky5>Todas</span><svg class="source-dropdown-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="6 9 12 15 18 9" data-astro-cid-l7arcky5></polyline></svg></button><!-- Collapsed Dropdown Menu --><div class="source-dropdown-menu single-source-menu" id="header-source-dropdown-menu" role="menu" data-astro-cid-l7arcky5><button type="button" class="dropdown-item active" data-subsource="all" role="menuitem" data-astro-cid-l7arcky5><div class="dropdown-item-left" data-astro-cid-l7arcky5><span class="dropdown-dot dot-all" data-astro-cid-l7arcky5></span><div class="dropdown-texts" data-astro-cid-l7arcky5><span class="dropdown-item-title" data-astro-cid-l7arcky5>Todas</span><span class="dropdown-item-desc" data-astro-cid-l7arcky5>Todas as fontes de estudo</span></div></div><svg class="dropdown-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="20 6 9 17 4 12" data-astro-cid-l7arcky5></polyline></svg></button><button type="button" class="dropdown-item" data-subsource="ailab" role="menuitem" data-astro-cid-l7arcky5><div class="dropdown-item-left" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #00f2fe; box-shadow: 0 0 8px #00f2fe80;" data-astro-cid-l7arcky5></span><div class="dropdown-texts" data-astro-cid-l7arcky5><span class="dropdown-item-title" data-astro-cid-l7arcky5>AI LAB</span><span class="dropdown-item-desc" data-astro-cid-l7arcky5>Inteligência Artificial & Agentes</span></div></div><svg class="dropdown-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="20 6 9 17 4 12" data-astro-cid-l7arcky5></polyline></svg></button><button type="button" class="dropdown-item" data-subsource="asimov" role="menuitem" data-astro-cid-l7arcky5><div class="dropdown-item-left" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #6366f1; box-shadow: 0 0 8px #6366f180;" data-astro-cid-l7arcky5></span><div class="dropdown-texts" data-astro-cid-l7arcky5><span class="dropdown-item-title" data-astro-cid-l7arcky5>Asimov</span><span class="dropdown-item-desc" data-astro-cid-l7arcky5>Cursos, Projetos & Trilhas</span></div></div><svg class="dropdown-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="20 6 9 17 4 12" data-astro-cid-l7arcky5></polyline></svg></button><button type="button" class="dropdown-item sub-dropdown-item" data-subsource="asimov-skills" role="menuitem" data-astro-cid-l7arcky5><div class="dropdown-item-left" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #818cf8; box-shadow: 0 0 8px #818cf880;" data-astro-cid-l7arcky5></span><div class="dropdown-texts" data-astro-cid-l7arcky5><span class="dropdown-item-title" data-astro-cid-l7arcky5>Asimov Skills</span><span class="dropdown-item-desc" data-astro-cid-l7arcky5>Soft Skills & Produtividade</span></div></div><svg class="dropdown-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="20 6 9 17 4 12" data-astro-cid-l7arcky5></polyline></svg></button><button type="button" class="dropdown-item" data-subsource="hashtag" role="menuitem" data-astro-cid-l7arcky5><div class="dropdown-item-left" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #ec4899; box-shadow: 0 0 8px #ec489980;" data-astro-cid-l7arcky5></span><div class="dropdown-texts" data-astro-cid-l7arcky5><span class="dropdown-item-title" data-astro-cid-l7arcky5>Hashtag</span><span class="dropdown-item-desc" data-astro-cid-l7arcky5>Impressionador: IA, Claude, Lovable</span></div></div><svg class="dropdown-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="20 6 9 17 4 12" data-astro-cid-l7arcky5></polyline></svg></button><button type="button" class="dropdown-item sub-dropdown-item" data-subsource="hashtag-soft-skills" role="menuitem" data-astro-cid-l7arcky5><div class="dropdown-item-left" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #f43f5e; box-shadow: 0 0 8px #f43f5e80;" data-astro-cid-l7arcky5></span><div class="dropdown-texts" data-astro-cid-l7arcky5><span class="dropdown-item-title" data-astro-cid-l7arcky5>Hashtag Soft Skills</span><span class="dropdown-item-desc" data-astro-cid-l7arcky5>Liderança & Alta Performance</span></div></div><svg class="dropdown-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="20 6 9 17 4 12" data-astro-cid-l7arcky5></polyline></svg></button><button type="button" class="dropdown-item" data-subsource="sctec" role="menuitem" data-astro-cid-l7arcky5><div class="dropdown-item-left" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #10b981; box-shadow: 0 0 8px #10b98180;" data-astro-cid-l7arcky5></span><div class="dropdown-texts" data-astro-cid-l7arcky5><span class="dropdown-item-title" data-astro-cid-l7arcky5>SCTEC</span><span class="dropdown-item-desc" data-astro-cid-l7arcky5>Carreira Tech & Formações</span></div></div><svg class="dropdown-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="20 6 9 17 4 12" data-astro-cid-l7arcky5></polyline></svg></button><button type="button" class="dropdown-item" data-subsource="outros" role="menuitem" data-astro-cid-l7arcky5><div class="dropdown-item-left" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #f59e0b; box-shadow: 0 0 8px #f59e0b80;" data-astro-cid-l7arcky5></span><div class="dropdown-texts" data-astro-cid-l7arcky5><span class="dropdown-item-title" data-astro-cid-l7arcky5>Diversos</span><span class="dropdown-item-desc" data-astro-cid-l7arcky5>Cursos complementares</span></div></div><svg class="dropdown-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><polyline points="20 6 9 17 4 12" data-astro-cid-l7arcky5></polyline></svg></button></div></div></div><div class="nav-right" data-astro-cid-l7arcky5><!-- Command Palette Trigger Button --><button type="button" class="cmd-trigger-btn" id="open-search-modal-btn" aria-label="Abrir busca (Ctrl+K)" data-astro-cid-l7arcky5><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-l7arcky5><circle cx="11" cy="11" r="8" data-astro-cid-l7arcky5></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-l7arcky5></line></svg><span class="cmd-trigger-text" data-astro-cid-l7arcky5>Buscar cursos...</span><div class="cmd-badges" data-astro-cid-l7arcky5><kbd class="cmd-kbd" data-astro-cid-l7arcky5>Ctrl</kbd><kbd class="cmd-kbd" data-astro-cid-l7arcky5>K</kbd></div></button><!-- Profile Avatar Button --><div class="user-menu-container" data-astro-cid-l7arcky5><a href="/profile" class="user-avatar-btn" aria-label="Perfil do Usuário" data-astro-cid-l7arcky5><div class="avatar-circle" data-astro-cid-l7arcky5><span id="user-initials" data-astro-cid-l7arcky5>ED</span></div></a></div></div><!-- Mobile Hamburger Toggle Button (Mobile only) --><button type="button" class="mobile-menu-toggle" id="mobile-menu-toggle-btn" aria-label="Abrir Menu de Navegação" aria-expanded="false" data-astro-cid-l7arcky5><svg class="icon-hamburger" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-l7arcky5><line x1="3" y1="12" x2="21" y2="12" data-astro-cid-l7arcky5></line><line x1="3" y1="6" x2="21" y2="6" data-astro-cid-l7arcky5></line><line x1="3" y1="18" x2="21" y2="18" data-astro-cid-l7arcky5></line></svg></button></div><!-- Mobile Drawer Overlay & Content --><div class="mobile-drawer-overlay" id="mobile-drawer-overlay" data-astro-cid-l7arcky5></div><aside class="mobile-drawer" id="mobile-drawer" aria-label="Menu Mobile" data-astro-cid-l7arcky5><div class="drawer-header" data-astro-cid-l7arcky5><a href="/profile" class="drawer-user-info" data-astro-cid-l7arcky5><div class="avatar-circle" data-astro-cid-l7arcky5><span id="mobile-user-initials" data-astro-cid-l7arcky5>ED</span></div><div class="drawer-user-meta" data-astro-cid-l7arcky5><span class="drawer-user-name" id="mobile-user-name" data-astro-cid-l7arcky5>Minha Conta</span><span class="drawer-user-sub" data-astro-cid-l7arcky5>Ver Perfil →</span></div></a><button type="button" class="drawer-close-btn" id="mobile-drawer-close-btn" aria-label="Fechar Menu" data-astro-cid-l7arcky5><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-l7arcky5><line x1="18" y1="6" x2="6" y2="18" data-astro-cid-l7arcky5></line><line x1="6" y1="6" x2="18" y2="18" data-astro-cid-l7arcky5></line></svg></button></div><div class="drawer-body" data-astro-cid-l7arcky5><!-- Search Action --><button type="button" class="drawer-search-btn" id="mobile-drawer-search-btn" data-astro-cid-l7arcky5><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-l7arcky5><circle cx="11" cy="11" r="8" data-astro-cid-l7arcky5></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-l7arcky5></line></svg><span data-astro-cid-l7arcky5>Buscar cursos...</span></button><!-- Source Switcher Section --><div class="drawer-section" data-astro-cid-l7arcky5><span class="drawer-section-title" data-astro-cid-l7arcky5>Fonte de Estudo</span><div class="drawer-source-grid" data-astro-cid-l7arcky5><button type="button" class="drawer-source-item active" data-subsource="all" data-astro-cid-l7arcky5><span class="dropdown-dot dot-all" data-astro-cid-l7arcky5></span><span data-astro-cid-l7arcky5>Todas</span></button><button type="button" class="drawer-source-item" data-subsource="ailab" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #00f2fe;" data-astro-cid-l7arcky5></span><span data-astro-cid-l7arcky5>AI LAB</span></button><button type="button" class="drawer-source-item" data-subsource="asimov" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #6366f1;" data-astro-cid-l7arcky5></span><span data-astro-cid-l7arcky5>Asimov</span></button><button type="button" class="drawer-source-item" data-subsource="asimov-skills" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #818cf8;" data-astro-cid-l7arcky5></span><span data-astro-cid-l7arcky5>Asimov Skills</span></button><button type="button" class="drawer-source-item" data-subsource="hashtag" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #ec4899;" data-astro-cid-l7arcky5></span><span data-astro-cid-l7arcky5>Hashtag</span></button><button type="button" class="drawer-source-item" data-subsource="hashtag-soft-skills" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #f43f5e;" data-astro-cid-l7arcky5></span><span data-astro-cid-l7arcky5>Hashtag Soft</span></button><button type="button" class="drawer-source-item" data-subsource="sctec" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #10b981;" data-astro-cid-l7arcky5></span><span data-astro-cid-l7arcky5>SCTEC</span></button><button type="button" class="drawer-source-item" data-subsource="outros" data-astro-cid-l7arcky5><span class="dropdown-dot" style="background-color: #f59e0b;" data-astro-cid-l7arcky5></span><span data-astro-cid-l7arcky5>Diversos</span></button></div></div><!-- Navigation Links Section --><div class="drawer-section" data-astro-cid-l7arcky5><span class="drawer-section-title" data-astro-cid-l7arcky5>Navegação</span><nav class="drawer-nav-links" data-astro-cid-l7arcky5>${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`drawer-nav-link ${currentPath === item.href ? "active" : ""}`, "class")}${addAttribute(item.adminOnly ? "true" : "false", "data-admin-only")}${addAttribute(item.adminOnly ? "display: none;" : "", "style")} data-astro-cid-l7arcky5><span data-astro-cid-l7arcky5>${item.label}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-l7arcky5><polyline points="9 18 15 12 9 6" data-astro-cid-l7arcky5></polyline></svg></a>`)}</nav></div></div></aside></header>${renderScript($$result, "D:/projetos antigravity/mindflix/src/components/Navbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/components/Navbar.astro", "self");
//#endregion
//#region src/components/InteractiveBackground.astro
createAstro("https://astro.build");
var $$InteractiveBackground = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$InteractiveBackground;
	const { disableInteraction = false } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div data-astro-transition-persist="bg-viewport" class="bg-viewport" id="bg-viewport" aria-hidden="true" data-astro-cid-jezl3i2q><!-- Subtle ambient glow orbs --><div class="glow-orb orb-primary" data-astro-cid-jezl3i2q></div><div class="glow-orb orb-secondary" data-astro-cid-jezl3i2q></div><div class="glow-orb orb-accent" data-astro-cid-jezl3i2q></div><!-- Interactive Canvas Background --><canvas id="interactive-lines-canvas" class="interactive-lines-canvas"${addAttribute(disableInteraction ? "true" : "false", "data-disable-interaction")} data-astro-cid-jezl3i2q></canvas><!-- Balanced vignette overlay --><div class="bg-vignette" data-astro-cid-jezl3i2q></div></div>${renderScript($$result, "D:/projetos antigravity/mindflix/src/components/InteractiveBackground.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/components/InteractiveBackground.astro", "self");
//#endregion
//#region src/components/CommandPalette.astro
var $$CommandPalette = createComponent(($$result, $$props, $$slots) => {
	const allCourses = getAllCourses();
	const normStr = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
	const searchIndex = [];
	allCourses.forEach((c) => {
		const firstLessonId = c.modules[0]?.lessons[0]?.id;
		const courseSub = `${c.provider} • ${c.lessons_count} aulas`;
		searchIndex.push({
			type: "course",
			title: c.display_title,
			subtitle: courseSub,
			normTitle: normStr(c.display_title),
			normSubtitle: normStr(courseSub),
			url: "#",
			courseId: c.id,
			category: "Cursos",
			icon: "book"
		});
		c.modules.forEach((m) => {
			const modFirstLessonId = m.lessons[0]?.id || firstLessonId;
			const modSub = `Módulo em: ${c.display_title}`;
			searchIndex.push({
				type: "module",
				title: m.display_title,
				subtitle: modSub,
				normTitle: normStr(m.display_title),
				normSubtitle: normStr(modSub),
				url: modFirstLessonId ? `/watch/${c.id}/${modFirstLessonId}` : `/courses`,
				courseId: c.id,
				category: "Módulos",
				icon: "folder"
			});
			m.lessons.forEach((l) => {
				const lesSub = `Aula em: ${c.display_title} • ${m.display_title}`;
				searchIndex.push({
					type: "lesson",
					title: l.display_title,
					subtitle: lesSub,
					normTitle: normStr(l.display_title),
					normSubtitle: normStr(lesSub),
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
    const bd = document.getElementById('cmd-palette-backdrop');
    const inp = document.getElementById('cmd-palette-input');
    if (!bd || !inp) return;

    bd.style.display = 'flex';
    requestAnimationFrame(() => {
      bd.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
    
    if (initialQuery) {
      inp.value = initialQuery;
    }
    
    setFilter(initialFilter, false);

    if (initialFilter === 'ai' && initialQuery.trim()) {
      runAiSearch(initialQuery.trim());
    } else {
      renderResults(inp.value);
    }

    setTimeout(() => inp.focus(), 60);
  }

  function closePalette() {
    const bd = document.getElementById('cmd-palette-backdrop');
    if (!bd) return;
    bd.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      bd.style.display = 'none';
    }, 150);
  }

  // Expose globally on window
  window.openSearchModal = function(type = 'all', query = '') {
    openPalette(type, query);
  };
  window.closeSearchModal = function() {
    closePalette();
  };

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
        .filter(item => (item.normTitle && item.normTitle.includes(q)) || (item.normSubtitle && item.normSubtitle.includes(q)))
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

  function executeItem(item) {
    if (!item) return;
    if (item.type === 'course' && item.courseId) {
      closePalette();
      if (window.openCourseModal) {
        window.openCourseModal(item.courseId);
      } else {
        document.dispatchEvent(new CustomEvent('open-course-modal', { detail: { courseId: item.courseId } }));
      }
    } else if (item.url && item.url !== '#') {
      window.location.href = item.url;
    }
  }

  resultsContainer?.addEventListener('click', (e) => {
    const target = e.target;
    const link = target && target.closest ? target.closest('.cmd-result-item') : null;
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
}, "D:/projetos antigravity/mindflix/src/components/CommandPalette.astro", void 0);
//#endregion
//#region src/components/CourseDetailModal.astro
var $$CourseDetailModal = createComponent(($$result, $$props, $$slots) => {
	getAllCourses();
	return renderTemplate`${maybeRenderHead($$result)}<!-- Global Course Detail Glassmorphism Modal --><div id="course-detail-modal-backdrop" class="course-modal-backdrop" style="display: none;" aria-hidden="true" data-astro-cid-qswrabxb><div class="course-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-course-title" data-astro-cid-qswrabxb><!-- Top Close Button (Desktop & Mobile) --><button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Fechar modal" data-astro-cid-qswrabxb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-qswrabxb><line x1="18" y1="6" x2="6" y2="18" data-astro-cid-qswrabxb></line><line x1="6" y1="6" x2="18" y2="18" data-astro-cid-qswrabxb></line></svg></button><!-- Scrollable Modal Content --><div class="modal-scroll-body" id="modal-scroll-body" data-astro-cid-qswrabxb><!-- Hero Header Section --><div class="modal-hero" id="modal-hero" data-astro-cid-qswrabxb><div class="modal-hero-cover-wrap" id="modal-hero-cover-wrap" data-astro-cid-qswrabxb><img id="modal-cover-img" class="modal-cover-img" src="" alt="" style="display: none;" data-astro-cid-qswrabxb><div class="modal-cover-gradient" id="modal-cover-gradient" data-astro-cid-qswrabxb></div><div class="modal-cover-overlay" data-astro-cid-qswrabxb></div></div><div class="modal-hero-content" data-astro-cid-qswrabxb><div class="modal-badges-row" data-astro-cid-qswrabxb><span class="provider-pill" id="modal-provider" data-astro-cid-qswrabxb>Provider</span><span class="badge badge-cyan" id="modal-modules-count" data-astro-cid-qswrabxb>0 Módulos</span><span class="badge" id="modal-lessons-count" data-astro-cid-qswrabxb>0 Aulas</span><button type="button" class="modal-fav-btn" id="modal-fav-btn" aria-label="Favoritar" data-astro-cid-qswrabxb><svg class="heart-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-qswrabxb><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-astro-cid-qswrabxb></path></svg></button></div><h2 class="modal-course-title" id="modal-course-title" data-astro-cid-qswrabxb>Título do Curso</h2><p class="modal-course-desc" id="modal-course-desc" data-astro-cid-qswrabxb>Descrição completa do curso...</p><div class="modal-tags-row" id="modal-tags-row" data-astro-cid-qswrabxb></div><!-- Progress Bar Section --><div class="modal-progress-card" id="modal-progress-card" style="display: none;" data-astro-cid-qswrabxb><div class="modal-progress-info" data-astro-cid-qswrabxb><span class="progress-label" data-astro-cid-qswrabxb>Seu Progresso:</span><strong class="progress-pct" id="modal-progress-pct" data-astro-cid-qswrabxb>0% concluído</strong></div><div class="modal-progress-track" data-astro-cid-qswrabxb><div class="modal-progress-fill" id="modal-progress-fill" style="width: 0%;" data-astro-cid-qswrabxb></div></div></div><!-- CTA Watch Row --><div class="modal-cta-row" data-astro-cid-qswrabxb><a href="#" class="btn btn-primary modal-play-btn" id="modal-play-btn" data-astro-cid-qswrabxb><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-qswrabxb><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-qswrabxb></polygon></svg><span id="modal-play-btn-text" data-astro-cid-qswrabxb>Assistir Agora</span></a><span class="modal-next-lesson-hint" id="modal-next-lesson-hint" data-astro-cid-qswrabxb></span></div></div></div><!-- Curriculum / Grade de Aulas Section --><div class="modal-curriculum-section" data-astro-cid-qswrabxb><div class="curriculum-header" data-astro-cid-qswrabxb><div class="curriculum-title-wrap" data-astro-cid-qswrabxb><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-qswrabxb><polygon points="12 2 2 7 12 12 22 7 12 2" data-astro-cid-qswrabxb></polygon><polyline points="2 17 12 22 22 17" data-astro-cid-qswrabxb></polyline><polyline points="2 12 12 17 22 12" data-astro-cid-qswrabxb></polyline></svg><h3 data-astro-cid-qswrabxb>Grade Completa de Aulas</h3></div><span class="curriculum-meta" id="modal-curriculum-meta" data-astro-cid-qswrabxb>Aulas estruturadas passo a passo</span></div><!-- Modules List Accordion Container --><div class="modal-modules-accordion" id="modal-modules-list" data-astro-cid-qswrabxb></div></div></div></div></div>${renderScript($$result, "D:/projetos antigravity/mindflix/src/components/CourseDetailModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/components/CourseDetailModal.astro", void 0);
//#endregion
//#region src/components/Toast.astro
var $$Toast = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${maybeRenderHead($$result)}<div id="toast-container" class="toast-container" aria-live="polite" aria-atomic="true" data-astro-cid-hyvcqdav></div>${renderScript($$result, "D:/projetos antigravity/mindflix/src/components/Toast.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/components/Toast.astro", void 0);
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title = "Mindflix — Plataforma Pessoal de Cursos & Estudos", description = "Organize, assista e acompanhe o progresso da sua biblioteca pessoal de cursos de IA, automações, programação e dados.", hideNavbar = false, disableBgInteraction = false } = Astro.props;
	const currentPath = Astro.url.pathname;
	const isWatchPage = disableBgInteraction || currentPath.startsWith("/watch");
	return renderTemplate`<html lang="pt-BR" data-astro-cid-ju4pidww><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>${title}</title><meta name="description"${addAttribute(description, "content")}>${renderComponent($$result, "ClientRouter", $$ClientRouter, { "data-astro-cid-ju4pidww": true })}<script>
      (function() {
        var THEMES = {
          'cyan-indigo': { p: '#00f2fe', s: '#4facfe', prgb: '0, 242, 254', srgb: '79, 172, 254' },
          'crimson-orange': { p: '#ff2a4b', s: '#ff7300', prgb: '255, 42, 75', srgb: '255, 115, 0' },
          'violet-magenta': { p: '#a855f7', s: '#ec4899', prgb: '168, 85, 247', srgb: '236, 72, 153' },
          'emerald-mint': { p: '#10b981', s: '#06b6d4', prgb: '16, 185, 129', srgb: '6, 182, 212' },
          'golden-fire': { p: '#f59e0b', s: '#ef4444', prgb: '245, 158, 11', srgb: '239, 68, 68' },
          'sapphire-turquoise': { p: '#2563eb', s: '#06b6d4', prgb: '37, 99, 235', srgb: '6, 182, 212' },
          'cyber-rose': { p: '#f43f5e', s: '#fb923c', prgb: '244, 63, 94', srgb: '251, 146, 60' },
          'platinum-silver': { p: '#e2e8f0', s: '#38bdf8', prgb: '226, 232, 240', srgb: '56, 189, 248' }
        };

        function applyInlineTheme(tId) {
          var t = THEMES[tId] || THEMES['cyan-indigo'];
          var root = document.documentElement;
          root.style.setProperty('--accent-cyan', t.p);
          root.style.setProperty('--accent-blue', t.s);
          root.style.setProperty('--accent-primary-rgb', t.prgb);
          root.style.setProperty('--accent-secondary-rgb', t.srgb);
          root.style.setProperty('--grad-primary', 'linear-gradient(135deg, ' + t.p + ' 0%, ' + t.s + ' 100%)');
          root.setAttribute('data-theme', tId);
        }

        function applyInlineBg(bgStyle) {
          var s = bgStyle || 'waves';
          document.documentElement.setAttribute('data-bg-style', s);
        }

        function checkAuthAndTheme() {
          var path = window.location.pathname;
          if (path !== '/login' && path !== '/register') {
            try {
              var user = localStorage.getItem('mindflix_user');
              if (!user) {
                document.documentElement.classList.add('auth-pending');
                window.location.href = '/login?redirect=' + encodeURIComponent(path + window.location.search);
                return;
              }
              document.documentElement.classList.remove('auth-pending');
              var uData = JSON.parse(user);
              var prefKey = uData.id ? 'mindflix_preferences_' + uData.id : 'mindflix_preferences';
              var prefsStr = localStorage.getItem(prefKey) || localStorage.getItem('mindflix_preferences');
              if (prefsStr) {
                var prefs = JSON.parse(prefsStr);
                if (prefs.reduce_motion) {
                  document.documentElement.classList.add('reduce-motion');
                } else {
                  document.documentElement.classList.remove('reduce-motion');
                }
                if (prefs.theme_id) {
                  applyInlineTheme(prefs.theme_id);
                }
                if (prefs.background_style) {
                  applyInlineBg(prefs.background_style);
                }
              }
            } catch (e) {}
          } else {
            document.documentElement.classList.remove('auth-pending');
            try {
              var prefsStr = localStorage.getItem('mindflix_preferences');
              if (prefsStr) {
                var prefs = JSON.parse(prefsStr);
                if (prefs.theme_id) applyInlineTheme(prefs.theme_id);
                if (prefs.background_style) applyInlineBg(prefs.background_style);
              }
            } catch (e) {}
          }
        }

        checkAuthAndTheme();
        document.addEventListener('astro:after-swap', checkAuthAndTheme);
      })();
    <\/script><style>
      html.auth-pending body {
        display: none !important;
      }
    </style>${renderHead($$result)}</head><body data-astro-cid-ju4pidww><!-- Plano 1: Interactive Canvas Background (Persistent across navigation) -->${renderComponent($$result, "InteractiveBackground", $$InteractiveBackground, {
		"disableInteraction": isWatchPage,
		"data-astro-transition-persist": "interactive-bg",
		"data-astro-cid-ju4pidww": true
	})}<!-- Plano 3: Navbar (Persistent across navigation, zero flicker) -->${!hideNavbar && renderTemplate`${renderComponent($$result, "Navbar", $$Navbar, {
		"currentPath": currentPath,
		"data-astro-transition-persist": "main-navbar",
		"data-astro-cid-ju4pidww": true
	})}`}<!-- Main Content Area (Smooth content transition) --><main${addAttribute(renderTransition($$result, "yztbsuuz", "fade", ""), "data-astro-transition-scope")} id="main-content" data-astro-cid-ju4pidww>${renderSlot($$result, $$slots["default"])}</main><!-- Global Command Palette Modal (Ctrl+K) -->${renderComponent($$result, "CommandPalette", $$CommandPalette, {
		"data-astro-transition-persist": "command-palette",
		"data-astro-cid-ju4pidww": true
	})}<!-- Global Course Detail Modal (Glassmorphism & Background Blur) -->${renderComponent($$result, "CourseDetailModal", $$CourseDetailModal, {
		"data-astro-transition-persist": "course-detail-modal",
		"data-astro-cid-ju4pidww": true
	})}<!-- Global Toast Container -->${renderComponent($$result, "Toast", $$Toast, {
		"data-astro-transition-persist": "global-toast",
		"data-astro-cid-ju4pidww": true
	})}${!hideNavbar && renderTemplate`<footer data-astro-transition-persist="app-footer" class="app-footer" data-astro-cid-ju4pidww><div class="container footer-content" data-astro-cid-ju4pidww><div class="footer-left" data-astro-cid-ju4pidww><span class="footer-logo" data-astro-cid-ju4pidww>MIND<span data-astro-cid-ju4pidww>FLIX</span></span><p class="footer-copy" data-astro-cid-ju4pidww>Sua biblioteca pessoal de cursos, estudos e evolução contínua.</p></div><div class="footer-right" data-astro-cid-ju4pidww><a href="/settings" class="footer-link" data-astro-cid-ju4pidww>Preferências</a><a href="/profile" class="footer-link" data-astro-cid-ju4pidww>Minha Conta</a><a href="/courses" class="footer-link" data-astro-cid-ju4pidww>Catálogo</a></div></div></footer>`}</body></html>`;
}, "D:/projetos antigravity/mindflix/src/layouts/Layout.astro", "self");
//#endregion
export { renderScript as n, $$Layout as t };
