import { supabase, isSupabaseConfigured, getLocalUser } from './supabase';
import type { UserProgress, UserPreferences, Course, Lesson, Module } from '../types/catalog';

const STORAGE_KEYS = {
  PROGRESS: 'mindflix_progress',
  FAVORITES: 'mindflix_favorites',
  PREFERENCES: 'mindflix_preferences',
  RECENT_COURSES: 'mindflix_recent_courses',
  COURSE_SPEEDS: 'mindflix_course_speeds',
  PENDING_SYNC: 'mindflix_pending_sync'
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  playback_speed: 1.0,
  autoplay_next: true,
  auto_preview: false,
  auto_resume: true,
  remember_speed_per_course: false,
  parallax_enabled: true,
  interactive_bg_enabled: true,
  reduce_motion: false,
  gemini_api_key: ''
};

// HELPER: GET NEXT LESSON OR RESUME LESSON FOR COURSE
export function getNextLessonToWatch(course: Course): { lesson?: Lesson; module?: Module; isResume: boolean; watchUrl: string; label: string } {
  const defaultLesson = course.modules?.[0]?.lessons?.[0];
  const defaultRes = {
    lesson: defaultLesson,
    module: course.modules?.[0],
    isResume: false,
    watchUrl: defaultLesson ? `/watch/${course.id}/${defaultLesson.id}` : '/courses',
    label: 'Assistir Agora'
  };

  if (!course || !course.modules || course.modules.length === 0) return defaultRes;
  
  const allProgress = getAllLocalProgress();
  
  // Flatten all lessons in order
  const flatLessons: { lesson: Lesson; module: Module }[] = [];
  for (const mod of course.modules) {
    for (const les of mod.lessons) {
      flatLessons.push({ lesson: les, module: mod });
    }
  }
  
  if (flatLessons.length === 0) return defaultRes;
  
  // 1. Check if there is an in-progress lesson (partially watched, not yet completed)
  let inProgressItem: { lesson: Lesson; module: Module; lastWatched?: string } | null = null;
  for (const item of flatLessons) {
    const prog = allProgress[item.lesson.id];
    if (prog && prog.percentage > 0 && !prog.completed) {
      if (!inProgressItem || (prog.last_watched_at && (!inProgressItem.lastWatched || new Date(prog.last_watched_at) > new Date(inProgressItem.lastWatched)))) {
        inProgressItem = { lesson: item.lesson, module: item.module, lastWatched: prog.last_watched_at };
      }
    }
  }
  
  if (inProgressItem) {
    return {
      lesson: inProgressItem.lesson,
      module: inProgressItem.module,
      isResume: true,
      watchUrl: `/watch/${course.id}/${inProgressItem.lesson.id}`,
      label: `Continuar: ${inProgressItem.lesson.display_title}`
    };
  }
  
  // 2. Check the last completed lesson and pick the NEXT one
  let lastCompletedIndex = -1;
  for (let i = 0; i < flatLessons.length; i++) {
    const prog = allProgress[flatLessons[i].lesson.id];
    if (prog && prog.completed) {
      lastCompletedIndex = i;
    }
  }
  
  if (lastCompletedIndex >= 0 && lastCompletedIndex < flatLessons.length - 1) {
    const nextItem = flatLessons[lastCompletedIndex + 1];
    return {
      lesson: nextItem.lesson,
      module: nextItem.module,
      isResume: true,
      watchUrl: `/watch/${course.id}/${nextItem.lesson.id}`,
      label: `Próxima: ${nextItem.lesson.display_title}`
    };
  }
  
  // 3. If all completed or none started, start at first lesson
  const first = flatLessons[0];
  return {
    lesson: first.lesson,
    module: first.module,
    isResume: lastCompletedIndex >= 0,
    watchUrl: `/watch/${course.id}/${first.lesson.id}`,
    label: lastCompletedIndex >= 0 ? 'Reassistir Curso' : 'Assistir Agora'
  };
}

// COURSE-SPECIFIC PLAYBACK SPEED
export function getCoursePlaybackSpeed(courseId: string): number {
  if (typeof window === 'undefined') return 1.0;
  const prefs = getUserPreferences();
  if (!prefs.remember_speed_per_course) return prefs.playback_speed || 1.0;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSE_SPEEDS);
    const map = raw ? JSON.parse(raw) : {};
    return map[courseId] || prefs.playback_speed || 1.0;
  } catch {
    return prefs.playback_speed || 1.0;
  }
}

export function saveCoursePlaybackSpeed(courseId: string, speed: number): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSE_SPEEDS);
    const map = raw ? JSON.parse(raw) : {};
    map[courseId] = speed;
    localStorage.setItem(STORAGE_KEYS.COURSE_SPEEDS, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed saving course speed', err);
  }
}

// PROGRESS MANAGEMENT WITH CONCURRENCY AND TIMESTAMP PROTECTION
export async function saveLessonProgress(
  courseId: string,
  lessonId: string,
  positionSeconds: number,
  durationSeconds: number,
  isManualComplete?: boolean
): Promise<UserProgress> {
  const percentage = durationSeconds > 0 
    ? Math.min(100, Math.round((positionSeconds / durationSeconds) * 100))
    : 0;
  
  // Rule: completed if >= 90% or manually completed
  const completed = isManualComplete || percentage >= 90;
  const now = new Date().toISOString();

  const progress: UserProgress = {
    course_id: courseId,
    lesson_id: lessonId,
    position_seconds: positionSeconds,
    duration_seconds: durationSeconds,
    percentage,
    completed,
    last_watched_at: now
  };

  if (typeof window !== 'undefined') {
    // Local cache with timestamp guard (prevent regression)
    const existing = getAllLocalProgress();
    const current = existing[lessonId];

    if (!current || !current.last_watched_at || new Date(now) >= new Date(current.last_watched_at)) {
      existing[lessonId] = progress;
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(existing));
    }

    // Update recent courses list
    trackRecentCourse(courseId);

    // Save to Supabase if available
    const user = getLocalUser();
    if (isSupabaseConfigured && supabase && user) {
      try {
        const { error } = await supabase.from('user_progress').upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
          position_seconds: positionSeconds,
          duration_seconds: durationSeconds,
          percentage,
          completed,
          last_watched_at: now
        }, { onConflict: 'user_id,lesson_id' });

        if (error) throw error;
      } catch (err) {
        // Enqueue to pending sync
        enqueuePendingSync(progress);
      }
    }
  }

  return progress;
}

function enqueuePendingSync(progress: UserProgress): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
    const queue: Record<string, UserProgress> = raw ? JSON.parse(raw) : {};
    queue[progress.lesson_id] = progress;
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
  } catch {}
}

export async function flushPendingSync(): Promise<void> {
  if (typeof window === 'undefined') return;
  const user = getLocalUser();
  if (!isSupabaseConfigured || !supabase || !user) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
    if (!raw) return;
    const queue: Record<string, UserProgress> = JSON.parse(raw);
    const items = Object.values(queue);
    if (items.length === 0) return;

    for (const item of items) {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        course_id: item.course_id,
        lesson_id: item.lesson_id,
        position_seconds: item.position_seconds,
        duration_seconds: item.duration_seconds,
        percentage: item.percentage,
        completed: item.completed,
        last_watched_at: item.last_watched_at
      }, { onConflict: 'user_id,lesson_id' });
    }

    localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
  } catch (err) {
    console.warn('Could not flush pending sync queue:', err);
  }
}

export function getLessonProgress(lessonId: string): UserProgress | null {
  if (typeof window === 'undefined') return null;
  const all = getAllLocalProgress();
  return all[lessonId] || null;
}

export function getAllLocalProgress(): Record<string, UserProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getCourseCompletionStats(courseId: string, totalLessons: number): { completedCount: number; percentage: number } {
  if (typeof window === 'undefined' || totalLessons === 0) return { completedCount: 0, percentage: 0 };
  const all = getAllLocalProgress();
  const completedCount = Object.values(all).filter(p => p.course_id === courseId && p.completed).length;
  const percentage = Math.min(100, Math.round((completedCount / totalLessons) * 100));
  return { completedCount, percentage };
}

// RECENT COURSES TRACKING
export function trackRecentCourse(courseId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_COURSES);
    let list: string[] = raw ? JSON.parse(raw) : [];
    list = [courseId, ...list.filter(id => id !== courseId)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.RECENT_COURSES, JSON.stringify(list));
  } catch (err) {
    console.warn(err);
  }
}

export function getRecentCourseIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_COURSES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// FAVORITES / WATCHLIST
export function getFavoriteCourseIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function toggleFavorite(courseId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const favorites = getFavoriteCourseIds();
  const isFav = favorites.includes(courseId);
  const updated = isFav ? favorites.filter(id => id !== courseId) : [...favorites, courseId];
  
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));

  const user = getLocalUser();
  if (isSupabaseConfigured && supabase && user) {
    try {
      if (isFav) {
        await supabase.from('favorites').delete().match({ user_id: user.id, course_id: courseId });
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, course_id: courseId });
      }
    } catch (err) {
      console.warn('Could not sync favorite to Supabase:', err);
    }
  }

  return !isFav;
}

export function isCourseFavorite(courseId: string): boolean {
  if (typeof window === 'undefined') return false;
  return getFavoriteCourseIds().includes(courseId);
}

// PREFERENCES
export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export async function saveUserPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const current = getUserPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));

  const user = getLocalUser();
  if (isSupabaseConfigured && supabase && user) {
    try {
      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        ...updated,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not sync preferences to Supabase:', err);
    }
  }

  return updated;
}

// SYNC ALL DATA FROM SUPABASE WITH CONFLICT RESOLUTION
export async function syncProgressFromSupabase(): Promise<void> {
  if (typeof window === 'undefined') return;
  const user = getLocalUser();
  if (!isSupabaseConfigured || !supabase || !user) return;

  try {
    // Flush any offline changes first
    await flushPendingSync();

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error || !data) return;

    const localProgress = getAllLocalProgress();
    let updatedAny = false;

    for (const remote of data) {
      const local = localProgress[remote.lesson_id];
      // Remote only wins if local is missing, has no timestamp, or remote timestamp is strictly newer
      if (!local || !local.last_watched_at || new Date(remote.last_watched_at) > new Date(local.last_watched_at)) {
        localProgress[remote.lesson_id] = {
          course_id: remote.course_id,
          lesson_id: remote.lesson_id,
          position_seconds: Number(remote.position_seconds),
          duration_seconds: Number(remote.duration_seconds),
          percentage: Number(remote.percentage),
          completed: Boolean(remote.completed),
          last_watched_at: remote.last_watched_at
        };
        updatedAny = true;
      }
    }

    if (updatedAny) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(localProgress));
    }
  } catch (err) {
    console.warn('Failed syncing remote progress, preserving local:', err);
  }
}
