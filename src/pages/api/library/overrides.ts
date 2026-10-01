import type { APIRoute } from 'astro';
import { getCourseOverridesAsync, getCategoryOverridesAsync } from '../../../lib/overridesStore';
import { getCategories } from '../../../lib/catalog';

export const GET: APIRoute = async () => {
  try {
    const courseOverrides = await getCourseOverridesAsync();
    const fallbackCategories = getCategories();
    const categoryOverrides = await getCategoryOverridesAsync(fallbackCategories);

    return new Response(JSON.stringify({
      courses: courseOverrides,
      categories: categoryOverrides,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Erro ao carregar overrides.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
