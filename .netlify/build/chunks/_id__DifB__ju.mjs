import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { H as createAstro } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
//#region src/pages/fonte/[id].astro
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
	return Astro.redirect(`/source/${id || ""}`);
}, "D:/projetos antigravity/mindflix/src/pages/fonte/[id].astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/fonte/[id].astro";
var $$url = "/fonte/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/fonte/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
