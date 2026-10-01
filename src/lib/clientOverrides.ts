// clientOverrides.ts - Client-side reactivity and persistence for course & category overrides

export const STORAGE_KEYS = {
  COURSE_OVERRIDES: 'mindflix_manual_overrides',
  CATEGORY_OVERRIDES: 'mindflix_categories_overrides'
};

export function getLocalCourseOverrides(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSE_OVERRIDES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLocalCourseOverride(courseId: string, patch: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalCourseOverrides();
    current[courseId] = {
      ...(current[courseId] || {}),
      ...patch,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.COURSE_OVERRIDES, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('mindflix:overrides-updated', { detail: { courseId, patch } }));
  } catch (e) {
    console.warn('Error saving local course override:', e);
  }
}

export function getLocalCategoryOverrides(): any[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORY_OVERRIDES);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalCategoryOverrides(categories: any[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORY_OVERRIDES, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('mindflix:categories-updated', { detail: { categories } }));
  } catch (e) {
    console.warn('Error saving local category overrides:', e);
  }
}

export async function syncOverridesFromServer(): Promise<{ courses: Record<string, any>; categories: any[] }> {
  try {
    const res = await fetch('/api/library/overrides', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    if (data && data.courses && typeof window !== 'undefined') {
      const local = getLocalCourseOverrides();
      const merged = { ...local, ...data.courses };
      localStorage.setItem(STORAGE_KEYS.COURSE_OVERRIDES, JSON.stringify(merged));
    }

    if (data && Array.isArray(data.categories) && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CATEGORY_OVERRIDES, JSON.stringify(data.categories));
    }

    return {
      courses: data.courses || {},
      categories: data.categories || []
    };
  } catch (e) {
    return {
      courses: getLocalCourseOverrides(),
      categories: getLocalCategoryOverrides() || []
    };
  }
}
