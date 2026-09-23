import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { N as renderHead, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
//#region src/pages/register.astro
var register_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Register,
	file: () => $$file,
	url: () => $$url
});
var $$Register = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`<html lang="pt-BR"><head><meta charset="utf-8"><title>Redirecionando...</title><script>
      window.location.href = '/login';
    <\/script>${renderHead($$result)}</head><body style="background: #0b0d13; color: #94a3b8; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;"><p>Redirecionando para a página de login...</p></body></html>`;
}, "D:/projetos antigravity/mindflix/src/pages/register.astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/register.astro";
var $$url = "/register";
//#endregion
//#region \0virtual:astro:page:src/pages/register@_@astro
var page = () => register_exports;
//#endregion
export { page };
