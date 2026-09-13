// src/lib/trilhas.ts - Sistema de Gestão de Trilhas de Formação
import trilhasData from '../data/trilhas.json';
import { getCourseById, getAllCourses } from './catalog';
import type { Course, Lesson, Module } from '../types/catalog';

export interface TrilhaItem {
  ordem: number;
  tipo: string;
  nome_trilha: string;
  course_id: string;
  course_title: string;
  cover_image: string;
  modules_count: number;
  lessons_count: number;
  total_duration_seconds: number;
  total_duration_formatted: string;
  relative_path: string;
}

export interface Trilha {
  id: string;
  title: string;
  source: string;
  provider: string;
  description: string;
  total_cursos: number;
  total_lessons_count: number;
  total_duration_seconds: number;
  total_duration_formatted: string;
  cover_image: string;
  courses: TrilhaItem[];
}

export interface TrilhaCourseWithModules {
  ordem: number;
  tipo: string;
  courseId: string;
  courseTitle: string;
  courseCover: string;
  modules: Module[];
  lessonsCount: number;
}

export interface TrilhaFlatLesson {
  lesson: Lesson;
  courseId: string;
  courseTitle: string;
  courseOrder: number;
  courseType: string;
  moduleId: string;
  moduleTitle: string;
  globalIndex: number;
}

export function getAllTrilhas(): Trilha[] {
  return (trilhasData as { trilhas: Trilha[] }).trilhas || [];
}

export function getTrilhaById(id: string): Trilha | undefined {
  const trilhas = getAllTrilhas();
  return trilhas.find(t => t.id === id);
}

export function getTrilhasBySource(source: string): Trilha[] {
  const trilhas = getAllTrilhas();
  if (!source || source === 'all') return trilhas;
  return trilhas.filter(t => t.source === source);
}

/**
 * Returns full course structure for each course in the trilha
 */
export function getTrilhaFullStructure(trilhaId: string): {
  trilha: Trilha;
  coursesWithModules: TrilhaCourseWithModules[];
  allLessons: TrilhaFlatLesson[];
} | null {
  const trilha = getTrilhaById(trilhaId);
  if (!trilha) return null;

  const coursesWithModules: TrilhaCourseWithModules[] = [];
  const allLessons: TrilhaFlatLesson[] = [];
  let globalIndex = 0;

  for (const item of trilha.courses) {
    if (!item.course_id) continue;
    const courseObj = getCourseById(item.course_id);
    if (!courseObj) continue;

    coursesWithModules.push({
      ordem: item.ordem,
      tipo: item.tipo,
      courseId: courseObj.id,
      courseTitle: courseObj.display_title,
      courseCover: courseObj.cover_image,
      modules: courseObj.modules,
      lessonsCount: courseObj.lessons_count
    });

    for (const mod of courseObj.modules) {
      for (const les of mod.lessons) {
        allLessons.push({
          lesson: les,
          courseId: courseObj.id,
          courseTitle: courseObj.display_title,
          courseOrder: item.ordem,
          courseType: item.tipo,
          moduleId: mod.id,
          moduleTitle: mod.display_title,
          globalIndex: globalIndex++
        });
      }
    }
  }

  return {
    trilha,
    coursesWithModules,
    allLessons
  };
}

/**
 * Encontra a primeira aula executável de uma trilha
 */
export function getFirstPlayableLessonInTrilha(trilhaId: string): TrilhaFlatLesson | null {
  const struct = getTrilhaFullStructure(trilhaId);
  if (!struct || struct.allLessons.length === 0) return null;

  // Prefer video playable lesson
  const firstVideo = struct.allLessons.find(item => 
    item.lesson.type === 'video' || 
    (item.lesson.relative_path && /\.(mp4|mkv|webm|mov|avi|ts)$/i.test(item.lesson.relative_path))
  );

  return firstVideo || struct.allLessons[0];
}
