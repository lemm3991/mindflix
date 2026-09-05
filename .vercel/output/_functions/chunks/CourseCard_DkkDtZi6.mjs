import { d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute, w as createAstro } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { n as renderScript } from "./Layout_B8JHJTFp.mjs";
//#region src/components/ProgressBar.astro
createAstro("https://astro.build");
var $$ProgressBar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProgressBar;
	const { percentage = 0, height = "4px", showLabel = false } = Astro.props;
	const cleanPercentage = Math.max(0, Math.min(100, Math.round(percentage)));
	return renderTemplate`${maybeRenderHead($$result)}<div class="progress-container" data-astro-cid-uglr7svf>${showLabel && renderTemplate`<div class="progress-header" data-astro-cid-uglr7svf><span class="progress-label" data-astro-cid-uglr7svf>Progresso</span><span class="progress-value" data-astro-cid-uglr7svf>${cleanPercentage}%</span></div>`}<div class="progress-track"${addAttribute(`height: ${height};`, "style")} data-astro-cid-uglr7svf><div class="progress-fill"${addAttribute(`width: ${cleanPercentage}%;`, "style")} role="progressbar"${addAttribute(cleanPercentage, "aria-valuenow")} aria-valuemin="0" aria-valuemax="100" data-astro-cid-uglr7svf></div></div></div>`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/ProgressBar.astro", void 0);
//#endregion
//#region src/components/CourseCard.astro
createAstro("https://astro.build");
var $$CourseCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CourseCard;
	const { course } = Astro.props;
	const firstLesson = course.modules[0]?.lessons[0];
	const defaultWatchUrl = firstLesson ? `/watch/${course.id}/${firstLesson.id}` : "/courses";
	let hash = 0;
	for (let i = 0; i < course.id.length; i++) hash = course.id.charCodeAt(i) + ((hash << 5) - hash);
	const hues = [
		"linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
		"linear-gradient(135deg, #1f1c2c, #4a475a)",
		"linear-gradient(135deg, #141e30, #243b55)",
		"linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
		"linear-gradient(135deg, #16222f, #1a365d)",
		"linear-gradient(135deg, #1a1c29, #2d3748)",
		"linear-gradient(135deg, #1e1b4b, #312e81)",
		"linear-gradient(135deg, #064e3b, #047857)",
		"linear-gradient(135deg, #4a0e2e, #831843)"
	];
	const coverGradient = hues[Math.abs(hash) % hues.length];
	const sampleVideoPath = firstLesson?.relative_path || "";
	return renderTemplate`${maybeRenderHead($$result)}<div class="course-card-wrapper"${addAttribute(course.id, "data-course-id")}${addAttribute(sampleVideoPath, "data-video-path")} data-astro-cid-dfxscctt><div class="course-card"${addAttribute(`card-${course.id}`, "id")} tabindex="0" role="button"${addAttribute(`Ver detalhes do curso ${course.display_title}`, "aria-label")} data-astro-cid-dfxscctt><!-- Specular Highlight Overlay --><div class="card-specular-highlight" data-astro-cid-dfxscctt></div><!-- Card Cover --><div class="card-cover"${addAttribute(course.cover_image ? void 0 : `background: ${coverGradient};`, "style")} data-astro-cid-dfxscctt>${course.cover_image && renderTemplate`<img${addAttribute(course.cover_image, "src")}${addAttribute(course.display_title, "alt")} class="card-cover-img" loading="lazy" decoding="async" data-astro-cid-dfxscctt>`}<div class="cover-overlay" data-astro-cid-dfxscctt></div><!-- Video Preview Canvas/Player (Loaded only on hover intent) --><div class="card-preview-container" style="display: none;" data-astro-cid-dfxscctt><video class="card-preview-video" muted loop playsinline preload="none" data-astro-cid-dfxscctt></video></div><div class="cover-badge-top" data-astro-cid-dfxscctt><span class="provider-pill" data-astro-cid-dfxscctt>${course.provider}</span><span class="status-indicator"${addAttribute(course.id, "data-status-for")} data-astro-cid-dfxscctt></span></div>${!course.cover_image && renderTemplate`<div class="cover-center-art" data-astro-cid-dfxscctt><div class="course-glyph" data-astro-cid-dfxscctt><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-dfxscctt><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-dfxscctt></polygon></svg></div><div class="cover-title-preview" data-astro-cid-dfxscctt>${course.display_title}</div></div>`}<!-- Progress bar if started --><div class="card-progress-bar"${addAttribute(course.id, "data-progress-bar-for")} data-astro-cid-dfxscctt>${renderComponent($$result, "ProgressBar", $$ProgressBar, {
		"percentage": 0,
		"height": "3px",
		"data-astro-cid-dfxscctt": true
	})}</div></div><!-- Card Body --><div class="card-body" data-astro-cid-dfxscctt><div class="card-meta" data-astro-cid-dfxscctt><span class="module-count" data-astro-cid-dfxscctt>${course.modules_count} módulos • ${course.lessons_count} aulas</span><button type="button" class="card-fav-btn"${addAttribute(course.id, "data-fav-id")} aria-label="Favoritar" data-action="favorite" data-astro-cid-dfxscctt><svg class="heart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-dfxscctt><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" data-astro-cid-dfxscctt></path></svg></button></div><h3 class="card-title" data-astro-cid-dfxscctt><span class="card-title-text"${addAttribute(course.display_title, "title")} data-astro-cid-dfxscctt>${course.display_title}</span></h3><!-- Clean static description without jumpy expansion --><p class="card-desc-text" data-astro-cid-dfxscctt>${course.description}</p><div class="card-tags" data-astro-cid-dfxscctt>${course.tags.slice(0, 2).map((tag) => renderTemplate`<span class="card-tag" data-astro-cid-dfxscctt>#${tag}</span>`)}</div><!-- Action Footer: Only Assistir button (Grade button removed) --><div class="card-hover-actions" data-astro-cid-dfxscctt><a${addAttribute(defaultWatchUrl, "href")} class="btn btn-primary btn-play-fast" data-action="watch"${addAttribute(course.id, "data-course-id")}${addAttribute(`Assistir ${course.display_title}`, "aria-label")} data-astro-cid-dfxscctt><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-dfxscctt><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-dfxscctt></polygon></svg><span class="watch-btn-label"${addAttribute(course.id, "data-watch-label-for")} data-astro-cid-dfxscctt>Assistir</span></a></div></div></div></div>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseCard.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseCard.astro", void 0);
//#endregion
export { $$ProgressBar as n, $$CourseCard as t };
