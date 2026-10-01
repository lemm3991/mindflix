import type { APIRoute } from 'astro';
import { saveCourseOverride } from '../../../lib/overridesStore';
import { invalidateCatalogCache } from '../../../lib/catalog';

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

    const patch: Record<string, any> = {};
    if (display_title !== undefined) patch.display_title = display_title.trim();
    if (description !== undefined) patch.description = description.trim();
    if (provider !== undefined) patch.provider = provider.trim();
    if (categories !== undefined) patch.categories = categories;
    if (tags !== undefined) patch.tags = tags;
    if (is_hidden !== undefined) patch.is_hidden = Boolean(is_hidden);
    if (is_featured !== undefined) patch.is_featured = Boolean(is_featured);
    if (cover_image !== undefined) patch.cover_image = cover_image;

    const savedOverride = await saveCourseOverride(courseId, patch);
    invalidateCatalogCache();

    return new Response(JSON.stringify({ 
      success: true, 
      courseId, 
      override: savedOverride
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Falha ao atualizar metadados do curso.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
