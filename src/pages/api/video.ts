import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

// Centralized courses root directory via env COURSES_ROOT or parent directory fallback
const COURSES_ROOT = path.resolve(
  process.env.COURSES_ROOT || path.join(process.cwd(), '..')
);

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const relPath = url.searchParams.get('path');

  if (!relPath) {
    return new Response(JSON.stringify({ error: 'Parâmetro "path" é obrigatório.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Resolve safe path without directory traversal
  const sanitizedRel = relPath.replace(/^[\/\\]+/, '').replace(/\.\.[\/\\]/g, '');
  const normalizedRel = path.normalize(sanitizedRel);
  const filePath = path.resolve(COURSES_ROOT, normalizedRel);

  // Security: check if file is within COURSES_ROOT (case-insensitive on Windows)
  const isWithinRoot = process.platform === 'win32'
    ? filePath.toLowerCase().startsWith(COURSES_ROOT.toLowerCase())
    : filePath.startsWith(COURSES_ROOT);

  if (!isWithinRoot) {
    return new Response(JSON.stringify({ error: 'Acesso não autorizado ao caminho solicitado.' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!fs.existsSync(filePath)) {
    return new Response(JSON.stringify({ 
      error: 'Arquivo não encontrado na biblioteca local.',
      expectedPath: relPath 
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  // Determine mime type
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'video/mp4';
  if (ext === '.webm') contentType = 'video/webm';
  else if (ext === '.mkv') contentType = 'video/x-matroska';
  else if (ext === '.mp3') contentType = 'audio/mpeg';
  else if (ext === '.pdf') contentType = 'application/pdf';

  if (range) {
    // Range: bytes=start-end
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      return new Response(null, {
        status: 416,
        headers: {
          'Content-Range': `bytes */${fileSize}`
        }
      });
    }

    const chunkSize = end - start + 1;
    const nodeStream = fs.createReadStream(filePath, { start, end });
    
    // Convert Node Readable to Web ReadableStream
    // @ts-ignore
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
      cancel() {
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
    // @ts-ignore
    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk) => controller.enqueue(chunk));
        nodeStream.on('end', () => controller.close());
        nodeStream.on('error', (err) => controller.error(err));
      },
      cancel() {
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
