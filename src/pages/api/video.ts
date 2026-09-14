import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

// Centralized courses root directory resolution from env only
function getCoursesRoot(): string {
  if (process.env.COURSES_ROOT) {
    const candidate = path.resolve(process.env.COURSES_ROOT);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return path.resolve(process.cwd(), '..');
}

const COURSES_ROOT = getCoursesRoot();

// Helper to lookup lesson drive ID from catalog.json
let cachedCatalog: any = null;

function getDriveIdFromCatalog(relPath: string): string | null {
  try {
    if (!cachedCatalog) {
      const catalogPath = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');
      if (fs.existsSync(catalogPath)) {
        cachedCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
      }
    }
    if (!cachedCatalog || !cachedCatalog.courses) return null;

    const normTarget = relPath.replace(/\\/g, '/').toLowerCase();
    for (const course of cachedCatalog.courses) {
      for (const mod of (course.modules || [])) {
        for (const les of (mod.lessons || [])) {
          if (les.relative_path && les.relative_path.replace(/\\/g, '/').toLowerCase() === normTarget) {
            return les.drive_file_id || les.drive_url || null;
          }
        }
      }
    }
  } catch (err) {
    console.error('Catalog lookup error:', err);
  }
  return null;
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
  const driveId = url.searchParams.get('drive_id');

  // If a Google Drive ID is provided directly
  if (driveId) {
    const cleanId = driveId.replace(/^drive:/i, '').replace(/.*\/file\/d\/([a-zA-Z0-9_-]+).*/, '$1');
    return Response.redirect(`https://drive.usercontent.google.com/download?id=${cleanId}&export=download&confirm=t`, 302);
  }

  if (!relPath) {
    return new Response(JSON.stringify({ error: 'Parâmetro "path" ou "drive_id" é obrigatório.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // If relPath is a full Google Drive URL or drive:ID
  if (relPath.includes('drive.google.com') || relPath.startsWith('drive:')) {
    const cleanId = relPath.replace(/^drive:/i, '').replace(/.*\/file\/d\/([a-zA-Z0-9_-]+).*/, '$1');
    return Response.redirect(`https://drive.usercontent.google.com/download?id=${cleanId}&export=download&confirm=t`, 302);
  }

  // Check catalog for Google Drive file ID
  const driveIdFromCatalog = getDriveIdFromCatalog(relPath);
  if (driveIdFromCatalog) {
    const cleanId = driveIdFromCatalog.replace(/^drive:/i, '').replace(/.*\/file\/d\/([a-zA-Z0-9_-]+).*/, '$1');
    return Response.redirect(`https://drive.usercontent.google.com/download?id=${cleanId}&export=download&confirm=t`, 302);
  }

  const resolved = resolveSafeFilePath(COURSES_ROOT, relPath);

  if (!resolved) {
    return new Response(JSON.stringify({ 
      error: 'Arquivo não encontrado na biblioteca local.',
      expectedPath: relPath 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
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

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes'
      }
    });
  }
};
