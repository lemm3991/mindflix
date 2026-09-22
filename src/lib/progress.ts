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
  parallax_enabled: false,
  interactive_bg_enabled: true,
  reduce_motion: false,
  theme_id: 'cyan-indigo',
  background_style: 'waves',
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
  
  // 1. Find the LAST lesson index marked as completed in course order
  let lastCompletedIdx = -1;
  for (let i = flatLessons.length - 1; i >= 0; i--) {
    const item = flatLessons[i];
    const prog = allProgress[item.lesson.id];
    if (prog && prog.completed) {
      lastCompletedIdx = i;
      break;
    }
  }

  // If at least one lesson is marked completed, return the next video immediately after it
  if (lastCompletedIdx >= 0) {
    const nextIdx = lastCompletedIdx + 1;
    if (nextIdx < flatLessons.length) {
      const nextItem = flatLessons[nextIdx];
      return {
        lesson: nextItem.lesson,
        module: nextItem.module,
        isResume: true,
        watchUrl: `/watch/${course.id}/${nextItem.lesson.id}`,
        label: `Continuar: ${nextItem.lesson.display_title}`
      };
    } else {
      // All lessons are completed: default to first lesson for rewatching
      const first = flatLessons[0];
      return {
        lesson: first.lesson,
        module: first.module,
        isResume: true,
        watchUrl: `/watch/${course.id}/${first.lesson.id}`,
        label: 'Reassistir Curso'
      };
    }
  }

  // 2. If NO lesson is marked completed yet, check for an in-progress lesson
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

  // 3. Fallback to first lesson
  const first = flatLessons[0];
  return {
    lesson: first.lesson,
    module: first.module,
    isResume: false,
    watchUrl: `/watch/${course.id}/${first.lesson.id}`,
    label: 'Assistir Agora'
  };
}

// COURSE-SPECIFIC PLAYBACK SPEED
export function getCoursePlaybackSpeed(courseId: string): number {
  if (typeof window === 'undefined') return 1.0;
  const prefs = getUserPreferences();
  const defaultSpeed = typeof prefs.playback_speed === 'number'
    ? prefs.playback_speed
    : (parseFloat(prefs.playback_speed as any) || 1.0);

  if (!prefs.remember_speed_per_course) return defaultSpeed;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COURSE_SPEEDS);
    const map = raw ? JSON.parse(raw) : {};
    const courseSpeed = map[courseId];
    if (courseSpeed) {
      const parsed = parseFloat(courseSpeed);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return defaultSpeed;
  } catch {
    return defaultSpeed;
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
  
  // Rule: completed if >= 85% or manually completed
  const completed = isManualComplete || percentage >= 85;
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
      saveAllLocalProgress(existing);
    }

    if (durationSeconds > 0) {
      try {
        const raw = localStorage.getItem('mindflix_real_durations');
        const map = raw ? JSON.parse(raw) : {};
        const totalSecs = Math.round(durationSeconds);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        const hrs = Math.floor(mins / 60);
        const m = mins % 60;
        const durFormatted = hrs > 0 
          ? `${String(hrs).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
          : `${String(m).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        
        map[lessonId] = {
          duration_seconds: totalSecs,
          duration_formatted: durFormatted
        };
        localStorage.setItem('mindflix_real_durations', JSON.stringify(map));
        window.dispatchEvent(new CustomEvent('mindflix-duration-updated', { 
          detail: { lessonId, duration_seconds: totalSecs, duration_formatted: durFormatted } 
        }));
      } catch (e) {}
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

function getUserScopedKey(baseKey: string): string {
  const user = getLocalUser();
  return user ? `${baseKey}_${user.id}` : baseKey;
}

export function getAllLocalProgress(): Record<string, UserProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const key = getUserScopedKey(STORAGE_KEYS.PROGRESS);
    const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveAllLocalProgress(progressMap: Record<string, UserProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getUserScopedKey(STORAGE_KEYS.PROGRESS);
    localStorage.setItem(key, JSON.stringify(progressMap));
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressMap));
  } catch {}
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
    const key = getUserScopedKey(STORAGE_KEYS.RECENT_COURSES);
    const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.RECENT_COURSES);
    let list: string[] = raw ? JSON.parse(raw) : [];
    list = [courseId, ...list.filter(id => id !== courseId)].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(list));
    localStorage.setItem(STORAGE_KEYS.RECENT_COURSES, JSON.stringify(list));
  } catch (err) {
    console.warn(err);
  }
}

export function getRecentCourseIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getUserScopedKey(STORAGE_KEYS.RECENT_COURSES);
    const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.RECENT_COURSES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// FAVORITES / WATCHLIST
export function getFavoriteCourseIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getUserScopedKey(STORAGE_KEYS.FAVORITES);
    const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.FAVORITES);
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
  
  const key = getUserScopedKey(STORAGE_KEYS.FAVORITES);
  localStorage.setItem(key, JSON.stringify(updated));
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

function getPrefStorageKey(): string {
  return getUserScopedKey(STORAGE_KEYS.PREFERENCES);
}

function checkParallaxDefaultMigration(): void {
  if (typeof window === 'undefined') return;
  try {
    const MIGRATION_KEY = 'mindflix_parallax_disabled_v1';
    if (!localStorage.getItem(MIGRATION_KEY)) {
      const keys = [
        STORAGE_KEYS.PREFERENCES,
        `${STORAGE_KEYS.PREFERENCES}_user-lemmg0800`,
        `${STORAGE_KEYS.PREFERENCES}_user-tamydoagro`
      ];
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            parsed.parallax_enabled = false;
            localStorage.setItem(k, JSON.stringify(parsed));
          } catch {}
        }
      }
      localStorage.setItem(MIGRATION_KEY, 'true');
    }
  } catch {}
}

// PREFERENCES
export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    checkParallaxDefaultMigration();
    const key = getPrefStorageKey();
    const raw = localStorage.getItem(key) || localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export async function saveUserPreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const current = getUserPreferences();
  const updated = { ...current, ...prefs };
  const key = getPrefStorageKey();
  localStorage.setItem(key, JSON.stringify(updated));
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

export async function syncPreferencesFromSupabase(): Promise<void> {
  if (typeof window === 'undefined') return;
  const user = getLocalUser();
  if (!isSupabaseConfigured || !supabase || !user) return;

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data && !error) {
      const { user_id, created_at, updated_at, ...remotePrefs } = data;
      const key = getPrefStorageKey();
      const current = getUserPreferences();
      const merged = { ...current, ...remotePrefs };
      localStorage.setItem(key, JSON.stringify(merged));
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(merged));
    }
  } catch (err) {
    console.warn('Failed syncing remote preferences:', err);
  }
}

// SYNC ALL DATA FROM SUPABASE WITH CONFLICT RESOLUTION
export async function syncProgressFromSupabase(): Promise<void> {
  if (typeof window === 'undefined') return;
  const user = getLocalUser();
  if (!isSupabaseConfigured || !supabase || !user) return;

  try {
    // Sync preferences first
    await syncPreferencesFromSupabase();

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

// CONVENIENCE HELPERS FOR SIDEBARS & TRILHAS
export function isLessonCompleted(lessonId: string): boolean {
  if (typeof window === 'undefined') return false;
  const all = getAllLocalProgress();
  return Boolean(all[lessonId]?.completed);
}

export async function toggleLessonCompleted(lessonId: string, courseId?: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const all = getAllLocalProgress();
  const current = all[lessonId];
  const newCompleted = !current?.completed;
  const cId = courseId || current?.course_id || 'unknown';

  await saveLessonProgress(cId, lessonId, newCompleted ? 100 : 0, 100, newCompleted);

  // Dispatch global event for reactive UI update
  window.dispatchEvent(new CustomEvent('mindflix:progress-updated', {
    detail: { lessonId, courseId: cId, completed: newCompleted }
  }));

  return newCompleted;
}

export function getUserProgress(): { completed_lessons: Record<string, boolean>; lesson_positions: Record<string, number> } {
  if (typeof window === 'undefined') return { completed_lessons: {}, lesson_positions: {} };
  const all = getAllLocalProgress();
  const completed_lessons: Record<string, boolean> = {};
  const lesson_positions: Record<string, number> = {};

  for (const [id, item] of Object.entries(all)) {
    if (item.completed) {
      completed_lessons[id] = true;
    }
    if (item.position_seconds > 0) {
      lesson_positions[id] = item.position_seconds;
    }
  }

  return { completed_lessons, lesson_positions };
}

export function getRealDurationForLesson(lessonId: string): { duration_seconds: number; duration_formatted: string } | null {
  if (typeof window === 'undefined' || !lessonId) return null;
  try {
    const raw = localStorage.getItem('mindflix_real_durations');
    if (!raw) return null;
    const map = JSON.parse(raw);
    return map[lessonId] || null;
  } catch (e) {
    return null;
  }
}

