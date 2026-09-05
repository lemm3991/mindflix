import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, f as maybeRenderHead, i as renderComponent } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_B8JHJTFp.mjs";
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
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="auth-page-container" data-astro-cid-sjqh5bze><div class="auth-card" data-astro-cid-sjqh5bze><div class="auth-brand" data-astro-cid-sjqh5bze><a href="/" class="brand-logo" data-astro-cid-sjqh5bze><span class="logo-icon" data-astro-cid-sjqh5bze><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-sjqh5bze><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-sjqh5bze></polygon></svg></span><span class="logo-text" data-astro-cid-sjqh5bze>MIND<span data-astro-cid-sjqh5bze>FLIX</span></span></a></div><h1 class="auth-title" data-astro-cid-sjqh5bze>Acessar sua biblioteca</h1><p class="auth-subtitle" data-astro-cid-sjqh5bze>Entre para acompanhar seu progresso e cursos favoritos.</p><form id="login-form" class="auth-form" data-astro-cid-sjqh5bze><div class="form-group" data-astro-cid-sjqh5bze><label for="email" class="form-label" data-astro-cid-sjqh5bze>E-mail</label><input type="email" id="email" class="form-input" placeholder="exemplo@email.com" value="usuario@mindflix.local" required data-astro-cid-sjqh5bze></div><div class="form-group" data-astro-cid-sjqh5bze><div class="label-row" data-astro-cid-sjqh5bze><label for="password" class="form-label" data-astro-cid-sjqh5bze>Senha</label><a href="#" class="forgot-link" id="forgot-password-link" data-astro-cid-sjqh5bze>Esqueceu a senha?</a></div><input type="password" id="password" class="form-input" placeholder="••••••••" value="mindflix123" required data-astro-cid-sjqh5bze></div><div class="auth-error-msg" id="login-error-box" style="display: none;" data-astro-cid-sjqh5bze></div><button type="submit" class="btn btn-primary btn-submit" id="login-submit-btn" data-astro-cid-sjqh5bze><span data-astro-cid-sjqh5bze>Entrar na Plataforma</span></button><div class="divider" data-astro-cid-sjqh5bze><span data-astro-cid-sjqh5bze>ou</span></div><!-- Google Auth button (ready for Supabase Google OAuth) --><button type="button" class="btn btn-secondary btn-google" id="google-auth-btn" data-astro-cid-sjqh5bze><svg width="18" height="18" viewBox="0 0 24 24" data-astro-cid-sjqh5bze><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" data-astro-cid-sjqh5bze></path><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z" data-astro-cid-sjqh5bze></path><path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.4 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z" data-astro-cid-sjqh5bze></path><path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.4 7.5 23.5 12 23.5z" data-astro-cid-sjqh5bze></path></svg><span data-astro-cid-sjqh5bze>Continuar com Google</span></button></form><div class="auth-footer" data-astro-cid-sjqh5bze><p data-astro-cid-sjqh5bze>Ainda não tem cadastro? <a href="/register" data-astro-cid-sjqh5bze>Cadastre-se gratuitamente</a></p></div></div></div>` })}${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/login.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/login.astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/login.astro";
var $$url = "/login";
//#endregion
//#region \0virtual:astro:page:src/pages/login@_@astro
var page = () => login_exports;
//#endregion
export { page };
