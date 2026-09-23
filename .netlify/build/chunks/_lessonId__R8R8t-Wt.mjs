import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { F as defineScriptVars, H as createAstro, M as maybeRenderHead, P as addAttribute, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
import { i as getCourseById, l as isPlayableVideoLesson, o as getFirstPlayableLesson } from "./catalog_BH-ygd_W.mjs";
import { t as getCourseSourceId } from "./sources_NGS4vvxz.mjs";
import { a as $$VideoPlayer, i as $$PlaylistSidebar, n as $$FocusMode, r as $$ChallengeModal, t as $$LessonNotes } from "./LessonNotes_DyFBSdNn.mjs";
//#region src/components/CourseSidebar.astro
createAstro("https://astro.build");
var $$CourseSidebar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$CourseSidebar;
	const { course, currentLessonId } = Astro.props;
	return renderTemplate`${renderComponent($$result, "PlaylistSidebar", $$PlaylistSidebar, {
		"type": "course",
		"course": course,
		"currentLessonId": currentLessonId
	})}`;
}, "D:/projetos antigravity/mindflix/src/components/CourseSidebar.astro", void 0);
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
	const currentCourseSource = course ? getCourseSourceId(course) : "all";
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
		const firstPlayable = getFirstPlayableLesson(course);
		if (firstPlayable) {
			currentLesson = firstPlayable;
			currentModule = course.modules.find((m) => m.lessons.some((l) => l.id === firstPlayable.id)) || course.modules[0];
		} else if (allLessonsInCourse.length > 0) {
			currentLesson = allLessonsInCourse[0];
			currentModule = course.modules[0];
		} else return Astro.redirect("/courses");
	}
	const currentIdx = allLessonsInCourse.findIndex((l) => l.id === currentLesson.id);
	const prevLesson = currentIdx > 0 ? allLessonsInCourse[currentIdx - 1] : null;
	const nextLesson = currentIdx < allLessonsInCourse.length - 1 ? allLessonsInCourse[currentIdx + 1] : null;
	const prevLessonHref = prevLesson ? `/watch/${course.id}/${prevLesson.id}` : void 0;
	const nextLessonHref = nextLesson ? `/watch/${course.id}/${nextLesson.id}` : void 0;
	const isLastLessonInModule = Boolean(currentModule?.lessons && currentModule.lessons.length > 0 && currentModule.lessons[currentModule.lessons.length - 1].id === currentLesson.id);
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": `${currentLesson.display_title} — ${course.display_title}`,
		"hideNavbar": false,
		"data-astro-cid-kum3xwlm": true
	}, { "default": ($$result) => renderTemplate`<script>(function(){${defineScriptVars({ currentCourseSource })}
    window.__CURRENT_VIDEO_SOURCE__ = currentCourseSource;
  })();<\/script>${renderComponent($$result, "FocusMode", $$FocusMode, { "data-astro-cid-kum3xwlm": true })}${maybeRenderHead($$result)}<div class="watch-layout" data-astro-cid-kum3xwlm><!-- Main Content Area: Video and Details --><div class="watch-main-column" data-astro-cid-kum3xwlm><div class="watch-video-section" data-astro-cid-kum3xwlm>${renderComponent($$result, "VideoPlayer", $$VideoPlayer, {
		"courseId": course.id,
		"lesson": currentLesson,
		"prevLessonHref": prevLessonHref,
		"nextLessonHref": nextLessonHref,
		"nextLessonTitle": nextLesson?.display_title,
		"data-astro-cid-kum3xwlm": true
	})}</div><!-- Lesson Metadata and Materials --><div class="lesson-details-section" data-astro-cid-kum3xwlm><div class="lesson-header-row" data-astro-cid-kum3xwlm><div class="lesson-info" data-astro-cid-kum3xwlm><span class="lesson-module-tag" data-astro-cid-kum3xwlm>Módulo ${currentModule?.order_index}: ${currentModule?.display_title}</span><h1 class="lesson-main-title" data-astro-cid-kum3xwlm>${currentLesson.display_title}</h1></div><div class="lesson-actions-group" data-astro-cid-kum3xwlm><!-- Desafio da Aula Button (Always Present) --><button type="button" class="btn btn-secondary btn-sm btn-challenge-trigger" data-challenge-mode="lesson"${addAttribute(course.id, "data-course-id")}${addAttribute(currentLesson.id, "data-lesson-id")}${addAttribute(currentLesson.display_title, "data-lesson-title")} title="Iniciar teste interativo desta aula com IA" data-astro-cid-kum3xwlm><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kum3xwlm><circle cx="12" cy="12" r="10" data-astro-cid-kum3xwlm></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" data-astro-cid-kum3xwlm></path><line x1="12" y1="17" x2="12.01" y2="17" data-astro-cid-kum3xwlm></line></svg><span data-astro-cid-kum3xwlm>Desafio da Aula</span></button><!-- Desafio do Módulo Button (Present on Last Lesson of Module) -->${isLastLessonInModule && renderTemplate`<button type="button" class="btn btn-primary btn-sm btn-challenge-trigger btn-challenge-module" data-challenge-mode="module"${addAttribute(course.id, "data-course-id")}${addAttribute(currentModule?.id, "data-module-id")}${addAttribute(currentModule?.display_title, "data-module-title")} title="Iniciar avaliação completa de todas as aulas deste módulo com IA" data-astro-cid-kum3xwlm><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kum3xwlm><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" data-astro-cid-kum3xwlm></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" data-astro-cid-kum3xwlm></path><path d="M4 22h16" data-astro-cid-kum3xwlm></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" data-astro-cid-kum3xwlm></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" data-astro-cid-kum3xwlm></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" data-astro-cid-kum3xwlm></path></svg><span data-astro-cid-kum3xwlm>Desafio do Módulo</span></button>`}<button type="button" class="btn btn-secondary btn-sm" id="btn-watch-grade-modal"${addAttribute(course.id, "data-course-id")} data-astro-cid-kum3xwlm><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kum3xwlm><polygon points="12 2 2 7 12 12 22 7 12 2" data-astro-cid-kum3xwlm></polygon><polyline points="2 17 12 22 22 17" data-astro-cid-kum3xwlm></polyline><polyline points="2 12 12 17 22 12" data-astro-cid-kum3xwlm></polyline></svg><span data-astro-cid-kum3xwlm>Grade Completa</span></button></div></div><!-- Student Classroom Notes Area (Above Downloads Area) -->${renderComponent($$result, "LessonNotes", $$LessonNotes, {
		"lessonId": currentLesson.id,
		"courseId": course.id,
		"watchUrl": `/watch/${course.id}/${currentLesson.id}`,
		"courseTitle": course.display_title,
		"lessonTitle": currentLesson.display_title,
		"moduleTitle": currentModule?.display_title,
		"data-astro-cid-kum3xwlm": true
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
		const moduleFiles = (currentModule?.lessons || []).filter((les) => !isPlayableVideoLesson(les) && les.id !== currentLesson.id && isDownloadableMat(les.relative_path || les.raw_title)).map((les) => {
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
		const otherCourseFiles = moduleFiles.length === 0 ? (course.modules || []).flatMap((mod) => mod.lessons || []).filter((les) => !isPlayableVideoLesson(les) && les.id !== currentLesson.id && isDownloadableMat(les.relative_path || les.raw_title)).map((les) => {
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
		}) : [];
		const seen = /* @__PURE__ */ new Set();
		const allMaterials = [
			...lessonMaterials,
			...moduleFiles,
			...otherCourseFiles
		].filter((item) => {
			const key = item.url || item.id || item.title;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
		return renderTemplate`<div class="materials-box" id="watch-materials-section" data-astro-cid-kum3xwlm><div class="materials-header" data-astro-cid-kum3xwlm><div class="materials-title-wrap" data-astro-cid-kum3xwlm><div class="materials-icon-circle" data-astro-cid-kum3xwlm><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-kum3xwlm><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-kum3xwlm></path><polyline points="7 10 12 15 17 10" data-astro-cid-kum3xwlm></polyline><line x1="12" y1="15" x2="12" y2="3" data-astro-cid-kum3xwlm></line></svg></div><div data-astro-cid-kum3xwlm><h3 class="materials-main-heading" data-astro-cid-kum3xwlm>Arquivos e Materiais para Download</h3><p class="materials-subtitle" data-astro-cid-kum3xwlm>Apostilas, códigos, PDFs e materiais de apoio deste curso</p></div></div>${allMaterials.length > 0 && renderTemplate`<span class="materials-count-pill" data-astro-cid-kum3xwlm>${allMaterials.length} ${allMaterials.length === 1 ? "arquivo" : "arquivos"}</span>`}</div>${allMaterials.length > 0 ? renderTemplate`<div class="materials-grid" data-astro-cid-kum3xwlm>${allMaterials.map((mat) => renderTemplate`<div class="material-item-card" data-astro-cid-kum3xwlm><div class="material-card-left" data-astro-cid-kum3xwlm><span${addAttribute(`type-badge type-badge-${mat.type.toLowerCase()}`, "class")} data-astro-cid-kum3xwlm>${mat.type}</span><div class="material-meta" data-astro-cid-kum3xwlm><strong class="material-name" data-astro-cid-kum3xwlm>${mat.title}</strong>${mat.relative_path && renderTemplate`<span class="material-path" data-astro-cid-kum3xwlm>${mat.relative_path}</span>`}</div></div><a${addAttribute(mat.url, "href")} target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm material-download-btn"${addAttribute(mat.filename, "download")}${addAttribute(`Baixar ${mat.title}`, "title")}${addAttribute(`Baixar ${mat.title}`, "aria-label")} data-astro-cid-kum3xwlm><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-kum3xwlm><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-kum3xwlm></path><polyline points="7 10 12 15 17 10" data-astro-cid-kum3xwlm></polyline><line x1="12" y1="15" x2="12" y2="3" data-astro-cid-kum3xwlm></line></svg></a></div>`)}</div>` : renderTemplate`<div class="materials-empty-state" data-astro-cid-kum3xwlm><div class="materials-empty-icon" data-astro-cid-kum3xwlm><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-kum3xwlm><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" data-astro-cid-kum3xwlm></path><polyline points="14 2 14 8 20 8" data-astro-cid-kum3xwlm></polyline><line x1="16" y1="13" x2="8" y2="13" data-astro-cid-kum3xwlm></line><line x1="16" y1="17" x2="8" y2="17" data-astro-cid-kum3xwlm></line></svg></div><div class="materials-empty-info" data-astro-cid-kum3xwlm><p class="materials-empty-text" data-astro-cid-kum3xwlm>Nenhum arquivo ou documento adicional anexado para esta aula.</p></div></div>`}</div>`;
	})()}</div></div><!-- Course Syllabus Sidebar -->${renderComponent($$result, "CourseSidebar", $$CourseSidebar, {
		"course": course,
		"currentLessonId": currentLesson.id,
		"data-astro-cid-kum3xwlm": true
	})}</div>${renderComponent($$result, "ChallengeModal", $$ChallengeModal, { "data-astro-cid-kum3xwlm": true })}` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/watch/[courseId]/[lessonId].astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/watch/[courseId]/[lessonId].astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/watch/[courseId]/[lessonId].astro";
var $$url = "/watch/[courseId]/[lessonId]";
//#endregion
//#region \0virtual:astro:page:src/pages/watch/[courseId]/[lessonId]@_@astro
var page = () => _lessonId__exports;
//#endregion
export { page };
