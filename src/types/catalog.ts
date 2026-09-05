export type LessonType = 'video' | 'audio' | 'pdf' | 'article' | 'file' | 'link';

export interface LessonMaterial {
  id: string;
  title: string;
  type: string;
  relative_path: string;
}

export interface Lesson {
  id: string;
  order_index: number;
  raw_title: string;
  display_title: string;
  relative_path: string;
  type: LessonType;
  duration_seconds: number;
  duration_formatted: string;
  materials?: LessonMaterial[];
  drive_file_id?: string;
  drive_url?: string;
  video_url?: string;
}

export interface Module {
  id: string;
  order_index: number;
  raw_title: string;
  display_title: string;
  relative_path: string;
  lessons: Lesson[];
  drive_folder_id?: string;
}

export interface Course {
  id: string;
  slug: string;
  raw_title: string;
  display_title: string;
  description: string;
  provider: string;
  categories: string[];
  tags: string[];
  relative_path: string;
  modules_count: number;
  lessons_count: number;
  modules: Module[];
  is_featured?: boolean;
  drive_folder_id?: string;
  drive_folder_url?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CatalogData {
  generated_at: string;
  total_courses: number;
  total_modules: number;
  total_lessons: number;
  categories: Category[];
  courses: Course[];
}

export interface UserProgress {
  course_id: string;
  lesson_id: string;
  position_seconds: number;
  duration_seconds: number;
  percentage: number;
  completed: boolean;
  last_watched_at: string;
}

export interface UserPreferences {
  playback_speed: number;
  autoplay_next: boolean;
  auto_preview: boolean;
  auto_resume: boolean;
  remember_speed_per_course: boolean;
  parallax_enabled: boolean;
  interactive_bg_enabled: boolean;
  reduce_motion: boolean;
  theme_id?: string;
  gemini_api_key?: string;
}
