import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { M as maybeRenderHead, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
//#region src/pages/login.astro
var login_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Login,
	file: () => $$file,
	url: () => $$url
});
var $$Login = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Entrar — Mindflix",
		"hideNavbar": true,
		"data-astro-cid-sjqh5bze": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="auth-page-container" data-astro-cid-sjqh5bze><div class="auth-card" data-astro-cid-sjqh5bze><div class="auth-brand" data-astro-cid-sjqh5bze><a href="/login" class="brand-logo" data-astro-cid-sjqh5bze><span class="logo-icon" data-astro-cid-sjqh5bze><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-sjqh5bze><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-sjqh5bze></polygon></svg></span><span class="logo-text" data-astro-cid-sjqh5bze>MIND<span data-astro-cid-sjqh5bze>FLIX</span></span></a></div><h1 class="auth-title" data-astro-cid-sjqh5bze>Acesso Restrito</h1><p class="auth-subtitle" data-astro-cid-sjqh5bze>Informe seu usuário e senha autorizados para acessar a biblioteca.</p><form id="login-form" class="auth-form" data-astro-cid-sjqh5bze><div class="form-group" data-astro-cid-sjqh5bze><label for="username" class="form-label" data-astro-cid-sjqh5bze>Nome de Usuário</label><input type="text" id="username" class="form-input" placeholder="Ex: Lemmg0800 ou Tamydoagro" autocomplete="username" required data-astro-cid-sjqh5bze></div><div class="form-group" data-astro-cid-sjqh5bze><label for="password" class="form-label" data-astro-cid-sjqh5bze>Senha</label><input type="password" id="password" class="form-input" placeholder="••••••••" autocomplete="current-password" required data-astro-cid-sjqh5bze></div><div class="auth-error-msg" id="login-error-box" style="display: none;" data-astro-cid-sjqh5bze></div><button type="submit" class="btn btn-primary btn-submit" id="login-submit-btn" data-astro-cid-sjqh5bze><span data-astro-cid-sjqh5bze>Entrar na Plataforma</span></button></form></div></div>` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/login.astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
