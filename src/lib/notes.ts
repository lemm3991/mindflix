// lib/notes.ts - Gestão e persistência de anotações do aluno por aula

export interface NoteItem {
  lessonId: string;
  courseId: string;
  watchUrl: string;
  courseTitle: string;
  lessonTitle: string;
  moduleTitle?: string;
  content: string; // HTML com formatação e checklist
  updatedAt: string; // ISO Date String
  timestampSeconds?: number | null; // Posição do vídeo associada à anotação
  hasTimestamp?: boolean; // Se a caixinha de tempo estava selecionada/ativa
}

const STORAGE_KEY = 'mindflix_user_notes';

/**
 * Obtém todas as anotações salvas no localStorage
 */
export function getAllUserNotes(): NoteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: Record<string, NoteItem> = JSON.parse(raw);
    const list = Object.values(parsed);
    // Ordenar por data de atualização decrescente (mais recentes primeiro)
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch (e) {
    console.error('Erro ao ler anotações do localStorage:', e);
    return [];
  }
}

/**
 * Obtém a anotação específica de uma aula pelo lessonId
 */
export function getNoteForLesson(lessonId: string): NoteItem | null {
  if (typeof window === 'undefined' || !lessonId) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: Record<string, NoteItem> = JSON.parse(raw);
    return parsed[lessonId] || null;
  } catch (e) {
    console.error('Erro ao ler anotação:', e);
    return null;
  }
}

/**
 * Salva ou atualiza a anotação de uma aula
 */
export function saveNoteForLesson(note: Omit<NoteItem, 'updatedAt'>): NoteItem {
  if (typeof window === 'undefined') {
    return { ...note, updatedAt: new Date().toISOString() };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const map: Record<string, NoteItem> = raw ? JSON.parse(raw) : {};

    const updatedNote: NoteItem = {
      ...note,
      updatedAt: new Date().toISOString()
    };

    map[note.lessonId] = updatedNote;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));

    // Disparar evento para atualizar a interface em tempo real se necessário
    window.dispatchEvent(new CustomEvent('mindflix-note-saved', { detail: updatedNote }));

    return updatedNote;
  } catch (e) {
    console.error('Erro ao salvar anotação:', e);
    return { ...note, updatedAt: new Date().toISOString() };
  }
}

/**
 * Exclui a anotação de uma aula específica
 */
export function deleteNoteForLesson(lessonId: string): boolean {
  if (typeof window === 'undefined' || !lessonId) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const map: Record<string, NoteItem> = JSON.parse(raw);
    if (map[lessonId]) {
      delete map[lessonId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      window.dispatchEvent(new CustomEvent('mindflix-note-deleted', { detail: { lessonId } }));
      return true;
    }
    return false;
  } catch (e) {
    console.error('Erro ao excluir anotação:', e);
    return false;
  }
}
