import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { H as createAstro, M as maybeRenderHead, P as addAttribute, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
import { i as getCourseById } from "./catalog_BH-ygd_W.mjs";
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
	const defaultFirstLesson = course.modules[0]?.lessons[0];
	const fallbackUrl = defaultFirstLesson ? `/watch/${course.id}/${defaultFirstLesson.id}` : `/courses`;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `Carregando ${course.display_title} | MindFlix`,
		"data-astro-cid-ocvgnvsc": true
	}, { "default": ($$result) => renderTemplate`<meta http-equiv="refresh"${addAttribute(`2;url=${fallbackUrl}`, "content")}>${maybeRenderHead($$result)}<div class="course-redirect-container"${addAttribute(course.id, "data-course-id")} data-astro-cid-ocvgnvsc><div class="redirect-card" data-astro-cid-ocvgnvsc><div class="spinner-ring" data-astro-cid-ocvgnvsc></div><h2 class="redirect-title" data-astro-cid-ocvgnvsc>${course.display_title}</h2><p class="redirect-subtitle" data-astro-cid-ocvgnvsc>Carregando a sua próxima aula...</p></div></div>` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/course/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/course/[id].astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/course/[id].astro";
var $$url = "/course/[id]";
//#endregion
//#region \0virtual:astro:page:src/pages/course/[id]@_@astro
var page = () => _id__exports;
//#endregion
export { page };
