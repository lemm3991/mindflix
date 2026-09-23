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
* Resolves the Google Drive ID for a lesson if present.
*/
function getLessonDriveId(lesson) {
	if (!lesson) return null;
	return extractDriveId(lesson.drive_file_id) || extractDriveId(lesson.drive_url) || extractDriveId(lesson.video_url) || extractDriveId(lesson.relative_path);
}
//#endregion
export { getLessonDriveId as n, getDrivePreviewUrl as t };
