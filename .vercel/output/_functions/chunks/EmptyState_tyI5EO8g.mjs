import { d as renderTemplate, f as maybeRenderHead, m as addAttribute, w as createAstro } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
//#region src/components/EmptyState.astro
createAstro("https://astro.build");
var $$EmptyState = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$EmptyState;
	const { title, description, actionText, actionHref } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="empty-state-wrapper" data-astro-cid-72cpth5s><div class="empty-state-icon" data-astro-cid-72cpth5s><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-astro-cid-72cpth5s><circle cx="12" cy="12" r="10" data-astro-cid-72cpth5s></circle><line x1="8" y1="12" x2="16" y2="12" data-astro-cid-72cpth5s></line></svg></div><h3 class="empty-state-title" data-astro-cid-72cpth5s>${title}</h3><p class="empty-state-desc" data-astro-cid-72cpth5s>${description}</p>${actionText && actionHref && renderTemplate`<a${addAttribute(actionHref, "href")} class="btn btn-primary btn-empty-action" data-astro-cid-72cpth5s>${actionText}</a>`}</div>`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/EmptyState.astro", void 0);
//#endregion
export { $$EmptyState as t };
