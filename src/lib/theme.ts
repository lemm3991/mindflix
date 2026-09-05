// theme.ts - Mindflix 8-Preset Harmonic Dual-Color Theme Engine
export interface ThemePreset {
  id: string;
  name: string;
  primary: string;         // HEX Primary Accent
  secondary: string;       // HEX Secondary Accent (Harmonic)
  primaryRgb: string;      // RGB for transparent overlays
  secondaryRgb: string;    // RGB for transparent overlays
  orb1: string;            // Glow Orb Top-Right
  orb2: string;            // Glow Orb Bottom-Left
  orb3: string;            // Glow Orb Center
  lineColors: Array<{ base: string; active: string }>;
  particleColors: [string, string];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cyan-indigo',
    name: 'Ciano & Indigo (Padrão)',
    primary: '#00f2fe',
    secondary: '#4facfe',
    primaryRgb: '0, 242, 254',
    secondaryRgb: '79, 172, 254',
    orb1: 'radial-gradient(circle, #00f2fe 0%, #3b82f6 70%, transparent 100%)',
    orb2: 'radial-gradient(circle, #6366f1 0%, #8b5cf6 70%, transparent 100%)',
    orb3: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
    lineColors: [
      { base: 'rgba(0, 242, 254, 0.26)', active: 'rgba(0, 242, 254, 0.95)' },
      { base: 'rgba(56, 189, 248, 0.24)', active: 'rgba(56, 189, 248, 0.90)' },
      { base: 'rgba(99, 102, 241, 0.22)', active: 'rgba(129, 140, 248, 0.88)' },
      { base: 'rgba(168, 85, 247, 0.20)', active: 'rgba(192, 132, 252, 0.85)' }
    ],
    particleColors: ['#00f2fe', '#818cf8']
  },
  {
    id: 'crimson-orange',
    name: 'Vermelho Carmim & Âmbar',
    primary: '#ff2a4b',
    secondary: '#ff7300',
    primaryRgb: '255, 42, 75',
    secondaryRgb: '255, 115, 0',
    orb1: 'radial-gradient(circle, #ff2a4b 0%, #dc2626 70%, transparent 100%)',
    orb2: 'radial-gradient(circle, #ff7300 0%, #ea580c 70%, transparent 100%)',
    orb3: 'radial-gradient(circle, #f43f5e 0%, transparent 70%)',
    lineColors: [
      { base: 'rgba(255, 42, 75, 0.28)', active: 'rgba(255, 42, 75, 0.95)' },
      { base: 'rgba(255, 99, 120, 0.24)', active: 'rgba(255, 99, 120, 0.90)' },
      { base: 'rgba(255, 115, 0, 0.22)', active: 'rgba(255, 145, 50, 0.88)' },
      { base: 'rgba(234, 88, 12, 0.20)', active: 'rgba(251, 146, 60, 0.85)' }
    ],
    particleColors: ['#ff2a4b', '#ff7300']
  },
  {
    id: 'violet-magenta',
    name: 'Violeta Cyber & Magenta',
    primary: '#a855f7',
    secondary: '#ec4899',
    primaryRgb: '168, 85, 247',
    secondaryRgb: '236, 72, 153',
    orb1: 'radial-gradient(circle, #a855f7 0%, #7c3aed 70%, transparent 100%)',
    orb2: 'radial-gradient(circle, #ec4899 0%, #db2777 70%, transparent 100%)',
    orb3: 'radial-gradient(circle, #c084fc 0%, transparent 70%)',
    lineColors: [
      { base: 'rgba(168, 85, 247, 0.28)', active: 'rgba(168, 85, 247, 0.95)' },
      { base: 'rgba(192, 132, 252, 0.24)', active: 'rgba(192, 132, 252, 0.90)' },
      { base: 'rgba(236, 72, 153, 0.22)', active: 'rgba(244, 114, 182, 0.88)' },
      { base: 'rgba(244, 63, 94, 0.20)', active: 'rgba(251, 113, 133, 0.85)' }
    ],
    particleColors: ['#a855f7', '#ec4899']
  },
  {
    id: 'emerald-mint',
    name: 'Verde Esmeralda & Menta',
    primary: '#10b981',
    secondary: '#06b6d4',
    primaryRgb: '16, 185, 129',
    secondaryRgb: '6, 182, 212',
    orb1: 'radial-gradient(circle, #10b981 0%, #059669 70%, transparent 100%)',
    orb2: 'radial-gradient(circle, #06b6d4 0%, #0891b2 70%, transparent 100%)',
    orb3: 'radial-gradient(circle, #34d399 0%, transparent 70%)',
    lineColors: [
      { base: 'rgba(16, 185, 129, 0.28)', active: 'rgba(16, 185, 129, 0.95)' },
      { base: 'rgba(52, 211, 153, 0.24)', active: 'rgba(52, 211, 153, 0.90)' },
      { base: 'rgba(6, 182, 212, 0.22)', active: 'rgba(34, 211, 238, 0.88)' },
      { base: 'rgba(20, 184, 166, 0.20)', active: 'rgba(45, 212, 191, 0.85)' }
    ],
    particleColors: ['#10b981', '#06b6d4']
  },
  {
    id: 'golden-fire',
    name: 'Âmbar Dourado & Fogo',
    primary: '#f59e0b',
    secondary: '#ef4444',
    primaryRgb: '245, 158, 11',
    secondaryRgb: '239, 68, 68',
    orb1: 'radial-gradient(circle, #f59e0b 0%, #d97706 70%, transparent 100%)',
    orb2: 'radial-gradient(circle, #ef4444 0%, #dc2626 70%, transparent 100%)',
    orb3: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)',
    lineColors: [
      { base: 'rgba(245, 158, 11, 0.28)', active: 'rgba(245, 158, 11, 0.95)' },
      { base: 'rgba(251, 191, 36, 0.24)', active: 'rgba(251, 191, 36, 0.90)' },
      { base: 'rgba(239, 68, 68, 0.22)', active: 'rgba(248, 113, 113, 0.88)' },
      { base: 'rgba(249, 115, 22, 0.20)', active: 'rgba(251, 146, 60, 0.85)' }
    ],
    particleColors: ['#f59e0b', '#ef4444']
  },
  {
    id: 'sapphire-turquoise',
    name: 'Azul Safira & Turquesa',
    primary: '#2563eb',
    secondary: '#06b6d4',
    primaryRgb: '37, 99, 235',
    secondaryRgb: '6, 182, 212',
    orb1: 'radial-gradient(circle, #2563eb 0%, #1d4ed8 70%, transparent 100%)',
    orb2: 'radial-gradient(circle, #06b6d4 0%, #0891b2 70%, transparent 100%)',
    orb3: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)',
    lineColors: [
      { base: 'rgba(37, 99, 235, 0.28)', active: 'rgba(37, 99, 235, 0.95)' },
      { base: 'rgba(96, 165, 250, 0.24)', active: 'rgba(96, 165, 250, 0.90)' },
      { base: 'rgba(6, 182, 212, 0.22)', active: 'rgba(34, 211, 238, 0.88)' },
      { base: 'rgba(14, 165, 233, 0.20)', active: 'rgba(56, 189, 248, 0.85)' }
    ],
    particleColors: ['#2563eb', '#06b6d4']
  },
  {
    id: 'cyber-rose',
    name: 'Neon Rose & Coral Sunset',
    primary: '#f43f5e',
    secondary: '#fb923c',
    primaryRgb: '244, 63, 94',
    secondaryRgb: '251, 146, 60',
    orb1: 'radial-gradient(circle, #f43f5e 0%, #e11d48 70%, transparent 100%)',
    orb2: 'radial-gradient(circle, #fb923c 0%, #f97316 70%, transparent 100%)',
    orb3: 'radial-gradient(circle, #fda4af 0%, transparent 70%)',
    lineColors: [
      { base: 'rgba(244, 63, 94, 0.28)', active: 'rgba(244, 63, 94, 0.95)' },
      { base: 'rgba(251, 113, 133, 0.24)', active: 'rgba(251, 113, 133, 0.90)' },
      { base: 'rgba(251, 146, 60, 0.22)', active: 'rgba(253, 186, 116, 0.88)' },
      { base: 'rgba(249, 115, 22, 0.20)', active: 'rgba(251, 146, 60, 0.85)' }
    ],
    particleColors: ['#f43f5e', '#fb923c']
  },
  {
    id: 'platinum-silver',
    name: 'Platina & Prata Titânio',
    primary: '#e2e8f0',
    secondary: '#38bdf8',
    primaryRgb: '226, 232, 240',
    secondaryRgb: '56, 189, 248',
    orb1: 'radial-gradient(circle, #e2e8f0 0%, #cbd5e1 70%, transparent 100%)',
    orb2: 'radial-gradient(circle, #38bdf8 0%, #0284c7 70%, transparent 100%)',
    orb3: 'radial-gradient(circle, #94a3b8 0%, transparent 70%)',
    lineColors: [
      { base: 'rgba(226, 232, 240, 0.28)', active: 'rgba(226, 232, 240, 0.95)' },
      { base: 'rgba(203, 213, 225, 0.24)', active: 'rgba(203, 213, 225, 0.90)' },
      { base: 'rgba(56, 189, 248, 0.22)', active: 'rgba(125, 211, 252, 0.88)' },
      { base: 'rgba(148, 163, 184, 0.20)', active: 'rgba(203, 213, 225, 0.85)' }
    ],
    particleColors: ['#e2e8f0', '#38bdf8']
  }
];

export function getThemePreset(themeId: string = 'cyan-indigo'): ThemePreset {
  return THEME_PRESETS.find(t => t.id === themeId) || THEME_PRESETS[0];
}

export function applyTheme(themeId: string = 'cyan-indigo'): ThemePreset {
  const theme = getThemePreset(themeId);
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.setProperty('--accent-cyan', theme.primary);
    root.style.setProperty('--accent-blue', theme.secondary);
    root.style.setProperty('--accent-primary-rgb', theme.primaryRgb);
    root.style.setProperty('--accent-secondary-rgb', theme.secondaryRgb);
    root.style.setProperty('--grad-primary', `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`);
    root.setAttribute('data-theme', theme.id);

    // Update orb background styles dynamically if orb elements exist
    const orb1 = document.querySelector('.orb-cyan') as HTMLElement | null;
    const orb2 = document.querySelector('.orb-indigo') as HTMLElement | null;
    const orb3 = document.querySelector('.orb-purple') as HTMLElement | null;
    if (orb1) orb1.style.background = theme.orb1;
    if (orb2) orb2.style.background = theme.orb2;
    if (orb3) orb3.style.background = theme.orb3;

    // Dispatch global event for interactive background & components
    window.dispatchEvent(new CustomEvent('mindflix:theme-changed', { detail: theme }));
  }
  return theme;
}
