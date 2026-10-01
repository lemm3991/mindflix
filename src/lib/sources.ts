// sources.ts - Motor de Classificação e Gestão das 5 Fontes de Estudo do Mindflix
import type { Course } from '../types/catalog';

export type StudySourceId = 'ailab' | 'asimov' | 'asimov-skills' | 'hashtag' | 'hashtag-soft-skills' | 'sctec' | 'outros';

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
    description: 'Biblioteca completa da Asimov Academy: Cursos, Projetos práticos e Trilhas de Formação.',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    icon: 'terminal'
  },
  {
    id: 'asimov-skills',
    name: 'Asimov Skills',
    shortName: 'Asimov Skills',
    badge: 'Asimov Skills',
    description: 'Cursos de soft skills, produtividade, gestão de tempo, oratória e desenvolvimento pessoal da Asimov.',
    color: '#818cf8',
    gradient: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
    icon: 'sparkles'
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
    id: 'hashtag-soft-skills',
    name: 'Hashtag Soft Skills',
    shortName: 'Soft Skills',
    badge: 'Hashtag Soft Skills',
    description: 'Formação em Soft Skills: Alta Performance, Autoconhecimento, Comunicação e Liderança da Hashtag.',
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
    icon: 'heart'
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
    name: 'Diversos',
    shortName: 'Diversos',
    badge: 'Diversos',
    description: 'Cursos complementares de desenvolvimento pessoal, saúde, especialidades e no-code.',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    icon: 'layers'
  }
];

export function getCourseSourceId(course: Course | undefined | null): StudySourceId {
  if (!course) return 'outros';
  
  const rel = (course.modules?.[0]?.lessons?.[0]?.relative_path || course.relative_path || '').toLowerCase();
  const directSrc = (course.source || '').toLowerCase();

  // 1. Hashtag Soft Skills
  if (
    directSrc === 'hashtag-soft-skills' || 
    directSrc === 'hashtag_soft_skills' || 
    rel.includes('hashtag/soft skills') || 
    rel.includes('hashtag\\soft skills')
  ) {
    return 'hashtag-soft-skills';
  }

  // 2. Asimov Skills
  if (
    directSrc === 'asimov-skills' || 
    directSrc === 'asimov_skills' || 
    rel.includes('asimov skills') || 
    rel.includes('asimov/asimov skills') || 
    rel.includes('asimov\\asimov skills')
  ) {
    return 'asimov-skills';
  }

  // Direct source property check
  if (directSrc === 'ailab' || directSrc === 'ai-lab') return 'ailab';
  if (directSrc === 'asimov') return 'asimov';
  if (directSrc === 'hashtag') return 'hashtag';
  if (directSrc === 'sctec') return 'sctec';
  if (directSrc === 'outros' || directSrc === 'diversos') return 'outros';

  const p = (course.provider || '').toLowerCase();
  const slug = (course.slug || course.id || '').toLowerCase();
  const title = (course.display_title || course.raw_title || '').toLowerCase();

  // AI LAB
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

  // Asimov Cursos & Projetos
  if (
    p.includes('asimov') || 
    rel.startsWith('asimov') || 
    rel.includes('/asimov') || 
    rel.includes('\\asimov') || 
    slug.includes('asimov')
  ) {
    return 'asimov';
  }

  // Hashtag Treinamentos Impressionadores
  if (
    p.includes('hashtag') || 
    rel.includes('hashtag') ||
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

  // 5. Diversos (outros)
  return 'outros';
}

export function normalizeSourceId(id: string): StudySourceId | 'all' {
  const clean = (id || '').toLowerCase().trim();
  if (!clean || clean === 'all' || clean === 'todas' || clean === 'todos') return 'all';
  if (clean === 'diversos' || clean === 'outros') return 'outros';
  if (clean === 'ai-lab' || clean === 'ailab') return 'ailab';
  if (clean === 'asimov') return 'asimov';
  if (clean === 'asimov-skills' || clean === 'asimov_skills') return 'asimov-skills';
  if (clean === 'hashtag') return 'hashtag';
  if (clean === 'hashtag-soft-skills' || clean === 'hashtag_soft_skills' || clean === 'soft-skills') return 'hashtag-soft-skills';
  if (clean === 'sctec') return 'sctec';
  return 'all';
}

export function getSourceById(id: string): StudySource | undefined {
  const norm = normalizeSourceId(id);
  if (norm === 'all') return undefined;
  return STUDY_SOURCES.find(s => s.id === norm);
}

export function filterCoursesBySource(courses: Course[], sourceId: string): Course[] {
  if (!sourceId || sourceId === 'all') return courses;
  return courses.filter(c => getCourseSourceId(c) === sourceId);
}

const ACTIVE_SOURCE_STORAGE_KEY = 'mindflix_active_source';

export function getActiveSource(): string {
  if (typeof window === 'undefined') return 'all';
  try {
    const path = window.location.pathname;
    const match = path.match(/^\/(?:source|fonte)\/([^\/?#]+)/);
    if (match && match[1]) {
      const norm = normalizeSourceId(match[1]);
      if (norm !== 'all') return norm;
    }
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('source') || params.get('fonte');
    if (fromUrl) {
      const norm = normalizeSourceId(fromUrl);
      if (norm !== 'all') return norm;
    }
    const stored = localStorage.getItem(ACTIVE_SOURCE_STORAGE_KEY);
    if (stored) {
      const norm = normalizeSourceId(stored);
      if (norm !== 'all') return norm;
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
