import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { M as maybeRenderHead, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { t as $$Layout } from "./Layout_DQEGFcGL.mjs";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	url: () => $$url
});
var $$404 = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Página Não Encontrada — Mindflix",
		"data-astro-cid-ibpinaeu": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container notfound-container" data-astro-cid-ibpinaeu><div class="notfound-card" data-astro-cid-ibpinaeu><span class="error-code" data-astro-cid-ibpinaeu>404</span><h1 class="error-title" data-astro-cid-ibpinaeu>Conteúdo não encontrado</h1><p class="error-desc" data-astro-cid-ibpinaeu>O curso, aula ou página que você está procurando não existe ou foi movido.</p><div class="error-actions" data-astro-cid-ibpinaeu><a href="/" class="btn btn-primary" data-astro-cid-ibpinaeu>Voltar para o Início</a><a href="/courses" class="btn btn-secondary" data-astro-cid-ibpinaeu>Explorar Catálogo</a></div></div></div>` })}`;
}, "D:/projetos antigravity/mindflix/src/pages/404.astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/404.astro";
var $$url = "/404";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
