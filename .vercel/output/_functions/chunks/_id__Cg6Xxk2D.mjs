import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { w as createAstro } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { a as getCourseById } from "./catalog__AHOIgcN.mjs";
//#region src/pages/course/[id].astro
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
	const course = id ? getCourseById(id) : void 0;
	if (!course) return Astro.redirect("/courses");
	const firstLesson = course.modules[0]?.lessons[0];
	const targetUrl = firstLesson ? `/watch/${course.id}/${firstLesson.id}` : `/courses`;
	return Astro.redirect(targetUrl);
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/course/[id].astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/course/[id].astro";
var $$url = "/course/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/course/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
