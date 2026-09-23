import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { H as createAstro, M as maybeRenderHead, P as addAttribute, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
import { l as isPlayableVideoLesson } from "./catalog_BH-ygd_W.mjs";
import { n as getFirstPlayableLessonInTrilha, r as getTrilhaFullStructure } from "./trilhas_CUzDCp4m.mjs";
import { a as $$VideoPlayer, i as $$PlaylistSidebar, n as $$FocusMode, r as $$ChallengeModal, t as $$LessonNotes } from "./LessonNotes_DyFBSdNn.mjs";
//#region src/components/TrilhaSidebar.astro
createAstro("https://astro.build");
var $$TrilhaSidebar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$TrilhaSidebar;
	const { trilha, coursesWithModules, currentLessonId } = Astro.props;
	return renderTemplate`${renderComponent($$result, "PlaylistSidebar", $$PlaylistSidebar, {
		"type": "trilha",
		"trilha": trilha,
		"coursesWithModules": coursesWithModules,
		"currentLessonId": currentLessonId
	})}`;
}, "D:/projetos antigravity/mindflix/src/components/TrilhaSidebar.astro", void 0);
//#endregion
//#region src/pages/watch/trilha/[trilhaId]/[lessonId].astro
var _lessonId__exports = /* @__PURE__ */ __exportAll({
	default: () => $$LessonId,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$LessonId = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$LessonId;
	const { trilhaId, lessonId } = Astro.params;
	if (!trilhaId) return Astro.redirect("/courses");
	const struct = getTrilhaFullStructure(trilhaId);
	if (!struct || struct.allLessons.length === 0) return Astro.redirect("/404");
	const { trilha, coursesWithModules, allLessons } = struct;
	let currentLessonItem = allLessons.find((item) => item.lesson.id === lessonId);
	if (!currentLessonItem) currentLessonItem = getFirstPlayableLessonInTrilha(trilha.id) || allLessons[0];
	const currentLesson = currentLessonItem.lesson;
	const currentIdx = allLessons.findIndex((item) => item.lesson.id === currentLesson.id);
	const prevLessonItem = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
	const nextLessonItem = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
	const prevLessonHref = prevLessonItem ? `/watch/trilha/${trilha.id}/${prevLessonItem.lesson.id}` : void 0;
	const nextLessonHref = nextLessonItem ? `/watch/trilha/${trilha.id}/${nextLessonItem.lesson.id}` : void 0;
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${currentLesson.display_title} — Trilha: ${trilha.title}`,
		"hideNavbar": false,
		"data-astro-cid-4fiuxbkn": true
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "FocusMode", $$FocusMode, { "data-astro-cid-4fiuxbkn": true })}${maybeRenderHead($$result)}<div class="watch-layout" data-astro-cid-4fiuxbkn><!-- Main Content Area: Video and Details --><div class="watch-main-column" data-astro-cid-4fiuxbkn><div class="watch-video-section" data-astro-cid-4fiuxbkn>${renderComponent($$result, "VideoPlayer", $$VideoPlayer, {
		"courseId": currentLessonItem.courseId,
		"lesson": currentLesson,
		"prevLessonHref": prevLessonHref,
		"nextLessonHref": nextLessonHref,
		"nextLessonTitle": nextLessonItem?.lesson.display_title,
		"data-astro-cid-4fiuxbkn": true
	})}</div><!-- Lesson Metadata and Materials --><div class="lesson-details-section" data-astro-cid-4fiuxbkn><div class="lesson-header-row" data-astro-cid-4fiuxbkn><div class="lesson-info" data-astro-cid-4fiuxbkn><div class="trilha-context-breadcrumb" data-astro-cid-4fiuxbkn><span class="trilha-name-tag" data-astro-cid-4fiuxbkn>Trilha: ${trilha.title}</span><span class="sep" data-astro-cid-4fiuxbkn>›</span><span class="course-name-tag" data-astro-cid-4fiuxbkn>${currentLessonItem.courseType} ${currentLessonItem.courseOrder}: ${currentLessonItem.courseTitle}</span></div><h1 class="lesson-main-title" data-astro-cid-4fiuxbkn>${currentLesson.display_title}</h1></div><div class="lesson-actions-group" data-astro-cid-4fiuxbkn><!-- Desafio da Aula Button --><button type="button" class="btn btn-secondary btn-sm btn-challenge-trigger" data-challenge-mode="lesson"${addAttribute(currentLessonItem.courseId, "data-course-id")}${addAttribute(currentLesson.id, "data-lesson-id")}${addAttribute(currentLesson.display_title, "data-lesson-title")} title="Iniciar teste interativo desta aula com IA" data-astro-cid-4fiuxbkn><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-4fiuxbkn><circle cx="12" cy="12" r="10" data-astro-cid-4fiuxbkn></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" data-astro-cid-4fiuxbkn></path><line x1="12" y1="17" x2="12.01" y2="17" data-astro-cid-4fiuxbkn></line></svg><span data-astro-cid-4fiuxbkn>Desafio com IA</span></button></div></div><!-- Student Classroom Notes Area (Above Downloads Area) -->${renderComponent($$result, "LessonNotes", $$LessonNotes, {
		"lessonId": currentLesson.id,
		"courseId": currentLessonItem.courseId,
		"watchUrl": `/watch/trilha/${trilha.id}/${currentLesson.id}`,
		"courseTitle": `${trilha.title} — ${currentLessonItem.courseTitle}`,
		"lessonTitle": currentLesson.display_title,
		"data-astro-cid-4fiuxbkn": true
	})}<!-- Complementary Materials & Documents Section (Always visible by default) -->${(() => {
		const isDownloadableMat = (pathOrTitle) => {
			const ext = (pathOrTitle || "").split(".").pop()?.toLowerCase() || "";
			return ![
				"mp4",
				"mkv",
				"webm",
				"mov",
				"avi",
				"m4v",
				"ts",
				"md",
				"markdown",
				"json",
				"jpg",
				"jpeg",
				"png",
				"webp",
				"ini"
			].includes(ext);
		};
		const getMatFilename = (relPath, title) => {
			if (relPath) {
				const fname = relPath.replace(/\\/g, "/").split("/").pop();
				if (fname && fname.includes(".")) return fname;
			}
			return title ? `${title.replace(/[^a-zA-Z0-9_\- ]/g, "")}.pdf` : "material.pdf";
		};
		const lessonMaterials = (currentLesson.materials || []).filter((mat) => isDownloadableMat(mat.relative_path || mat.title)).map((mat) => ({
			id: mat.id || mat.relative_path,
			title: mat.title || "Material Complementar",
			type: (mat.type || "ARQUIVO").toUpperCase(),
			relative_path: mat.relative_path || "",
			filename: getMatFilename(mat.relative_path || "", mat.title || "material"),
			url: mat.drive_file_id ? `https://drive.google.com/uc?export=download&id=${mat.drive_file_id}` : mat.drive_url || `/api/video?path=${encodeURIComponent(mat.relative_path)}&download=1`,
			driveId: mat.drive_file_id
		}));
		const trilhaFiles = (allLessons || []).filter((lItem) => !isPlayableVideoLesson(lItem.lesson) && lItem.lesson.id !== currentLesson.id && isDownloadableMat(lItem.lesson.relative_path || lItem.lesson.raw_title)).map((lItem) => {
			const les = lItem.lesson;
			const ext = (les.relative_path || "").split(".").pop()?.toUpperCase() || (les.type || "FILE").toUpperCase();
			return {
				id: les.id,
				title: les.display_title || les.raw_title,
				type: ext,
				relative_path: les.relative_path || "",
				filename: getMatFilename(les.relative_path || "", les.display_title || les.raw_title || "material"),
				url: les.drive_file_id ? `https://drive.google.com/uc?export=download&id=${les.drive_file_id}` : les.drive_url || `/api/video?path=${encodeURIComponent(les.relative_path)}&download=1`,
				driveId: les.drive_file_id
			};
		});
		const seen = /* @__PURE__ */ new Set();
		const allMaterials = [...lessonMaterials, ...trilhaFiles].filter((item) => {
			const key = item.url || item.id || item.title;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
		return renderTemplate`<div class="materials-box" id="watch-materials-section" data-astro-cid-4fiuxbkn><div class="materials-header" data-astro-cid-4fiuxbkn><div class="materials-title-wrap" data-astro-cid-4fiuxbkn><div class="materials-icon-circle" data-astro-cid-4fiuxbkn><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-4fiuxbkn><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-4fiuxbkn></path><polyline points="7 10 12 15 17 10" data-astro-cid-4fiuxbkn></polyline><line x1="12" y1="15" x2="12" y2="3" data-astro-cid-4fiuxbkn></line></svg></div><div data-astro-cid-4fiuxbkn><h3 class="materials-main-heading" data-astro-cid-4fiuxbkn>Arquivos e Materiais para Download</h3><p class="materials-subtitle" data-astro-cid-4fiuxbkn>Apostilas, códigos, PDFs e materiais de apoio desta trilha de formação</p></div></div>${allMaterials.length > 0 && renderTemplate`<span class="materials-count-pill" data-astro-cid-4fiuxbkn>${allMaterials.length} ${allMaterials.length === 1 ? "arquivo" : "arquivos"}</span>`}</div>${allMaterials.length > 0 ? renderTemplate`<div class="materials-grid" data-astro-cid-4fiuxbkn>${allMaterials.map((mat) => renderTemplate`<div class="material-item-card" data-astro-cid-4fiuxbkn><div class="material-card-left" data-astro-cid-4fiuxbkn><span${addAttribute(`type-badge type-badge-${mat.type.toLowerCase()}`, "class")} data-astro-cid-4fiuxbkn>${mat.type}</span><div class="material-meta" data-astro-cid-4fiuxbkn><strong class="material-name" data-astro-cid-4fiuxbkn>${mat.title}</strong>${mat.relative_path && renderTemplate`<span class="material-path" data-astro-cid-4fiuxbkn>${mat.relative_path}</span>`}</div></div><a${addAttribute(mat.url, "href")} target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm material-download-btn"${addAttribute(mat.filename, "download")}${addAttribute(`Baixar ${mat.title}`, "title")}${addAttribute(`Baixar ${mat.title}`, "aria-label")} data-astro-cid-4fiuxbkn><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-4fiuxbkn><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-4fiuxbkn></path><polyline points="7 10 12 15 17 10" data-astro-cid-4fiuxbkn></polyline><line x1="12" y1="15" x2="12" y2="3" data-astro-cid-4fiuxbkn></line></svg></a></div>`)}</div>` : renderTemplate`<div class="materials-empty-state" data-astro-cid-4fiuxbkn><div class="materials-empty-icon" data-astro-cid-4fiuxbkn><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-4fiuxbkn><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-4fiuxbkn></path><polyline points="14 2 14 8 20 8" data-astro-cid-4fiuxbkn></polyline><line x1="16" y1="13" x2="8" y2="13" data-astro-cid-4fiuxbkn></line><line x1="16" y1="17" x2="8" y2="17" data-astro-cid-4fiuxbkn></line></svg></div><div class="materials-empty-info" data-astro-cid-4fiuxbkn><p class="materials-empty-text" data-astro-cid-4fiuxbkn>Nenhum arquivo ou documento adicional anexado para esta aula.</p></div></div>`}</div>`;
	})()}</div></div><!-- Trilha Playlist Sidebar (Collapsible Courses) -->${renderComponent($$result, "TrilhaSidebar", $$TrilhaSidebar, {
		"trilha": trilha,
		"coursesWithModules": coursesWithModules,
		"currentLessonId": currentLesson.id,
		"currentCourseId": currentLessonItem.courseId,
		"data-astro-cid-4fiuxbkn": true
	})}</div>${renderComponent($$result, "ChallengeModal", $$ChallengeModal, { "data-astro-cid-4fiuxbkn": true })}` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/watch/trilha/[trilhaId]/[lessonId].astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/watch/trilha/[trilhaId]/[lessonId].astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/watch/trilha/[trilhaId]/[lessonId].astro";
var $$url = "/watch/trilha/[trilhaId]/[lessonId]";
//#endregion
//#region \0virtual:astro:page:src/pages/watch/trilha/[trilhaId]/[lessonId]@_@astro
var page = () => _lessonId__exports;
//#endregion
export { page };
