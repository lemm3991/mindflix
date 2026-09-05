import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as Fragment, d as renderTemplate, f as maybeRenderHead, i as renderComponent, m as addAttribute, w as createAstro } from "./server_BXq9acTl.mjs";
import { t as createComponent } from "./compiler_RLma3uM1.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_B8JHJTFp.mjs";
import { a as getCourseById } from "./catalog__AHOIgcN.mjs";
//#region src/lib/drive.ts
/**
* Extracts a Google Drive File ID from various link formats or raw ID.
*/
function extractDriveId(input) {
	if (!input || typeof input !== "string") return null;
	const trimmed = input.trim();
	const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
	if (fileDMatch) return fileDMatch[1];
	const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
	if (idParamMatch) return idParamMatch[1];
	const prefixMatch = trimmed.match(/^drive:([a-zA-Z0-9_-]+)$/i);
	if (prefixMatch) return prefixMatch[1];
	const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
	if (folderMatch) return folderMatch[1];
	if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed)) return trimmed;
	return null;
}
/**
* Returns the Google Drive embedded preview URL for iframes.
*/
function getDrivePreviewUrl(input) {
	const id = extractDriveId(input);
	if (!id) return null;
	return `https://drive.google.com/file/d/${id}/preview`;
}
/**
* Checks whether a given lesson uses Google Drive as its source.
*/
function isDriveLesson(lesson) {
	if (!lesson) return false;
	if (lesson.drive_file_id) return true;
	if (lesson.drive_url) return true;
	if (lesson.video_url && extractDriveId(lesson.video_url)) return true;
	if (lesson.relative_path && extractDriveId(lesson.relative_path)) return true;
	return false;
}
/**
* Resolves the Google Drive ID for a lesson if present.
*/
function getLessonDriveId(lesson) {
	if (!lesson) return null;
	return extractDriveId(lesson.drive_file_id) || extractDriveId(lesson.drive_url) || extractDriveId(lesson.video_url) || extractDriveId(lesson.relative_path);
}
//#endregion
//#region src/components/VideoPlayer.astro
createAstro("https://astro.build");
var $$VideoPlayer = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$VideoPlayer;
	const { courseId, lesson, nextLessonHref, nextLessonTitle = "Próxima Aula", prevLessonHref } = Astro.props;
	const driveId = getLessonDriveId(lesson);
	const isDrive = Boolean(driveId) || isDriveLesson(lesson);
	const drivePreviewUrl = driveId ? getDrivePreviewUrl(driveId) : null;
	const videoStreamUrl = `/api/video?path=${encodeURIComponent(lesson.relative_path || "")}`;
	return renderTemplate`${maybeRenderHead($$result)}<div class="video-player-component" id="player-wrapper"${addAttribute(courseId, "data-course-id")}${addAttribute(lesson.id, "data-lesson-id")}${addAttribute(nextLessonHref || "", "data-next-href")}${addAttribute(nextLessonTitle, "data-next-title")}${addAttribute(isDrive ? "true" : "false", "data-is-drive")} data-astro-cid-kdofrhet><!-- Next Lesson Countdown Overlay (Shown on Video End) --><div class="next-lesson-overlay" id="next-lesson-overlay" style="display: none;" data-astro-cid-kdofrhet><div class="next-overlay-card" data-astro-cid-kdofrhet><span class="next-badge" data-astro-cid-kdofrhet>Próxima Aula</span><h3 class="next-title" id="next-overlay-title" data-astro-cid-kdofrhet>${nextLessonTitle}</h3><p class="next-countdown-text" id="next-countdown-text" data-astro-cid-kdofrhet>Iniciando em <span id="countdown-secs" data-astro-cid-kdofrhet>8</span>s...</p><div class="next-overlay-actions" data-astro-cid-kdofrhet>${nextLessonHref && renderTemplate`<a${addAttribute(nextLessonHref, "href")} class="btn btn-primary btn-sm" id="btn-play-next-now" data-astro-cid-kdofrhet><span data-astro-cid-kdofrhet>Assistir Agora</span><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-kdofrhet><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-kdofrhet></polygon></svg></a>`}<button type="button" class="btn btn-ghost btn-sm" id="btn-cancel-next" data-astro-cid-kdofrhet>Cancelar</button></div></div></div><!-- Discreet Save Indicator (✓ Salvo) --><div class="save-status-pill" id="save-status-pill" style="display: none;" data-astro-cid-kdofrhet><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-kdofrhet><polyline points="20 6 9 17 4 12" data-astro-cid-kdofrhet></polyline></svg><span data-astro-cid-kdofrhet>Progresso salvo</span></div><!-- Main Video Viewport (Supports Google Drive & Local Video Stream) --><div class="video-viewport" id="video-viewport" data-astro-cid-kdofrhet>${isDrive && drivePreviewUrl ? renderTemplate`<div class="drive-video-wrapper" data-astro-cid-kdofrhet><div class="drive-top-header" data-astro-cid-kdofrhet><div class="drive-cloud-pill" data-astro-cid-kdofrhet><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-kdofrhet><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" data-astro-cid-kdofrhet></path></svg><span data-astro-cid-kdofrhet>Google Drive Stream HD</span></div><a${addAttribute(`https://drive.google.com/file/d/${driveId}/view`, "href")} target="_blank" rel="noopener noreferrer" class="drive-direct-link" title="Abrir diretamente no Google Drive" data-astro-cid-kdofrhet><span data-astro-cid-kdofrhet>Abrir no Drive</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kdofrhet><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" data-astro-cid-kdofrhet></path><polyline points="15 3 21 3 21 9" data-astro-cid-kdofrhet></polyline><line x1="10" y1="14" x2="21" y2="3" data-astro-cid-kdofrhet></line></svg></a></div><iframe id="drive-video-iframe" class="drive-player-frame"${addAttribute(drivePreviewUrl, "src")} allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen${addAttribute(lesson.display_title, "title")} data-astro-cid-kdofrhet></iframe></div>` : renderTemplate`<video id="main-video-player" class="html5-video"${addAttribute(videoStreamUrl, "src")} controls playsinline preload="metadata" data-astro-cid-kdofrhet>Seu navegador não suporta este vídeo.</video>`}<!-- Graceful Media Error State --><div id="video-error-overlay" class="video-error-overlay" style="display: none;" data-astro-cid-kdofrhet><div class="video-error-card" data-astro-cid-kdofrhet><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon" data-astro-cid-kdofrhet><circle cx="12" cy="12" r="10" data-astro-cid-kdofrhet></circle><line x1="12" y1="8" x2="12" y2="12" data-astro-cid-kdofrhet></line><line x1="12" y1="16" x2="12.01" y2="16" data-astro-cid-kdofrhet></line></svg><h3 class="video-error-title" data-astro-cid-kdofrhet>Vídeo Indisponível</h3><p class="video-error-desc" data-astro-cid-kdofrhet>O arquivo de mídia não pôde ser carregado ou o formato não é suportado pelo navegador.</p><div class="video-error-actions" data-astro-cid-kdofrhet><button type="button" class="btn btn-secondary btn-sm" id="btn-retry-video" data-astro-cid-kdofrhet>Tentar Novamente</button><a href="/courses" class="btn btn-primary btn-sm" data-astro-cid-kdofrhet>Voltar aos Cursos</a></div></div></div></div><!-- Refined Bottom Control Bar --><div class="player-controls-bar" data-astro-cid-kdofrhet><div class="controls-left" data-astro-cid-kdofrhet>${prevLessonHref ? renderTemplate`<a${addAttribute(prevLessonHref, "href")} class="btn btn-secondary btn-sm" title="Aula Anterior (Shift + P)" data-astro-cid-kdofrhet><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-kdofrhet><polyline points="15 18 9 12 15 6" data-astro-cid-kdofrhet></polyline></svg><span class="btn-label-desktop" data-astro-cid-kdofrhet>Anterior</span></a>` : renderTemplate`<button class="btn btn-secondary btn-sm disabled" disabled data-astro-cid-kdofrhet><span class="btn-label-desktop" data-astro-cid-kdofrhet>Anterior</span></button>`}${nextLessonHref ? renderTemplate`<a${addAttribute(nextLessonHref, "href")} class="btn btn-secondary btn-sm" id="manual-next-link" title="Próxima Aula (Shift + N)" data-astro-cid-kdofrhet><span class="btn-label-desktop" data-astro-cid-kdofrhet>Próxima</span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-kdofrhet><polyline points="9 18 15 12 9 6" data-astro-cid-kdofrhet></polyline></svg></a>` : renderTemplate`<button class="btn btn-secondary btn-sm disabled" disabled data-astro-cid-kdofrhet><span class="btn-label-desktop" data-astro-cid-kdofrhet>Próxima</span></button>`}</div><div class="controls-center" data-astro-cid-kdofrhet><!-- Mode Toggles: Theater & Focus --><button type="button" class="btn btn-ghost btn-sm btn-mode" id="btn-theater-mode" title="Modo Teatro (T)" data-astro-cid-kdofrhet><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kdofrhet><rect x="2" y="4" width="20" height="16" rx="2" data-astro-cid-kdofrhet></rect><line x1="2" y1="16" x2="22" y2="16" data-astro-cid-kdofrhet></line></svg><span class="btn-label-desktop" data-astro-cid-kdofrhet>Teatro</span></button><button type="button" class="btn btn-ghost btn-sm btn-mode" id="btn-focus-mode" title="Modo Foco Zen (C)" data-astro-cid-kdofrhet><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kdofrhet><circle cx="12" cy="12" r="3" data-astro-cid-kdofrhet></circle><path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4" data-astro-cid-kdofrhet></path></svg><span class="btn-label-desktop" data-astro-cid-kdofrhet>Foco</span></button><!-- PiP Toggle --><button type="button" class="btn btn-ghost btn-sm btn-mode" id="btn-pip-mode" title="Picture-in-Picture (P)" data-astro-cid-kdofrhet><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kdofrhet><rect x="2" y="4" width="20" height="16" rx="2" data-astro-cid-kdofrhet></rect><rect x="13" y="11" width="7" height="6" rx="1" data-astro-cid-kdofrhet></rect></svg></button></div><div class="controls-right" data-astro-cid-kdofrhet><!-- Speed Popover Trigger --><div class="speed-popover-container" id="speed-popover-box" data-astro-cid-kdofrhet><button type="button" class="btn btn-secondary btn-sm" id="btn-speed-popover" aria-haspopup="true" data-astro-cid-kdofrhet><span id="current-speed-label" data-astro-cid-kdofrhet>1.0x</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kdofrhet><polyline points="6 9 12 15 18 9" data-astro-cid-kdofrhet></polyline></svg></button><div class="speed-menu" id="speed-menu" style="display: none;" data-astro-cid-kdofrhet>${[
		.75,
		1,
		1.25,
		1.5,
		1.75,
		2,
		2.5
	].map((s) => renderTemplate`<button type="button" class="speed-option"${addAttribute(s, "data-speed")} data-astro-cid-kdofrhet>${s.toFixed(2).replace(/\.00$/, "")}x</button>`)}</div></div><!-- Mark as completed toggle button --><button type="button" class="btn btn-secondary btn-sm" id="btn-toggle-complete" data-astro-cid-kdofrhet><svg class="check-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-kdofrhet><polyline points="20 6 9 17 4 12" data-astro-cid-kdofrhet></polyline></svg><span id="complete-btn-text" data-astro-cid-kdofrhet>Concluir</span></button></div></div></div>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/VideoPlayer.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/VideoPlayer.astro", void 0);
//#endregion
//#region src/components/LessonItem.astro
createAstro("https://astro.build");
var $$LessonItem = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LessonItem;
	const { courseId, lesson, isCurrent = false } = Astro.props;
	const watchHref = `/watch/${courseId}/${lesson.id}`;
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`lesson-item ${isCurrent ? "current-lesson" : ""}`, "class")}${addAttribute(lesson.id, "data-lesson-id")}${addAttribute(courseId, "data-course-id")} data-astro-cid-r345l6pb><a${addAttribute(watchHref, "href")} class="lesson-link" data-astro-cid-r345l6pb><div class="lesson-status-icon"${addAttribute(lesson.id, "data-status-icon-for")} data-astro-cid-r345l6pb>${isCurrent ? renderTemplate`<svg class="icon-playing" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" data-astro-cid-r345l6pb><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-r345l6pb></polygon></svg>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<svg class="icon-unwatched" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-r345l6pb><polygon points="5 3 19 12 5 21 5 3" data-astro-cid-r345l6pb></polygon></svg><svg class="icon-completed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: none;" data-astro-cid-r345l6pb><polyline points="20 6 9 17 4 12" data-astro-cid-r345l6pb></polyline></svg>` })}`}</div><div class="lesson-info" data-astro-cid-r345l6pb><span class="lesson-index" data-astro-cid-r345l6pb>${String(lesson.order_index).padStart(2, "0")}</span><span class="lesson-title" data-astro-cid-r345l6pb>${lesson.display_title}</span></div><div class="lesson-meta" data-astro-cid-r345l6pb>${(() => {
		const validMats = (lesson.materials || []).filter((m) => {
			const t = (m.title || "").toLowerCase();
			const p = (m.relative_path || "").toLowerCase();
			return !t.includes("artigo") && !t.includes("transcri") && !t.includes("transcript") && !t.includes("article") && !p.includes("artigo") && !p.includes("transcri") && !p.includes("transcript") && !p.includes("article");
		});
		return validMats.length > 0 ? renderTemplate`<span class="materials-badge"${addAttribute(`${validMats.length} material(is) complementar(es)`, "title")} data-astro-cid-r345l6pb><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-r345l6pb><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-r345l6pb></path><polyline points="14 2 14 8 20 8" data-astro-cid-r345l6pb></polyline></svg><span data-astro-cid-r345l6pb>${validMats.length}</span></span>` : null;
	})()}<span class="lesson-duration" data-astro-cid-r345l6pb>${lesson.duration_formatted}</span></div></a></div>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/LessonItem.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/LessonItem.astro", void 0);
//#endregion
//#region src/components/ModuleAccordion.astro
createAstro("https://astro.build");
var $$ModuleAccordion = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ModuleAccordion;
	const { courseId, module, defaultOpen = false, currentLessonId } = Astro.props;
	const hasCurrentLesson = currentLessonId ? module.lessons.some((l) => l.id === currentLessonId) : false;
	const isOpen = defaultOpen || hasCurrentLesson;
	const totalDurationSecs = module.lessons.reduce((acc, l) => acc + l.duration_seconds, 0);
	const totalMinutes = Math.round(totalDurationSecs / 60);
	return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`module-accordion-item ${isOpen ? "open" : ""}`, "class")}${addAttribute(module.id, "data-module-id")}${addAttribute(module.lessons.length, "data-total-lessons")} data-astro-cid-t5yebsvz><button type="button" class="module-header-btn"${addAttribute(isOpen ? "true" : "false", "aria-expanded")} data-astro-cid-t5yebsvz><div class="header-left" data-astro-cid-t5yebsvz><div class="expand-chevron" data-astro-cid-t5yebsvz><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-t5yebsvz><polyline points="6 9 12 15 18 9" data-astro-cid-t5yebsvz></polyline></svg></div><div class="module-title-group" data-astro-cid-t5yebsvz><span class="module-index" data-astro-cid-t5yebsvz>Módulo ${String(module.order_index).padStart(2, "0")}</span><h4 class="module-title" data-astro-cid-t5yebsvz>${module.display_title}</h4></div></div><div class="header-right" data-astro-cid-t5yebsvz><div class="module-progress-wrapper" data-astro-cid-t5yebsvz><div class="module-progress-mini-track" data-astro-cid-t5yebsvz><div class="module-progress-mini-fill" style="width: 0%;" data-astro-cid-t5yebsvz></div></div><span class="module-stats" data-astro-cid-t5yebsvz><span class="module-completed-count" data-astro-cid-t5yebsvz>0</span>/${module.lessons.length} aulas • ${totalMinutes} min</span></div></div></button><div class="module-content"${addAttribute(isOpen ? "display: block;" : "display: none;", "style")} data-astro-cid-t5yebsvz><div class="lessons-list" data-astro-cid-t5yebsvz>${module.lessons.map((lesson) => renderTemplate`${renderComponent($$result, "LessonItem", $$LessonItem, {
		"courseId": courseId,
		"lesson": lesson,
		"isCurrent": currentLessonId === lesson.id,
		"data-astro-cid-t5yebsvz": true
	})}`)}</div></div></div>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/ModuleAccordion.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/ModuleAccordion.astro", void 0);
//#endregion
//#region src/components/CourseSidebar.astro
createAstro("https://astro.build");
var $$CourseSidebar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CourseSidebar;
	const { course, currentLessonId } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<aside class="course-study-sidebar" id="course-study-sidebar"${addAttribute(course.id, "data-course-id")}${addAttribute(course.lessons_count, "data-total-lessons")} data-astro-cid-6vmd22lb><div class="sidebar-header" data-astro-cid-6vmd22lb><div class="sidebar-top-nav" data-astro-cid-6vmd22lb><a href="/courses" class="back-to-course-link" title="Voltar ao catálogo de cursos" data-astro-cid-6vmd22lb><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-6vmd22lb><polyline points="15 18 9 12 15 6" data-astro-cid-6vmd22lb></polyline></svg><span data-astro-cid-6vmd22lb>Voltar aos Cursos</span></a><span class="provider-pill" data-astro-cid-6vmd22lb>${course.provider}</span></div><h2 class="sidebar-course-title" data-astro-cid-6vmd22lb>${course.display_title}</h2><div class="sidebar-progress-box" data-astro-cid-6vmd22lb><div class="progress-meta" data-astro-cid-6vmd22lb><span data-astro-cid-6vmd22lb>Progresso Geral</span><span id="sidebar-progress-num" data-astro-cid-6vmd22lb>0%</span></div><div class="sidebar-progress-bar" data-astro-cid-6vmd22lb><div class="sidebar-progress-fill" id="sidebar-progress-bar-fill" style="width: 0%;" data-astro-cid-6vmd22lb></div></div></div></div><div class="sidebar-modules-scroll" data-astro-cid-6vmd22lb>${course.modules.map((mod) => renderTemplate`${renderComponent($$result, "ModuleAccordion", $$ModuleAccordion, {
		"courseId": course.id,
		"module": mod,
		"currentLessonId": currentLessonId,
		"data-astro-cid-6vmd22lb": true
	})}`)}</div></aside>${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseSidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/components/CourseSidebar.astro", void 0);
//#endregion
//#region src/pages/watch/[courseId]/[lessonId].astro
var _lessonId__exports = /* @__PURE__ */ __exportAll({
	default: () => $$LessonId,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$LessonId = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LessonId;
	const { courseId, lessonId } = Astro.params;
	const course = courseId ? getCourseById(courseId) : void 0;
	if (!course) return Astro.redirect("/404");
	let currentLesson;
	let currentModule;
	let allLessonsInCourse = [];
	for (const mod of course.modules) for (const les of mod.lessons) {
		allLessonsInCourse.push({
			...les,
			moduleId: mod.id
		});
		if (les.id === lessonId) {
			currentLesson = les;
			currentModule = mod;
		}
	}
	if (!currentLesson) {
		if (allLessonsInCourse.length > 0) {
			currentLesson = allLessonsInCourse[0];
			currentModule = course.modules[0];
		} else return Astro.redirect("/courses");
	}
	const currentIdx = allLessonsInCourse.findIndex((l) => l.id === currentLesson.id);
	const prevLesson = currentIdx > 0 ? allLessonsInCourse[currentIdx - 1] : null;
	const nextLesson = currentIdx < allLessonsInCourse.length - 1 ? allLessonsInCourse[currentIdx + 1] : null;
	const prevLessonHref = prevLesson ? `/watch/${course.id}/${prevLesson.id}` : void 0;
	const nextLessonHref = nextLesson ? `/watch/${course.id}/${nextLesson.id}` : void 0;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${currentLesson.display_title} — ${course.display_title}`,
		"hideNavbar": false,
		"data-astro-cid-kum3xwlm": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="watch-layout" data-astro-cid-kum3xwlm><!-- Main Content Area: Video and Details --><div class="watch-main-column" data-astro-cid-kum3xwlm><div class="watch-video-section" data-astro-cid-kum3xwlm>${renderComponent($$result, "VideoPlayer", $$VideoPlayer, {
		"courseId": course.id,
		"lesson": currentLesson,
		"prevLessonHref": prevLessonHref,
		"nextLessonHref": nextLessonHref,
		"nextLessonTitle": nextLesson?.display_title,
		"data-astro-cid-kum3xwlm": true
	})}</div><!-- Lesson Metadata and Materials --><div class="lesson-details-section" data-astro-cid-kum3xwlm><div class="lesson-header-row" data-astro-cid-kum3xwlm><div class="lesson-info" data-astro-cid-kum3xwlm><span class="lesson-module-tag" data-astro-cid-kum3xwlm>Módulo ${currentModule?.order_index}: ${currentModule?.display_title}</span><h1 class="lesson-main-title" data-astro-cid-kum3xwlm>${currentLesson.display_title}</h1></div><button type="button" class="btn btn-secondary btn-sm" id="btn-watch-grade-modal"${addAttribute(course.id, "data-course-id")} data-astro-cid-kum3xwlm><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kum3xwlm><polygon points="12 2 2 7 12 12 22 7 12 2" data-astro-cid-kum3xwlm></polygon><polyline points="2 17 12 22 22 17" data-astro-cid-kum3xwlm></polyline><polyline points="2 12 12 17 22 12" data-astro-cid-kum3xwlm></polyline></svg><span data-astro-cid-kum3xwlm>Grade Completa</span></button></div><!-- Complementary Materials & Documents (Excluding articles and transcripts) -->${(() => {
		const validMaterials = (currentLesson.materials || []).filter((mat) => {
			const t = (mat.title || "").toLowerCase();
			const p = (mat.relative_path || "").toLowerCase();
			return !t.includes("artigo") && !t.includes("transcri") && !t.includes("transcript") && !t.includes("article") && !p.includes("artigo") && !p.includes("transcri") && !p.includes("transcript") && !p.includes("article");
		});
		return validMaterials.length > 0 ? renderTemplate`<div class="materials-box" data-astro-cid-kum3xwlm><h3 class="materials-title" data-astro-cid-kum3xwlm><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kum3xwlm><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-kum3xwlm></path><polyline points="14 2 14 8 20 8" data-astro-cid-kum3xwlm></polyline></svg><span data-astro-cid-kum3xwlm>Materiais Complementares</span></h3><div class="materials-grid" data-astro-cid-kum3xwlm>${validMaterials.map((mat) => renderTemplate`<div class="material-item-card" data-astro-cid-kum3xwlm><div class="material-icon-badge" data-astro-cid-kum3xwlm><span class="type-badge" data-astro-cid-kum3xwlm>${mat.type.toUpperCase()}</span></div><div class="material-meta" data-astro-cid-kum3xwlm><strong class="material-name" data-astro-cid-kum3xwlm>${mat.title}</strong><span class="material-path" data-astro-cid-kum3xwlm>${mat.relative_path}</span></div><a${addAttribute(`/api/video?path=${encodeURIComponent(mat.relative_path)}`, "href")} target="_blank" class="btn btn-secondary btn-sm" download data-astro-cid-kum3xwlm>Baixar / Visualizar</a></div>`)}</div></div>` : null;
	})()}</div></div><!-- Course Syllabus Sidebar -->${renderComponent($$result, "CourseSidebar", $$CourseSidebar, {
		"course": course,
		"currentLessonId": currentLesson.id,
		"data-astro-cid-kum3xwlm": true
	})}</div>` })}${renderScript($$result, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/watch/[courseId]/[lessonId].astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/Projetos Antigravity/download synapse/mindflix/src/pages/watch/[courseId]/[lessonId].astro", void 0);
var $$file = "D:/Projetos Antigravity/download synapse/mindflix/src/pages/watch/[courseId]/[lessonId].astro";
var $$url = "/watch/[courseId]/[lessonId]";
//#endregion
//#region \0virtual:astro:page:src/pages/watch/[courseId]/[lessonId]@_@astro
var page = () => _lessonId__exports;
//#endregion
export { page };
