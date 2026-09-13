// sources.ts - Motor de Classificação e Gestão das 5 Fontes de Estudo do Mindflix
import type { Course } from '../types/catalog';

export type StudySourceId = 'ailab' | 'asimov' | 'hashtag' | 'sctec' | 'outros';

export interface StudySource {
  id: StudySourceId;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  color: string;
  gradient: string;
  icon: string;
}

export const STUDY_SOURCES: StudySource[] = [
  {
    id: 'ailab',
    name: 'AI LAB',
    shortName: 'AI LAB',
    badge: 'AI LAB',
    description: 'Laboratório e trilhas avançadas de Inteligência Artificial e Agentes Autônomos.',
    color: '#00f2fe',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    icon: 'brain'
  },
  {
    id: 'asimov',
    name: 'Asimov',
    shortName: 'Asimov',
    badge: 'Asimov Academy',
    description: 'Biblioteca completa da Asimov Academy: Python, Automação, Data Science, Agentes e Soft Skills.',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    icon: 'terminal'
  },
  {
    id: 'hashtag',
    name: 'Hashtag',
    shortName: 'Hashtag',
    badge: 'Hashtag Treinamentos',
    description: 'Treinamentos Impressionadores: IA, Claude, Lovable, Supabase e automações modernas.',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    icon: 'zap'
  },
  {
    id: 'sctec',
    name: 'SCTEC',
    shortName: 'SCTEC',
    badge: 'SCTEC',
    description: 'Trilhas oficiais SCTEC: Carreira Tech, IA na Prática, Front-End, Back-End e Data Science.',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    icon: 'cpu'
  },
  {
    id: 'outros',
    name: 'Outros',
    shortName: 'Outros',
    badge: 'Outros / Especialidades',
    description: 'Cursos complementares de desenvolvimento pessoal, saúde, especialidades e no-code.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    icon: 'layers'
  }
];

export function getCourseSourceId(course: Course | undefined | null): StudySourceId {
  if (!course) return 'outros';
  
  const p = (course.provider || '').toLowerCase();
  const rel = (course.modules?.[0]?.lessons?.[0]?.relative_path || course.relative_path || '').toLowerCase();
  const slug = (course.slug || course.id || '').toLowerCase();
  const title = (course.display_title || course.raw_title || '').toLowerCase();

  // 1. AI LAB
  if (
    p.includes('ai lab') || 
    rel.startsWith('ai lab') || 
    rel.includes('/ai lab') || 
    rel.includes('\\ai lab') || 
    slug.includes('ai-lab') || 
    title === 'ai lab' || 
    title.includes('ai lab')
  ) {
    return 'ailab';
  }

  // 2. Asimov
  if (
    p.includes('asimov') || 
    rel.startsWith('asimov') || 
    rel.includes('/asimov') || 
    rel.includes('\\asimov') || 
    slug.includes('asimov')
  ) {
    return 'asimov';
  }

  // 3. Hashtag
  if (
    p.includes('hashtag') || 
    rel.includes('impressionador') || 
    slug.includes('impressionador') || 
    title.includes('impressionador') ||
    rel.startsWith('claude impressionador') ||
    rel.startsWith('inteligência artificial impressionador') ||
    rel.startsWith('lovable impressionador') ||
    rel.startsWith('supabase impressionador')
  ) {
    return 'hashtag';
  }

  // 4. SCTEC
  if (
    p.includes('sctec') || 
    rel.startsWith('sctec') || 
    rel.includes('/sctec') || 
    rel.includes('\\sctec') || 
    slug.includes('sctec') || 
    slug.startsWith('ciclo-') || 
    title.includes('sctec') || 
    title.startsWith('ciclo ')
  ) {
    return 'sctec';
  }

  // 5. Outros
  return 'outros';
}

export function getSourceById(id: string): StudySource | undefined {
  return STUDY_SOURCES.find(s => s.id === id);
}

export function filterCoursesBySource(courses: Course[], sourceId: string): Course[] {
  if (!sourceId || sourceId === 'all') return courses;
  return courses.filter(c => getCourseSourceId(c) === sourceId);
}

const ACTIVE_SOURCE_STORAGE_KEY = 'mindflix_active_source';

export function getActiveSource(): string {
  if (typeof window === 'undefined') return 'all';
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('source') || params.get('fonte');
    if (fromUrl && (fromUrl === 'all' || STUDY_SOURCES.some(s => s.id === fromUrl))) {
      return fromUrl;
    }
    const stored = localStorage.getItem(ACTIVE_SOURCE_STORAGE_KEY);
    if (stored && (stored === 'all' || STUDY_SOURCES.some(s => s.id === stored))) {
      return stored;
    }
    return 'all';
  } catch {
    return 'all';
  }
}

export function setActiveSource(sourceId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_SOURCE_STORAGE_KEY, sourceId);
    
    // Dispatch custom event for reactive UI updates across all components
    window.dispatchEvent(new CustomEvent('mindflix:source-changed', { detail: { sourceId } }));
    document.dispatchEvent(new CustomEvent('mindflix:source-changed', { detail: { sourceId } }));
  } catch (e) {
    console.warn('Failed to set active study source:', e);
  }
}
