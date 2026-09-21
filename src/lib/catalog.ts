import fs from 'node:fs';
import path from 'node:path';
import catalogData from '../data/catalog.json';
import type { Course, Category, CatalogData, Lesson } from '../types/catalog';

let cachedCatalog: CatalogData | null = null;
let lastCatalogLoadTime = 0;
const CATALOG_CACHE_TTL_MS = 5000;

export function invalidateCatalogCache(): void {
  cachedCatalog = null;
  lastCatalogLoadTime = 0;
}

function loadMergedCatalog(): CatalogData {
  const baseCatalog = catalogData as CatalogData;

  // Check if we are running in browser context
  if (typeof window !== 'undefined') {
    return baseCatalog;
  }

  const now = Date.now();
  if (cachedCatalog && (now - lastCatalogLoadTime) < CATALOG_CACHE_TTL_MS) {
    return cachedCatalog;
  }

  try {

    const primaryCatalog = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');
    const tmpDir = path.resolve(process.cwd(), '.tmp');
    const tmpCatalog = path.join(tmpDir, 'catalog.json');

    const primaryOverrides = path.resolve(process.cwd(), 'src', 'data', 'manual_overrides.json');
    const tmpOverrides = path.join(tmpDir, 'manual_overrides.json');

    let catalogToUse = baseCatalog;

    // Read updated catalog.json from disk if available
    if (fs.existsSync(tmpCatalog)) {
      try {
        const tmpCatData = JSON.parse(fs.readFileSync(tmpCatalog, 'utf-8'));
        if (tmpCatData && Array.isArray(tmpCatData.courses)) {
          catalogToUse = tmpCatData;
        }
      } catch {}
    } else if (fs.existsSync(primaryCatalog)) {
      try {
        const diskCatData = JSON.parse(fs.readFileSync(primaryCatalog, 'utf-8'));
        if (diskCatData && Array.isArray(diskCatData.courses)) {
          catalogToUse = diskCatData;
        }
      } catch {}
    }

    const primaryCatOverrides = path.resolve(process.cwd(), 'src', 'data', 'categories_overrides.json');
    const tmpCatOverrides = path.join(tmpDir, 'categories_overrides.json');

    // Read categories overrides from disk if available
    let customCategories: any[] | null = null;
    if (fs.existsSync(tmpCatOverrides)) {
      try {
        const catOv = JSON.parse(fs.readFileSync(tmpCatOverrides, 'utf-8'));
        customCategories = Array.isArray(catOv) ? catOv : (catOv && Array.isArray(catOv.categories)) ? catOv.categories : null;
      } catch {}
    } else if (fs.existsSync(primaryCatOverrides)) {
      try {
        const catOv = JSON.parse(fs.readFileSync(primaryCatOverrides, 'utf-8'));
        customCategories = Array.isArray(catOv) ? catOv : (catOv && Array.isArray(catOv.categories)) ? catOv.categories : null;
      } catch {}
    }

    if (customCategories) {
      catalogToUse = {
        ...catalogToUse,
        categories: customCategories
      };
    }

    // Read manual overrides from disk
    let overrides: Record<string, any> = {};
    if (fs.existsSync(primaryOverrides)) {
      try {
        overrides = JSON.parse(fs.readFileSync(primaryOverrides, 'utf-8')) || {};
      } catch {}
    }
    if (fs.existsSync(tmpOverrides)) {
      try {
        const tmpOv = JSON.parse(fs.readFileSync(tmpOverrides, 'utf-8')) || {};
        overrides = { ...overrides, ...tmpOv };
      } catch {}
    }

    if (Object.keys(overrides).length === 0) {
      cachedCatalog = catalogToUse;
      lastCatalogLoadTime = now;
      return catalogToUse;
    }

    // Apply manual overrides to courses
    const mergedCourses = catalogToUse.courses.map((course: Course) => {
      const ov = overrides[course.id];
      if (!ov) return course;

      return {
        ...course,
        ...(ov.display_title ? { display_title: ov.display_title } : {}),
        ...(ov.description ? { description: ov.description } : {}),
        ...(ov.provider ? { provider: ov.provider } : {}),
        ...(Array.isArray(ov.categories) ? { categories: ov.categories } : {}),
        ...(Array.isArray(ov.tags) ? { tags: ov.tags } : {}),
        ...(ov.is_hidden !== undefined ? { is_hidden: Boolean(ov.is_hidden) } : {}),
        ...(ov.is_featured !== undefined ? { is_featured: Boolean(ov.is_featured) } : {}),
        ...(ov.cover_image ? { cover_image: ov.cover_image } : {})
      };
    });

    const finalResult = {
      ...catalogToUse,
      courses: mergedCourses
    };

    cachedCatalog = finalResult;
    lastCatalogLoadTime = now;
    return finalResult;
  } catch (e) {
    cachedCatalog = baseCatalog;
    lastCatalogLoadTime = now;
    return baseCatalog;
  }
}

export function getCatalog(): CatalogData {
  return loadMergedCatalog();
}

const ROOT_ORGANIZATION_PATHS = new Set([
  'ai lab',
  'asimov',
  'asimov/asimov skills',
  'asimov/cursos',
  'asimov/projetos',
  'asimov/trilhas asimov',
  'asimov skills',
  'cursos',
  'projetos',
  'trilhas asimov',
  'hashtag',
  'hashtag/soft skills',
  'soft skills',
  'sctec',
  'outros',
  'diversos'
]);

const ROOT_ORGANIZATION_TITLES = new Set([
  'ai lab',
  'asimov',
  'asimov skills',
  'cursos',
  'projetos',
  'trilhas asimov',
  'hashtag',
  'soft skills',
  'sctec',
  'outros',
  'diversos'
]);

const ROOT_ORGANIZATION_SLUGS = new Set([
  'course-ai-lab',
  'course-asimov',
  'course-asimov-skills',
  'course-cursos',
  'course-projetos',
  'course-trilhas-asimov',
  'course-hashtag',
  'course-hashtag-soft-skills',
  'course-soft-skills',
  'course-sctec',
  'course-outros',
  'course-diversos'
]);

export function isOrganizationRootFolder(course: Course | undefined | null): boolean {
  if (!course) return false;
  const rel = (course.relative_path || '').trim().toLowerCase().replace(/\\/g, '/');
  const slug = (course.slug || course.id || '').trim().toLowerCase();
  const rawTitle = (course.raw_title || '').trim().toLowerCase();
  const displayTitle = (course.display_title || '').trim().toLowerCase();

  return (
    ROOT_ORGANIZATION_PATHS.has(rel) ||
    ROOT_ORGANIZATION_SLUGS.has(slug) ||
    ROOT_ORGANIZATION_TITLES.has(rawTitle) ||
    ROOT_ORGANIZATION_TITLES.has(displayTitle)
  );
}

export function getAllCourses(): Course[] {
  return getCatalog().courses.filter(c => !isOrganizationRootFolder(c) && !c.is_hidden);
}

export function getCourseById(id: string): Course | undefined {
  return getCatalog().courses.find(c => (c.id === id || c.slug === id) && !isOrganizationRootFolder(c));
}

export function getCategories(): Category[] {
  return getCatalog().categories;
}

export function getCategoryById(id: string): Category | undefined {
  return getCatalog().categories.find(c => c.id === id);
}

export function isComecePorAqui(course: Course | undefined): boolean {
  if (!course) return false;
  if (course.is_comece_por_aqui) return true;
  const title = (course.display_title || course.raw_title || '').toLowerCase();
  const path = (course.relative_path || '').toLowerCase();
  return (
    title.startsWith('comece por aqui') ||
    title.startsWith('comece aqui') ||
    title.startsWith('01 - comece por aqui') ||
    title.startsWith('01. comece por aqui') ||
    title.startsWith('01 - comece aqui') ||
    title.startsWith('01. comece aqui') ||
    title.includes('comece por aqui') ||
    title.includes('comece aqui') ||
    path.includes('comece por aqui') ||
    path.includes('comece aqui')
  );
}

export function isProjectCourse(course: Course | undefined): boolean {
  if (!course) return false;
  const path = (course.relative_path || '').toLowerCase();
  // Never treat courses in 'outros' or 'diversos' as Asimov projects
  if (path.startsWith('outros') || path.startsWith('diversos') || course.source === 'outros' || course.source === 'diversos') {
    return false;
  }
  if (course.is_project) return true;
  const title = (course.display_title || course.raw_title || '').toLowerCase();
  return (
    path.includes('asimov/projetos') ||
    path.includes('asimov\\projetos') ||
    (path.startsWith('asimov') && title.startsWith('[projeto]')) ||
    (Array.isArray(course.categories) && course.categories.includes('projetos') && path.includes('asimov'))
  );
}

export function getCoursesByCategory(categoryId: string): Course[] {
  return getCatalog().courses.filter(c => 
    c.categories.includes(categoryId) && !isComecePorAqui(c) && !isProjectCourse(c)
  );
}

export function getFeaturedCourse(): Course {
  const catalog = getCatalog();
  const featured = catalog.courses.find(c => c.is_featured && !isComecePorAqui(c) && !isProjectCourse(c));
  return featured || catalog.courses[0];
}

export function isPlayableVideoLesson(lesson: Lesson | undefined): boolean {
  if (!lesson) return false;
  if (lesson.drive_file_id || lesson.drive_url) return true;
  if (!lesson.relative_path) return false;
  const ext = lesson.relative_path.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm', 'mkv', 'm4v', 'ts'].includes(ext) || lesson.type === 'video';
}

export function getFirstPlayableLesson(course: Course | undefined): Lesson | undefined {
  if (!course || !course.modules || course.modules.length === 0) return undefined;
  for (const mod of course.modules) {
    if (!mod.lessons) continue;
    for (const les of mod.lessons) {
      if (isPlayableVideoLesson(les)) {
        return les;
      }
    }
  }
  return course.modules[0]?.lessons?.[0];
}

export function getAllProviders(): string[] {
  const providers = new Set(getCatalog().courses.map(c => c.provider));
  return Array.from(providers).sort();
}

export function normalizeSearchText(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function searchCourses(query: string): Course[] {
  const q = normalizeSearchText(query);
  const courses = getCatalog().courses;
  if (!q) return courses;
  
  return courses.filter(course => {
    if (normalizeSearchText(course.display_title).includes(q)) return true;
    if (normalizeSearchText(course.provider).includes(q)) return true;
    if (course.tags.some(t => normalizeSearchText(t).includes(q))) return true;
    
    // Check modules and lessons
    for (const mod of course.modules) {
      if (normalizeSearchText(mod.display_title).includes(q)) return true;
      for (const lesson of mod.lessons) {
        if (normalizeSearchText(lesson.display_title).includes(q)) return true;
      }
    }
    return false;
  });
}

export {
  STUDY_SOURCES,
  getCourseSourceId,
  getSourceById,
  filterCoursesBySource,
  getActiveSource,
  setActiveSource,
  type StudySourceId,
  type StudySource
} from './sources';

