import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { M as maybeRenderHead, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
//#region src/pages/anotacoes.astro
var anotacoes_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Anotacoes,
	file: () => $$file,
	url: () => $$url
});
var $$Anotacoes = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Minhas Anotações — Mindflix",
		"data-astro-cid-mkzvmltk": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="anotacoes-page container" data-astro-cid-mkzvmltk><!-- Page Header --><div class="page-header" data-astro-cid-mkzvmltk><div class="page-header-info" data-astro-cid-mkzvmltk><div class="badge-icon-title" data-astro-cid-mkzvmltk><div class="header-icon-circle" data-astro-cid-mkzvmltk><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-mkzvmltk><path d="M12 20h9" data-astro-cid-mkzvmltk></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" data-astro-cid-mkzvmltk></path></svg></div><div data-astro-cid-mkzvmltk><h1 class="page-title" data-astro-cid-mkzvmltk>Minhas Anotações</h1><p class="page-subtitle" data-astro-cid-mkzvmltk>Seu caderno de estudos pessoal. Suas anotações ficam salvas no navegador e vinculadas a cada aula.</p></div></div></div><!-- Search / Filter input --><div class="anotacoes-search-wrap" id="anotacoes-search-wrap" style="display: none;" data-astro-cid-mkzvmltk><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-mkzvmltk><circle cx="11" cy="11" r="8" data-astro-cid-mkzvmltk></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-mkzvmltk></line></svg><input type="text" id="anotacoes-search-input" placeholder="Buscar nas anotações..." data-astro-cid-mkzvmltk></div></div><!-- Notes Container (Populated via JS) --><div class="notes-grid-container" id="notes-grid-container" data-astro-cid-mkzvmltk><!-- Loading Skeleton --><div class="notes-loading-skeleton" data-astro-cid-mkzvmltk><div class="skeleton-card" data-astro-cid-mkzvmltk></div><div class="skeleton-card" data-astro-cid-mkzvmltk></div><div class="skeleton-card" data-astro-cid-mkzvmltk></div></div></div><!-- Friendly Empty State (Displayed if 0 notes) --><div class="notes-empty-state" id="notes-empty-state" style="display: none;" data-astro-cid-mkzvmltk><div class="empty-icon-box" data-astro-cid-mkzvmltk><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-mkzvmltk><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" data-astro-cid-mkzvmltk></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" data-astro-cid-mkzvmltk></path></svg></div><h2 class="empty-title" data-astro-cid-mkzvmltk>Você ainda não possui anotações</h2><p class="empty-desc" data-astro-cid-mkzvmltk>Durante qualquer aula do Mindflix, você encontra uma área discreta de anotações logo abaixo do vídeo. Escreva resumos, adicione checklists de tarefas e organize seus estudos. Suas anotações ficam salvas automaticamente e persistem no seu navegador!</p><div class="empty-actions" data-astro-cid-mkzvmltk><a href="/courses" class="btn btn-primary" data-astro-cid-mkzvmltk><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-mkzvmltk><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-mkzvmltk></polygon></svg><span data-astro-cid-mkzvmltk>Explorar Cursos e Iniciar Estudos</span></a></div></div></div>` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/anotacoes.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/anotacoes.astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/anotacoes.astro";
var $$url = "/anotacoes";
//#endregion
//#region \0virtual:astro:page:src/pages/anotacoes@_@astro
var page = () => anotacoes_exports;
//#endregion
export { page };
