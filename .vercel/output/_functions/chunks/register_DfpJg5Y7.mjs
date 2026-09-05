import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_B8JHJTFp.mjs";
//#region src/pages/register.astro
var register_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Register,
	file: () => $$file,
	url: () => $$url
});
var $$Register = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Criar Conta — Mindflix",
		"hideNavbar": true,
		"data-astro-cid-fvopxden": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="auth-page-container" data-astro-cid-fvopxden><div class="auth-card" data-astro-cid-fvopxden><div class="auth-brand" data-astro-cid-fvopxden><a href="/" class="brand-logo" data-astro-cid-fvopxden><span class="logo-icon" data-astro-cid-fvopxden><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-fvopxden><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-fvopxden></polygon></svg></span><span class="logo-text" data-astro-cid-fvopxden>MIND<span data-astro-cid-fvopxden>FLIX</span></span></a></div><h1 class="auth-title" data-astro-cid-fvopxden>Criar sua conta</h1><p class="auth-subtitle" data-astro-cid-fvopxden>Cadastre-se para sincronizar seu progresso em todos os dispositivos.</p><form id="register-form" class="auth-form" data-astro-cid-fvopxden><div class="form-group" data-astro-cid-fvopxden><label for="fullname" class="form-label" data-astro-cid-fvopxden>Nome Completo</label><input type="text" id="fullname" class="form-input" placeholder="Seu nome" required data-astro-cid-fvopxden></div><div class="form-group" data-astro-cid-fvopxden><label for="reg-email" class="form-label" data-astro-cid-fvopxden>E-mail</label><input type="email" id="reg-email" class="form-input" placeholder="seu@email.com" required data-astro-cid-fvopxden></div><div class="form-group" data-astro-cid-fvopxden><label for="reg-password" class="form-label" data-astro-cid-fvopxden>Senha</label><input type="password" id="reg-password" class="form-input" placeholder="Mínimo 6 caracteres" minlength="6" required data-astro-cid-fvopxden></div><div class="auth-error-msg" id="reg-error-box" style="display: none;" data-astro-cid-fvopxden></div><button type="submit" class="btn btn-primary btn-submit" data-astro-cid-fvopxden><span data-astro-cid-fvopxden>Criar Conta & Acessar</span></button></form><div class="auth-footer" data-astro-cid-fvopxden><p data-astro-cid-fvopxden>Já possui conta? <a href="/login" data-astro-cid-fvopxden>Fazer login</a></p></div></div></div>` })}${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/register.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/register.astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/register.astro";
var $$url = "/register";
//#endregion
//#region \0virtual:astro:page:src/pages/register@_@astro
var page = () => register_exports;
//#endregion
export { page };
