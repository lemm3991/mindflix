// backgrounds.ts - Ambient Study Background Profiles & Visual Themes
export type BackgroundStyleId = 'waves' | 'aurora' | 'cyber-grid' | 'nebula';

export interface BackgroundPreset {
  id: BackgroundStyleId;
  name: string;
  tagline: string;
  description: string;
  category: string;
  previewGradient: string;
  accentColor: string;
  secondaryColor: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: 'waves',
    name: 'Ondas Topográficas',
    tagline: 'Fluidez & Interatividade',
    description: 'Fitas harmônicas de ondas com partículas em rede e deflexão tátil pelo cursor. O clássico visual dinâmico do Mindflix.',
    category: 'Dinâmico',
    previewGradient: 'radial-gradient(ellipse at 30% 20%, rgba(0, 242, 254, 0.45) 0%, rgba(79, 172, 254, 0.2) 50%, rgba(7, 9, 14, 0.95) 100%)',
    accentColor: '#00f2fe',
    secondaryColor: '#4facfe'
  },
  {
    id: 'aurora',
    name: 'Escuro Minimalista',
    tagline: 'Foco Absoluto & Estático',
    description: 'Fundo escuro sóbrio e elegante (não totalmente preto), 100% estático, sem animações, partículas, interações ou efeitos.',
    category: 'Estático',
    previewGradient: 'radial-gradient(ellipse at 50% 50%, #151a24 0%, #0d1118 65%, #080b10 100%)',
    accentColor: '#475569',
    secondaryColor: '#1e293b'
  },
  {
    id: 'cyber-grid',
    name: 'Fluxo Retilíneo',
    tagline: 'Foco Executivo & Dados',
    description: 'Estrutura sóbria de linhas retilíneas com pulsos luminosos de dados em trânsito aleatório. Disparo de surtos e pulsos quânticos no clique.',
    category: 'Minimalista & Tech',
    previewGradient: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.35) 0%, rgba(99, 102, 241, 0.18) 50%, rgba(7, 9, 14, 0.95) 100%)',
    accentColor: '#38bdf8',
    secondaryColor: '#6366f1'
  },
  {
    id: 'nebula',
    name: 'Nebulosa Cósmica',
    tagline: 'Espaço & Imersão Noturna',
    description: 'Gases interestelares profundos com estrelas cintilantes e atração gravitacional de poeira cósmica ao redor do cursor.',
    category: 'Noturno',
    previewGradient: 'radial-gradient(ellipse at 40% 40%, rgba(236, 72, 153, 0.4) 0%, rgba(147, 51, 234, 0.25) 50%, rgba(7, 9, 14, 0.95) 100%)',
    accentColor: '#ec4899',
    secondaryColor: '#8b5cf6'
  }
];

export function getBackgroundPreset(id?: string): BackgroundPreset {
  const found = BACKGROUND_PRESETS.find(b => b.id === id);
  return found || BACKGROUND_PRESETS[0];
}

export function applyBackgroundStyle(styleId: string): void {
  if (typeof document === 'undefined') return;
  const valid = BACKGROUND_PRESETS.some(b => b.id === styleId) ? styleId : 'waves';
  document.documentElement.setAttribute('data-bg-style', valid);
  window.dispatchEvent(new CustomEvent('mindflix:background-changed', {
    detail: { styleId: valid }
  }));
}
