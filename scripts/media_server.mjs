// scripts/media_server.mjs - Dedicated Mindflix Local Media Server with HTTP Range & CORS
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCoursesRoot() {
  if (process.env.COURSES_ROOT) {
    const candidate = path.resolve(process.env.COURSES_ROOT.trim().replace(/^["']|["']$/g, ''));
    if (fs.existsSync(candidate)) return candidate;
  }

  const gDriveCandidate = 'G:\\Meu Drive\\Cursos\\Cursos Mindflix';
  if (fs.existsSync(gDriveCandidate)) {
    return gDriveCandidate;
  }

  return path.resolve(__dirname, '..');
}

const COURSES_ROOT = getCoursesRoot();
console.log(`[MediaServer] Root directory: "${COURSES_ROOT}"`);

function resolveSafeFilePath(root, relPath) {
  let cleanRel = relPath;
  try {
    if (cleanRel.includes('%')) cleanRel = decodeURIComponent(cleanRel);
  } catch {}

  const sanitizedRel = cleanRel.replace(/^[\/\\]+/, '').replace(/\.\.[\/\\]/g, '');
  const normalizedRel = path.normalize(sanitizedRel);
  let resolvedPath = path.resolve(root, normalizedRel);

  const isWithin = process.platform === 'win32'
    ? resolvedPath.toLowerCase().startsWith(root.toLowerCase())
    : resolvedPath.startsWith(root);

  if (!isWithin) return null;

  if (fs.existsSync(resolvedPath)) {
    return { filePath: resolvedPath, rawPath: resolvedPath };
  }

  if (process.platform === 'win32') {
    const namespaced = path.toNamespacedPath(resolvedPath);
    if (fs.existsSync(namespaced)) {
      return { filePath: namespaced, rawPath: resolvedPath };
    }
  }

  // Unicode NFC / NFD checks
  const nfc = resolvedPath.normalize('NFC');
  if (fs.existsSync(nfc)) return { filePath: nfc, rawPath: nfc };
  const nfd = resolvedPath.normalize('NFD');
  if (fs.existsSync(nfd)) return { filePath: nfd, rawPath: nfd };

  // Space vs plus
  if (resolvedPath.includes('+')) {
    const spaceVar = resolvedPath.replace(/\+/g, ' ');
    if (fs.existsSync(spaceVar)) return { filePath: spaceVar, rawPath: spaceVar };
  }

  return null;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.mp4': return 'video/mp4';
    case '.webm': return 'video/webm';
    case '.mkv': return 'video/x-matroska';
    case '.ts': return 'video/mp2t';
    case '.mp3': return 'audio/mpeg';
    case '.pdf': return 'application/pdf';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.webp': return 'image/webp';
    case '.json': return 'application/json';
    default: return 'application/octet-stream';
  }
}

function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Accept, Origin, User-Agent');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // Catalog / Health endpoint
  if (pathname === '/health' || pathname === '/api/catalog' || pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'Mindflix Media Server',
      root: COURSES_ROOT,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Stream endpoint: /api/stream?path=...
  if (pathname === '/api/stream' || pathname === '/stream') {
    const relPath = reqUrl.searchParams.get('path');
    if (!relPath) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Parâmetro "path" é obrigatório.' }));
      return;
    }

    const resolved = resolveSafeFilePath(COURSES_ROOT, relPath);
    if (!resolved) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Arquivo não encontrado na biblioteca local.',
        requestedPath: relPath
      }));
      return;
    }

    const filePath = resolved.filePath;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const contentType = getMimeType(resolved.rawPath);

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      let start;
      let end;

      if (parts[0] === '') {
        const suffix = parseInt(parts[1], 10);
        start = Math.max(0, fileSize - suffix);
        end = fileSize - 1;
      } else {
        start = parseInt(parts[0], 10);
        end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      }

      if (isNaN(start) || isNaN(end) || start >= fileSize || start > end) {
        res.writeHead(416, {
          'Content-Range': `bytes */${fileSize}`,
          'Accept-Ranges': 'bytes'
        });
        res.end();
        return;
      }

      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
      stream.on('error', (err) => {
        console.error('[Stream Error]', err.message);
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600'
      });
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', (err) => {
        console.error('[Stream Error]', err.message);
        if (!res.headersSent) res.writeHead(500);
        res.end();
      });
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint não encontrado.' }));
}

// Bind to multiple common local ports so any tunnel target (5000, 3000, 8000, 8080) immediately connects
const PORTS = [5000, 3000, 8000, 8080];
for (const port of PORTS) {
  try {
    const s = http.createServer(handleRequest);
    s.listen(port, '0.0.0.0', () => {
      console.log(`[MediaServer] Listening on http://0.0.0.0:${port}`);
    });
    s.on('error', (err) => {
      console.warn(`[MediaServer] Port ${port} not available:`, err.message);
    });
  } catch (e) {
    console.warn(`[MediaServer] Could not bind port ${port}`);
  }
}
