import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import fs from "node:fs";
import nodePath from "node:path";
//#region src/pages/api/video.ts
var video_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var COURSES_ROOT = nodePath.resolve(process.env.COURSES_ROOT || nodePath.join(process.cwd(), ".."));
var GET = async ({ request }) => {
	const url = new URL(request.url);
	const relPath = url.searchParams.get("path");
	const driveId = url.searchParams.get("drive_id");
	if (driveId) return Response.redirect(`https://drive.google.com/file/d/${driveId}/preview`, 302);
	if (!relPath) return new Response(JSON.stringify({ error: "Parâmetro \"path\" ou \"drive_id\" é obrigatório." }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	if (relPath.includes("drive.google.com") || relPath.startsWith("drive:")) {
		const cleanId = relPath.replace(/^drive:/i, "").replace(/.*\/file\/d\/([a-zA-Z0-9_-]+).*/, "$1");
		return Response.redirect(`https://drive.google.com/file/d/${cleanId}/preview`, 302);
	}
	const sanitizedRel = relPath.replace(/^[\/\\]+/, "").replace(/\.\.[\/\\]/g, "");
	const normalizedRel = nodePath.normalize(sanitizedRel);
	const filePath = nodePath.resolve(COURSES_ROOT, normalizedRel);
	if (!(process.platform === "win32" ? filePath.toLowerCase().startsWith(COURSES_ROOT.toLowerCase()) : filePath.startsWith(COURSES_ROOT))) return new Response(JSON.stringify({ error: "Acesso não autorizado ao caminho solicitado." }), {
		status: 403,
		headers: { "Content-Type": "application/json" }
	});
	if (!fs.existsSync(filePath)) return new Response(JSON.stringify({
		error: "Arquivo não encontrado na biblioteca local.",
		expectedPath: relPath
	}), {
		status: 404,
		headers: { "Content-Type": "application/json" }
	});
	const fileSize = fs.statSync(filePath).size;
	const range = request.headers.get("range");
	const ext = nodePath.extname(filePath).toLowerCase();
	let contentType = "video/mp4";
	if (ext === ".webm") contentType = "video/webm";
	else if (ext === ".mkv") contentType = "video/x-matroska";
	else if (ext === ".mp3") contentType = "audio/mpeg";
	else if (ext === ".pdf") contentType = "application/pdf";
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
		if (start >= fileSize) return new Response(null, {
			status: 416,
			headers: { "Content-Range": `bytes */${fileSize}` }
		});
		const chunkSize = end - start + 1;
		const nodeStream = fs.createReadStream(filePath, {
			start,
			end
		});
		const webStream = new ReadableStream({
			start(controller) {
				nodeStream.on("data", (chunk) => controller.enqueue(chunk));
				nodeStream.on("end", () => controller.close());
				nodeStream.on("error", (err) => controller.error(err));
			},
			cancel() {
				nodeStream.destroy();
			}
		});
		return new Response(webStream, {
			status: 206,
			headers: {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunkSize.toString(),
				"Content-Type": contentType,
				"Cache-Control": "no-cache"
			}
		});
	} else {
		const nodeStream = fs.createReadStream(filePath);
		const webStream = new ReadableStream({
			start(controller) {
				nodeStream.on("data", (chunk) => controller.enqueue(chunk));
				nodeStream.on("end", () => controller.close());
				nodeStream.on("error", (err) => controller.error(err));
			},
			cancel() {
				nodeStream.destroy();
			}
		});
		return new Response(webStream, {
			status: 200,
			headers: {
				"Content-Length": fileSize.toString(),
				"Content-Type": contentType,
				"Accept-Ranges": "bytes"
			}
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/video@_@ts
var page = () => video_exports;
//#endregion
export { page };
