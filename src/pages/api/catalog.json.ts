import type { APIRoute } from 'astro';
import { getAllCourses } from '../../lib/catalog';
import { getAllTrilhas } from '../../lib/trilhas';

let cachedData: any = null;
let lastTime = 0;

export function invalidateCatalogJsonCache(): void {
  cachedData = null;
  lastTime = 0;
}

export const GET: APIRoute = async () => {
  const now = Date.now();
  if (!cachedData || (now - lastTime) > 30000) {
    const courses = getAllCourses();
    const trilhas = getAllTrilhas();
    cachedData = {
      courses: courses.map(c => ({
        id: c.id,
        display_title: c.display_title,
        provider: c.provider,
        source: c.source,
        categories: c.categories,
        tags: c.tags,
        cover_image: c.cover_image,
        description: c.description,
        modules_count: c.modules_count,
        lessons_count: c.lessons_count,
        firstLessonId: c.modules?.[0]?.lessons?.[0]?.id || ''
      })),
      trilhas
    };
    lastTime = now;
  }

  return new Response(JSON.stringify(cachedData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=120'
    }
  });
};
