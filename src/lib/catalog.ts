import catalogData from '../data/catalog.json';
import type { Course, Category, CatalogData } from '../types/catalog';

const data = catalogData as CatalogData;

export function getCatalog(): CatalogData {
  return data;
}

export function getAllCourses(): Course[] {
  return data.courses;
}

export function getCourseById(id: string): Course | undefined {
  return data.courses.find(c => c.id === id || c.slug === id);
}

export function getCategories(): Category[] {
  return data.categories;
}

export function getCategoryById(id: string): Category | undefined {
  return data.categories.find(c => c.id === id);
}

export function getCoursesByCategory(categoryId: string): Course[] {
  return data.courses.filter(c => c.categories.includes(categoryId));
}

export function getFeaturedCourse(): Course {
  const featured = data.courses.find(c => c.is_featured);
  return featured || data.courses[0];
}

export function getAllProviders(): string[] {
  const providers = new Set(data.courses.map(c => c.provider));
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
  if (!q) return data.courses;
  
  return data.courses.filter(course => {
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
