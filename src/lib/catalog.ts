import catalogData from '../data/catalog.json';
import type { Course, Category, CatalogData } from '../types/catalog';

function getNodeModule(name: string): any {
  if (typeof window !== 'undefined') return null;
  try {
    const req = Function('return require')();
    return req ? req(name) : null;
  } catch {
    return null;
  }
}

function loadMergedCatalog(): CatalogData {
  const baseCatalog = catalogData as CatalogData;

  // Check if we are running in Node.js server environment (SSR / API)
  if (typeof window !== 'undefined') {
    return baseCatalog;
  }

  try {
    const fs = getNodeModule('node:fs');
    const path = getNodeModule('node:path');
    const os = getNodeModule('node:os');

    if (!fs || !path) return baseCatalog;

    const primaryCatalog = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');
    const tmpCatalog = path.join(os.tmpdir(), 'catalog.json');

    const primaryOverrides = path.resolve(process.cwd(), 'src', 'data', 'manual_overrides.json');
    const tmpOverrides = path.join(os.tmpdir(), 'manual_overrides.json');

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
    const tmpCatOverrides = path.join(os.tmpdir(), 'categories_overrides.json');

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

    return {
      ...catalogToUse,
      courses: mergedCourses
    };
  } catch (e) {
    return baseCatalog;
  }
}

export function getCatalog(): CatalogData {
  return loadMergedCatalog();
}

export function getAllCourses(): Course[] {
  return getCatalog().courses;
}

export function getCourseById(id: string): Course | undefined {
  return getCatalog().courses.find(c => c.id === id || c.slug === id);
}

export function getCategories(): Category[] {
  return getCatalog().categories;
}

export function getCategoryById(id: string): Category | undefined {
  return getCatalog().categories.find(c => c.id === id);
}

export function getCoursesByCategory(categoryId: string): Course[] {
  return getCatalog().courses.filter(c => c.categories.includes(categoryId));
}

export function getFeaturedCourse(): Course {
  const catalog = getCatalog();
  const featured = catalog.courses.find(c => c.is_featured);
  return featured || catalog.courses[0];
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

