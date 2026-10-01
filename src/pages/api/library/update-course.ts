import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { invalidateCatalogCache } from '../../../lib/catalog';

const PRIMARY_OVERRIDES_PATH = path.resolve(process.cwd(), 'src', 'data', 'manual_overrides.json');
const LOCAL_TMP_OVERRIDES_PATH = path.resolve(process.cwd(), '.tmp', 'manual_overrides.json');
const TMP_OVERRIDES_PATH = path.join(os.tmpdir(), 'manual_overrides.json');

const PRIMARY_CATALOG_PATH = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');
const LOCAL_TMP_CATALOG_PATH = path.resolve(process.cwd(), '.tmp', 'catalog.json');
const TMP_CATALOG_PATH = path.join(os.tmpdir(), 'catalog.json');

function loadJsonSafe(primaryPath: string, localTmpPath: string, osTmpPath: string): any {
  let result: any = {};
  for (const filePath of [primaryPath, localTmpPath, osTmpPath]) {
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        result = { ...result, ...data };
      } catch {}
    }
  }
  return result;
}

function saveJsonSafe(primaryPath: string, localTmpPath: string, osTmpPath: string, content: any): { success: boolean; isReadOnly: boolean } {
  const dataStr = JSON.stringify(content, null, 2);
  let isReadOnly = false;

  try {
    const primaryDir = path.dirname(primaryPath);
    if (!fs.existsSync(primaryDir)) fs.mkdirSync(primaryDir, { recursive: true });
    fs.writeFileSync(primaryPath, dataStr, 'utf-8');
  } catch (err: any) {
    isReadOnly = true;
  }

  for (const tmpPath of [localTmpPath, osTmpPath]) {
    try {
      const dir = path.dirname(tmpPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(tmpPath, dataStr, 'utf-8');
    } catch {}
  }

  return { success: true, isReadOnly };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const courseId = body.courseId || body.course_id;
    const { display_title, description, provider, categories, tags, is_hidden, is_featured, cover_image } = body;

    if (!courseId) {
      return new Response(JSON.stringify({ error: 'courseId ou course_id é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load existing overrides
    let overrides = loadJsonSafe(PRIMARY_OVERRIDES_PATH, LOCAL_TMP_OVERRIDES_PATH, TMP_OVERRIDES_PATH);

    // Save override
    overrides[courseId] = {
      ...(overrides[courseId] || {}),
      ...(display_title !== undefined ? { display_title: display_title.trim() } : {}),
      ...(description !== undefined ? { description: description.trim() } : {}),
      ...(provider !== undefined ? { provider: provider.trim() } : {}),
      ...(categories !== undefined ? { categories } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(is_hidden !== undefined ? { is_hidden: Boolean(is_hidden) } : {}),
      ...(is_featured !== undefined ? { is_featured: Boolean(is_featured) } : {}),
      ...(cover_image !== undefined ? { cover_image } : {}),
      updated_at: new Date().toISOString()
    };

    const writeRes = saveJsonSafe(PRIMARY_OVERRIDES_PATH, LOCAL_TMP_OVERRIDES_PATH, TMP_OVERRIDES_PATH, overrides);

    // Also hot-patch catalog.json if possible
    const catalog = loadJsonSafe(PRIMARY_CATALOG_PATH, LOCAL_TMP_CATALOG_PATH, TMP_CATALOG_PATH);
    if (catalog && catalog.courses) {
      const course = catalog.courses.find((c: any) => c.id === courseId);
      if (course) {
        if (display_title !== undefined) course.display_title = display_title.trim();
        if (description !== undefined) course.description = description.trim();
        if (provider !== undefined) course.provider = provider.trim();
        if (categories !== undefined) course.categories = categories;
        if (tags !== undefined) course.tags = tags;
        if (is_hidden !== undefined) course.is_hidden = Boolean(is_hidden);
        if (is_featured !== undefined) course.is_featured = Boolean(is_featured);
        if (cover_image !== undefined) course.cover_image = cover_image;
        course.classification_source = 'manual';
        saveJsonSafe(PRIMARY_CATALOG_PATH, LOCAL_TMP_CATALOG_PATH, TMP_CATALOG_PATH, catalog);
      }
    }

    invalidateCatalogCache();

    return new Response(JSON.stringify({ 
      success: true, 
      courseId, 
      overrides: overrides[courseId],
      isReadOnlyEnv: writeRes.isReadOnly
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Falha ao atualizar metadados.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
