import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/pages/api/video.ts
var video_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
function getCoursesRoot() {
	if (process.env.COURSES_ROOT) {
		const candidate = path.resolve(process.env.COURSES_ROOT.trim().replace(/^["']|["']$/g, ""));
		if (fs.existsSync(candidate)) return candidate;
	}
	try {
		const envPath = path.resolve(process.cwd(), ".env");
		if (fs.existsSync(envPath)) {
			const match = fs.readFileSync(envPath, "utf-8").match(/^COURSES_ROOT=["']?([^"'\r\n]+)["']?/m);
			if (match && match[1]) {
				const candidate = path.resolve(match[1].trim());
				if (fs.existsSync(candidate)) return candidate;
			}
		}
	} catch {}
	const gDriveCandidate = "G:\\Meu Drive\\Cursos\\Cursos Mindflix";
	if (fs.existsSync(gDriveCandidate)) return gDriveCandidate;
	return path.resolve(process.cwd(), "..");
}
function getDriveIdFromCatalog(relPath) {
	try {
		const catalogPath = path.resolve(process.cwd(), "src", "data", "catalog.json");
		if (fs.existsSync(catalogPath)) {
			const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
			if (!catalog || !catalog.courses) return null;
			const normTarget = relPath.replace(/\\/g, "/").toLowerCase().trim();
			const filenameTarget = path.basename(normTarget);
			for (const course of catalog.courses) for (const mod of course.modules || []) for (const les of mod.lessons || []) if (les.relative_path) {
				const lesNorm = les.relative_path.replace(/\\/g, "/").toLowerCase().trim();
				const lesFilename = path.basename(lesNorm);
				if (lesNorm === normTarget || filenameTarget && lesFilename === filenameTarget) {
					if (les.drive_file_id || les.drive_url) return les.drive_file_id || les.drive_url || null;
				}
			}
		}
	} catch (err) {
		console.error("Catalog lookup error:", err);
	}
	return null;
}
function resolveSafeFilePath(root, relPath) {
	let cleanRel = relPath;
	try {
		if (cleanRel.includes("%")) cleanRel = decodeURIComponent(cleanRel);
	} catch {}
	const sanitizedRel = cleanRel.replace(/^[\/\\]+/, "").replace(/\.\.[\/\\]/g, "");
	const normalizedRel = path.normalize(sanitizedRel);
	let resolvedPath = path.resolve(root, normalizedRel);
	if (!(process.platform === "win32" ? resolvedPath.toLowerCase().startsWith(root.toLowerCase()) : resolvedPath.startsWith(root))) return null;
	if (fs.existsSync(resolvedPath)) return {
		filePath: resolvedPath,
		rawPath: resolvedPath
	};
	if (process.platform === "win32") {
		const namespaced = path.toNamespacedPath(resolvedPath);
		if (fs.existsSync(namespaced)) return {
			filePath: namespaced,
			rawPath: resolvedPath
		};
	}
	const nfc = resolvedPath.normalize("NFC");
	if (fs.existsSync(nfc)) return {
		filePath: nfc,
		rawPath: nfc
	};
	const nfd = resolvedPath.normalize("NFD");
	if (fs.existsSync(nfd)) return {
		filePath: nfd,
		rawPath: nfd
	};
	if (resolvedPath.includes("+")) {
		const spaceVar = resolvedPath.replace(/\+/g, " ");
		if (fs.existsSync(spaceVar)) return {
			filePath: spaceVar,
			rawPath: spaceVar
		};
	}
	if (resolvedPath.includes(" ")) {
		const plusVar = resolvedPath.replace(/ /g, "+");
		if (fs.existsSync(plusVar)) return {
			filePath: plusVar,
			rawPath: plusVar
		};
	}
	if (resolvedPath.endsWith(".ts")) {
		const mp4Var = resolvedPath.slice(0, -3) + ".mp4";
		if (fs.existsSync(mp4Var)) return {
			filePath: mp4Var,
			rawPath: mp4Var
		};
	}
	if (resolvedPath.endsWith(".mp4")) {
		const tsVar = resolvedPath.slice(0, -4) + ".ts";
		if (fs.existsSync(tsVar)) return {
			filePath: tsVar,
			rawPath: tsVar
		};
	}
	return null;
}
async function proxyGoogleDriveStream(cleanId, request) {
	if (process.env.VERCEL) return Response.redirect(`https://drive.google.com/file/d/${cleanId}/preview`, 302);
	try {
		const range = request.headers.get("range");
		const upstreamHeaders = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" };
		if (range) upstreamHeaders["Range"] = range;
		const driveUrl = `https://drive.usercontent.google.com/download?id=${cleanId}&export=download&confirm=t`;
		const upstreamRes = await fetch(driveUrl, {
			headers: upstreamHeaders,
			redirect: "follow"
		});
		if (!upstreamRes.ok && upstreamRes.status !== 206) return Response.redirect(`https://drive.google.com/file/d/${cleanId}/preview`, 302);
		const responseHeaders = new Headers();
		responseHeaders.set("Content-Type", upstreamRes.headers.get("content-type") || "video/mp4");
		responseHeaders.set("Content-Disposition", "inline");
		responseHeaders.set("Accept-Ranges", "bytes");
		responseHeaders.set("Cache-Control", "public, max-age=3600");
		if (upstreamRes.headers.get("content-length")) responseHeaders.set("Content-Length", upstreamRes.headers.get("content-length"));
		if (upstreamRes.headers.get("content-range")) responseHeaders.set("Content-Range", upstreamRes.headers.get("content-range"));
		return new Response(upstreamRes.body, {
			status: upstreamRes.status,
			headers: responseHeaders
		});
	} catch (err) {
		console.error("Failed to proxy Google Drive stream:", err);
		return Response.redirect(`https://drive.google.com/file/d/${cleanId}/preview`, 302);
	}
}
var GET = async ({ request }) => {
	const url = new URL(request.url);
	const relPath = url.searchParams.get("path");
	const driveId = url.searchParams.get("drive_id");
	const streamParam = url.searchParams.get("stream");
	if (driveId) {
		const cleanId = driveId.replace(/^drive:/i, "").replace(/.*\/file\/d\/([a-zA-Z0-9_-]+).*/, "$1");
		if (streamParam === "1" || streamParam === "true") return proxyGoogleDriveStream(cleanId, request);
		return Response.redirect(`https://drive.google.com/file/d/${cleanId}/preview`, 302);
	}
	if (!relPath) return new Response(JSON.stringify({ error: "Parâmetro \"path\" ou \"drive_id\" é obrigatório." }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	if (relPath.includes("drive.google.com") || relPath.startsWith("drive:")) {
		const cleanId = relPath.replace(/^drive:/i, "").replace(/.*\/file\/d\/([a-zA-Z0-9_-]+).*/, "$1");
		if (streamParam === "1" || streamParam === "true") return proxyGoogleDriveStream(cleanId, request);
		return Response.redirect(`https://drive.google.com/file/d/${cleanId}/preview`, 302);
	}
	const driveIdFromCatalog = getDriveIdFromCatalog(relPath);
	if (driveIdFromCatalog) {
		const cleanId = driveIdFromCatalog.replace(/^drive:/i, "").replace(/.*\/file\/d\/([a-zA-Z0-9_-]+).*/, "$1");
		if (streamParam === "1" || streamParam === "true") return proxyGoogleDriveStream(cleanId, request);
		return Response.redirect(`https://drive.usercontent.google.com/download?id=${cleanId}&export=download&confirm=t`, 302);
	}
	const resolved = resolveSafeFilePath(getCoursesRoot(), relPath);
	if (!resolved) {
		if (url.searchParams.get("download") === "1" || url.searchParams.get("download") === "true") return new Response(`<!DOCTYPE html><html><body style="background:#0b0e14;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><div style="text-align:center;max-width:500px;padding:2rem;background:#161a23;border-radius:12px;border:1px solid rgba(255,255,255,0.1);box-shadow:0 10px 40px rgba(0,0,0,0.5);"><h2 style="margin-top:0;">Arquivo Indisponível</h2><p style="color:#94a3b8;font-size:0.9rem;line-height:1.5;">O arquivo "${relPath}" não foi localizado na biblioteca local ou no Google Drive.</p><button onclick="window.close()" style="background:#00f2fe;color:#000;border:none;padding:0.5rem 1.25rem;border-radius:6px;font-weight:bold;cursor:pointer;margin-top:0.5rem;">Fechar Janela</button></div></body></html>`, {
			status: 404,
			headers: { "Content-Type": "text/html; charset=utf-8" }
		});
		return new Response(JSON.stringify({
			error: "Arquivo não encontrado na biblioteca local.",
			expectedPath: relPath
		}), {
			status: 404,
			headers: { "Content-Type": "application/json" }
		});
	}
	const filePath = resolved.filePath;
	const fileSize = fs.statSync(filePath).size;
	const range = request.headers.get("range");
	const ext = path.extname(resolved.rawPath).toLowerCase();
	let contentType = "video/mp4";
	if (ext === ".webm") contentType = "video/webm";
	else if (ext === ".mkv") contentType = "video/x-matroska";
	else if (ext === ".ts") contentType = "video/mp2t";
	else if (ext === ".mp3") contentType = "audio/mpeg";
	else if (ext === ".pdf") contentType = "application/pdf";
	else if (ext === ".png") contentType = "image/png";
	else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
	else if (ext === ".webp") contentType = "image/webp";
	else if (ext === ".md" || ext === ".txt") contentType = "text/plain; charset=utf-8";
	if (range) {
		const parts = range.replace(/bytes=/, "").split("-");
		let start;
		let end;
		if (parts[0] === "") {
			const suffix = parseInt(parts[1], 10);
			start = Math.max(0, fileSize - suffix);
			end = fileSize - 1;
		} else {
			start = parseInt(parts[0], 10);
			end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
		}
		if (isNaN(start) || isNaN(end) || start >= fileSize || start > end) return new Response(null, {
			status: 416,
			headers: { "Content-Range": `bytes */${fileSize}` }
		});
		const chunkSize = end - start + 1;
		const nodeStream = fs.createReadStream(filePath, {
			start,
			end
		});
		let isClosed = false;
		const webStream = new ReadableStream({
			start(controller) {
				nodeStream.on("data", (chunk) => {
					if (!isClosed) try {
						controller.enqueue(chunk);
					} catch {
						isClosed = true;
						nodeStream.destroy();
					}
				});
				nodeStream.on("end", () => {
					if (!isClosed) {
						isClosed = true;
						try {
							controller.close();
						} catch {}
					}
				});
				nodeStream.on("error", (err) => {
					if (!isClosed) {
						isClosed = true;
						try {
							controller.error(err);
						} catch {}
					}
				});
			},
			cancel() {
				isClosed = true;
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
		let isClosed = false;
		const webStream = new ReadableStream({
			start(controller) {
				nodeStream.on("data", (chunk) => {
					if (!isClosed) try {
						controller.enqueue(chunk);
					} catch {
						isClosed = true;
						nodeStream.destroy();
					}
				});
				nodeStream.on("end", () => {
					if (!isClosed) {
						isClosed = true;
						try {
							controller.close();
						} catch {}
					}
				});
				nodeStream.on("error", (err) => {
					if (!isClosed) {
						isClosed = true;
						try {
							controller.error(err);
						} catch {}
					}
				});
			},
			cancel() {
				isClosed = true;
				nodeStream.destroy();
			}
		});
		const isDownload = url.searchParams.get("download") === "1" || url.searchParams.get("download") === "true";
		const filename = path.basename(resolved.rawPath);
		return new Response(webStream, {
			status: 200,
			headers: {
				"Content-Length": fileSize.toString(),
				"Content-Type": contentType,
				"Accept-Ranges": "bytes",
				...isDownload ? { "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"` } : {}
			}
		});
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/video@_@ts
var page = () => video_exports;
//#endregion
export { page };
