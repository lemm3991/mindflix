import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_MEDIA_SERVER_URL } from '../../lib/mediaProvider';

// Centralized courses root directory resolution from env, .env file, or system candidate
function getCoursesRoot(): string {
  if (process.env.COURSES_ROOT) {
    const candidate = path.resolve(process.env.COURSES_ROOT.trim().replace(/^["']|["']$/g, ''));
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/^COURSES_ROOT=["']?([^"'\r\n]+)["']?/m);
      if (match && match[1]) {
        const candidate = path.resolve(match[1].trim());
        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
    }
  } catch {}

  return path.resolve(process.cwd(), '..');
}

// Helper to safely resolve and verify local media files across Windows MAX_PATH & encodings
function resolveSafeFilePath(root: string, relPath: string): { filePath: string; rawPath: string } | null {
  // Decode potential URI components if passed partially encoded
  let cleanRel = relPath;
  try {
    if (cleanRel.includes('%')) {
      cleanRel = decodeURIComponent(cleanRel);
    }
  } catch {}

  const sanitizedRel = cleanRel.replace(/^[\/\\]+/, '').replace(/\.\.[\/\\]/g, '');
  const normalizedRel = path.normalize(sanitizedRel);
  let resolvedPath = path.resolve(root, normalizedRel);

  // Security check: ensure path stays within root
  const isWithin = process.platform === 'win32'
    ? resolvedPath.toLowerCase().startsWith(root.toLowerCase())
    : resolvedPath.startsWith(root);

  if (!isWithin) return null;

  // 1. Direct check
  if (fs.existsSync(resolvedPath)) {
    return { filePath: resolvedPath, rawPath: resolvedPath };
  }

  // 2. Windows namespaced path (handles paths > 260 characters)
  if (process.platform === 'win32') {
    const namespaced = path.toNamespacedPath(resolvedPath);
    if (fs.existsSync(namespaced)) {
      return { filePath: namespaced, rawPath: resolvedPath };
    }
  }

  // 3. Unicode NFC / NFD normalization checks
  const nfc = resolvedPath.normalize('NFC');
  if (fs.existsSync(nfc)) return { filePath: nfc, rawPath: nfc };
  const nfd = resolvedPath.normalize('NFD');
  if (fs.existsSync(nfd)) return { filePath: nfd, rawPath: nfd };

  // 4. Query string '+' vs space variation check
  if (resolvedPath.includes('+')) {
    const spaceVar = resolvedPath.replace(/\+/g, ' ');
    if (fs.existsSync(spaceVar)) return { filePath: spaceVar, rawPath: spaceVar };
  }
  if (resolvedPath.includes(' ')) {
    const plusVar = resolvedPath.replace(/ /g, '+');
    if (fs.existsSync(plusVar)) return { filePath: plusVar, rawPath: plusVar };
  }

  // 5. If .ts was requested but an .mp4 exists (or vice versa)
  if (resolvedPath.endsWith('.ts')) {
    const mp4Var = resolvedPath.slice(0, -3) + '.mp4';
    if (fs.existsSync(mp4Var)) return { filePath: mp4Var, rawPath: mp4Var };
  }
  if (resolvedPath.endsWith('.mp4')) {
    const tsVar = resolvedPath.slice(0, -4) + '.ts';
    if (fs.existsSync(tsVar)) return { filePath: tsVar, rawPath: tsVar };
  }

  return null;
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const relPath = url.searchParams.get('path');

  if (!relPath) {
    return new Response(JSON.stringify({ error: 'Parâmetro "path" é obrigatório.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // If relPath is a .url or .webloc internet shortcut, redirect directly to the target web page
  if (relPath.toLowerCase().endsWith('.url') || relPath.toLowerCase().endsWith('.webloc')) {
    try {
      const catalogPath = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');
      if (fs.existsSync(catalogPath)) {
        const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
        const normTarget = relPath.replace(/\\/g, '/').toLowerCase().trim();
        for (const course of (catalog.courses || [])) {
          for (const mod of (course.modules || [])) {
            for (const les of (mod.lessons || [])) {
              for (const mat of (les.materials || [])) {
                if (mat.relative_path && mat.relative_path.replace(/\\/g, '/').toLowerCase().trim() === normTarget) {
                  const target = mat.target_url || mat.url;
                  if (target && !target.startsWith('/api/video')) {
                    return Response.redirect(target, 302);
                  }
                }
              }
            }
          }
        }
      }
    } catch {}

    const coursesRoot = getCoursesRoot();
    const resolvedShort = resolveSafeFilePath(coursesRoot, relPath);
    if (resolvedShort && fs.existsSync(resolvedShort.filePath)) {
      try {
        const content = fs.readFileSync(resolvedShort.filePath, 'utf-8');
        const match = content.match(/URL=(https?:\/\/[^\r\n]+)/i);
        if (match && match[1]) {
          return Response.redirect(match[1].trim(), 302);
        }
        const weblocMatch = content.match(/<string>(https?:\/\/[^<]+)<\/string>/i);
        if (weblocMatch && weblocMatch[1]) {
          return Response.redirect(weblocMatch[1].trim(), 302);
        }
      } catch {}
    }
  }

  const coursesRoot = getCoursesRoot();
  const resolved = resolveSafeFilePath(coursesRoot, relPath);

  // If not found locally on disk, redirect to the Streaming Server
  if (!resolved) {
    const isDownload = url.searchParams.get('download') === '1' || url.searchParams.get('download') === 'true';
    const serverUrl = process.env.MEDIA_SERVER_URL || DEFAULT_MEDIA_SERVER_URL;
    const cleanPath = relPath.replace(/\\/g, '/');
    const redirectTarget = `${serverUrl}/api/stream?path=${encodeURIComponent(cleanPath)}${isDownload ? '&download=1' : ''}`;
    return Response.redirect(redirectTarget, 302);
  }

  const filePath = resolved.filePath;
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  // Determine mime type
  const ext = path.extname(resolved.rawPath).toLowerCase();
  let contentType = 'video/mp4';
  if (ext === '.webm') contentType = 'video/webm';
  else if (ext === '.mkv') contentType = 'video/x-matroska';
  else if (ext === '.ts') contentType = 'video/mp2t';
  else if (ext === '.mp3') contentType = 'audio/mpeg';
  else if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
  else if (ext === '.webp') contentType = 'image/webp';
  else if (ext === '.md' || ext === '.txt') contentType = 'text/plain; charset=utf-8';

  if (range) {
    // Range: bytes=start-end or bytes=-suffix or bytes=start-
    const parts = range.replace(/bytes=/, '').split('-');
    let start: number;
    let end: number;

    if (parts[0] === '') {
      // Suffix byte range: bytes=-500
      const suffix = parseInt(parts[1], 10);
      start = Math.max(0, fileSize - suffix);
      end = fileSize - 1;
    } else {
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    }

    if (isNaN(start) || isNaN(end) || start >= fileSize || start > end) {
      return new Response(null, {
        status: 416,
        headers: {
          'Content-Range': `bytes */${fileSize}`
        }
      });
    }

    const chunkSize = end - start + 1;
    const nodeStream = fs.createReadStream(filePath, { start, end });
    
    let isClosed = false;
    // Convert Node Readable to Web ReadableStream safely
    // @ts-ignore
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => {
          if (!isClosed) {
            try {
              controller.enqueue(chunk);
            } catch {
              isClosed = true;
              nodeStream.destroy();
            }
          }
        });
        nodeStream.on('end', () => {
          if (!isClosed) {
            isClosed = true;
            try { controller.close(); } catch {}
          }
        });
        nodeStream.on('error', (err) => {
          if (!isClosed) {
            isClosed = true;
            try { controller.error(err); } catch {}
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
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      }
    });
  } else {
    // Full stream
    const nodeStream = fs.createReadStream(filePath);
    let isClosed = false;
    // @ts-ignore
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => {
          if (!isClosed) {
            try {
              controller.enqueue(chunk);
            } catch {
              isClosed = true;
              nodeStream.destroy();
            }
          }
        });
        nodeStream.on('end', () => {
          if (!isClosed) {
            isClosed = true;
            try { controller.close(); } catch {}
          }
        });
        nodeStream.on('error', (err) => {
          if (!isClosed) {
            isClosed = true;
            try { controller.error(err); } catch {}
          }
        });
      },
      cancel() {
        isClosed = true;
        nodeStream.destroy();
      }
    });

    const isDownload = url.searchParams.get('download') === '1' || url.searchParams.get('download') === 'true';
    const filename = path.basename(resolved.rawPath);

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        ...(isDownload ? { 'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"` } : {})
      }
    });
  }
};
