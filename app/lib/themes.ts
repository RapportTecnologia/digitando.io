// Color schemes for user comfort

export interface Theme {
  id: string;
  name: string;
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: 'light',
    name: 'Claro',
    vars: {
      '--bg': '#f1f5f9',
      '--surface': '#ffffff',
      '--surface-2': '#e2e8f0',
      '--text': '#0f172a',
      '--text-muted': '#64748b',
      '--accent': '#2563eb',
      '--accent-soft': '#dbeafe',
      '--success': '#16a34a',
      '--error': '#dc2626',
      '--key-bg': '#ffffff',
      '--key-border': '#cbd5e1',
      '--track-bg': '#e2e8f0',
    },
  },
  {
    id: 'dark',
    name: 'Escuro',
    vars: {
      '--bg': '#0f172a',
      '--surface': '#1e293b',
      '--surface-2': '#334155',
      '--text': '#f1f5f9',
      '--text-muted': '#94a3b8',
      '--accent': '#3b82f6',
      '--accent-soft': '#1e3a5f',
      '--success': '#22c55e',
      '--error': '#ef4444',
      '--key-bg': '#1e293b',
      '--key-border': '#475569',
      '--track-bg': '#1e293b',
    },
  },
  {
    id: 'contrast',
    name: 'Alto Contraste',
    vars: {
      '--bg': '#000000',
      '--surface': '#0a0a0a',
      '--surface-2': '#1a1a1a',
      '--text': '#ffffff',
      '--text-muted': '#cccccc',
      '--accent': '#ffff00',
      '--accent-soft': '#3a3a00',
      '--success': '#00ff00',
      '--error': '#ff3b3b',
      '--key-bg': '#0a0a0a',
      '--key-border': '#ffffff',
      '--track-bg': '#0a0a0a',
    },
  },
  {
    id: 'warm',
    name: 'Quente',
    vars: {
      '--bg': '#fef3e2',
      '--surface': '#fffaf3',
      '--surface-2': '#fde4c4',
      '--text': '#4a2c12',
      '--text-muted': '#9a6b3f',
      '--accent': '#ea580c',
      '--accent-soft': '#fed7aa',
      '--success': '#ca8a04',
      '--error': '#b91c1c',
      '--key-bg': '#fffaf3',
      '--key-border': '#e7c9a3',
      '--track-bg': '#fde4c4',
    },
  },
  {
    id: 'cool',
    name: 'Frio',
    vars: {
      '--bg': '#ecfeff',
      '--surface': '#ffffff',
      '--surface-2': '#cffafe',
      '--text': '#083344',
      '--text-muted': '#0e7490',
      '--accent': '#0891b2',
      '--accent-soft': '#a5f3fc',
      '--success': '#059669',
      '--error': '#dc2626',
      '--key-bg': '#ffffff',
      '--key-border': '#a5dde6',
      '--track-bg': '#cffafe',
    },
  },
  {
    id: 'nature',
    name: 'Natureza',
    vars: {
      '--bg': '#f0fdf4',
      '--surface': '#ffffff',
      '--surface-2': '#dcfce7',
      '--text': '#14532d',
      '--text-muted': '#3f6212',
      '--accent': '#16a34a',
      '--accent-soft': '#bbf7d0',
      '--success': '#15803d',
      '--error': '#dc2626',
      '--key-bg': '#ffffff',
      '--key-border': '#a7d9b5',
      '--track-bg': '#dcfce7',
    },
  },
];

export function applyTheme(themeId: string) {
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
}
