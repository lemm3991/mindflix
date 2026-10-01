import type { APIRoute } from 'astro';
import { getAllCourses } from '../../../lib/catalog';

let cachedSearchIndex: any[] | null = null;
let lastBuildTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function getSearchIndex() {
  const now = Date.now();
  if (cachedSearchIndex && (now - lastBuildTime) < CACHE_TTL) {
    return cachedSearchIndex;
  }

  const allCourses = getAllCourses();
  const normStr = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const index: any[] = [];

  allCourses.forEach(c => {
    const firstLessonId = c.modules[0]?.lessons[0]?.id;
    const courseSub = `${c.provider} • ${c.lessons_count} aulas`;
    
    // Course entry
    index.push({
      type: 'course',
      title: c.display_title,
      subtitle: courseSub,
      normTitle: normStr(c.display_title),
      normSubtitle: normStr(courseSub),
      url: '#',
      courseId: c.id,
      category: 'Cursos',
      icon: 'book'
    });

    // Modules entry
    c.modules.forEach(m => {
      const modFirstLessonId = m.lessons[0]?.id || firstLessonId;
      const modSub = `Módulo em: ${c.display_title}`;
      index.push({
        type: 'module',
        title: m.display_title,
        subtitle: modSub,
        normTitle: normStr(m.display_title),
        normSubtitle: normStr(modSub),
        url: modFirstLessonId ? `/watch/${c.id}/${modFirstLessonId}` : `/courses`,
        courseId: c.id,
        category: 'Módulos',
        icon: 'folder'
      });

      // Lessons entry
      m.lessons.forEach(l => {
        const lesSub = `Aula em: ${c.display_title} • ${m.display_title}`;
        index.push({
          type: 'lesson',
          title: l.display_title,
          subtitle: lesSub,
          normTitle: normStr(l.display_title),
          normSubtitle: normStr(lesSub),
          url: `/watch/${c.id}/${l.id}`,
          courseId: c.id,
          category: 'Aulas',
          icon: 'play'
        });
      });
    });
  });

  cachedSearchIndex = index;
  lastBuildTime = now;
  return index;
}

export const GET: APIRoute = async () => {
  const index = getSearchIndex();
  return new Response(JSON.stringify(index), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600'
    }
  });
};
