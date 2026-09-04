import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const OVERRIDES_PATH = path.resolve(process.cwd(), 'src', 'data', 'manual_overrides.json');
const CATALOG_PATH = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');

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
    let overrides: Record<string, any> = {};
    if (fs.existsSync(OVERRIDES_PATH)) {
      try {
        overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf-8'));
      } catch {
        overrides = {};
      }
    }

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

    fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2), 'utf-8');

    // Also hot-patch catalog.json so changes reflect immediately in SSR
    if (fs.existsSync(CATALOG_PATH)) {
      try {
        const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
        const course = catalog.courses?.find((c: any) => c.id === courseId);
        if (course) {
          if (display_title) course.display_title = display_title.trim();
          if (description) course.description = description.trim();
          if (provider) course.provider = provider.trim();
          if (categories) course.categories = categories;
          if (tags) course.tags = tags;
          if (is_hidden !== undefined) course.is_hidden = Boolean(is_hidden);
          if (is_featured !== undefined) course.is_featured = Boolean(is_featured);
          if (cover_image) course.cover_image = cover_image;
          course.classification_source = 'manual';
          fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf-8');
        }
      } catch (err) {
        console.warn('Could not hot-patch catalog.json:', err);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      courseId, 
      overrides: overrides[courseId] 
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
