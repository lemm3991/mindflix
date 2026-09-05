// src/lib/drive.ts - Helper functions to resolve Google Drive video links and file IDs
import type { Lesson } from '../types/catalog';

/**
 * Extracts a Google Drive File ID from various link formats or raw ID.
 */
export function extractDriveId(input?: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Pattern 1: /file/d/{id}
  const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch) return fileDMatch[1];

  // Pattern 2: ?id={id} or &id={id}
  const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) return idParamMatch[1];

  // Pattern 3: drive:{id}
  const prefixMatch = trimmed.match(/^drive:([a-zA-Z0-9_-]+)$/i);
  if (prefixMatch) return prefixMatch[1];

  // Pattern 4: /folders/{id}
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];

  // Pattern 5: Raw 25-45 char alphanumeric ID typical of Google Drive
  if (/^[a-zA-Z0-9_-]{25,45}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Returns the Google Drive embedded preview URL for iframes.
 */
export function getDrivePreviewUrl(input?: string): string | null {
  const id = extractDriveId(input);
  if (!id) return null;
  return `https://drive.google.com/file/d/${id}/preview`;
}

/**
 * Returns direct download / stream link if public
 */
export function getDriveDirectStreamUrl(input?: string): string | null {
  const id = extractDriveId(input);
  if (!id) return null;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

/**
 * Checks whether a given lesson uses Google Drive as its source.
 */
export function isDriveLesson(lesson?: Lesson): boolean {
  if (!lesson) return false;
  if (lesson.drive_file_id) return true;
  if (lesson.drive_url) return true;
  if (lesson.video_url && extractDriveId(lesson.video_url)) return true;
  if (lesson.relative_path && extractDriveId(lesson.relative_path)) return true;
  return false;
}

/**
 * Resolves the Google Drive ID for a lesson if present.
 */
export function getLessonDriveId(lesson?: Lesson): string | null {
  if (!lesson) return null;
  return (
    extractDriveId(lesson.drive_file_id) ||
    extractDriveId(lesson.drive_url) ||
    extractDriveId(lesson.video_url) ||
    extractDriveId(lesson.relative_path)
  );
}
