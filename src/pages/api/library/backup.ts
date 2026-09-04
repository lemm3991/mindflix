import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const OVERRIDES_PATH = path.resolve(process.cwd(), 'src', 'data', 'manual_overrides.json');
const CATALOG_PATH = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');

export const GET: APIRoute = async () => {
  try {
    const catalog = fs.existsSync(CATALOG_PATH) ? JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8')) : {};
    const overrides = fs.existsSync(OVERRIDES_PATH) ? JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf-8')) : {};

    const backupData = {
      backup_version: "1.0",
      created_at: new Date().toISOString(),
      overrides,
      catalog
    };

    return new Response(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="mindflix-catalog-backup.json"'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Falha ao exportar backup.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body || !body.overrides) {
      return new Response(JSON.stringify({ error: 'Payload de backup inválido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(body.overrides, null, 2), 'utf-8');

    if (body.catalog && body.catalog.courses) {
      fs.writeFileSync(CATALOG_PATH, JSON.stringify(body.catalog, null, 2), 'utf-8');
    }

    return new Response(JSON.stringify({ success: true, message: 'Backup restaurado com sucesso.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Erro ao restaurar backup.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
