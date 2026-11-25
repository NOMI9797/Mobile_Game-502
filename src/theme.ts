/**
 * theme.ts
 * One place for colours, spacing and font sizes so every screen looks consistent.
 */
export const colors = {
  background: '#0B0F17', // app background
  surface: '#141A26', // panels / modals
  surfaceRaised: '#1C2433',
  table: '#0F2A2A', // the play area
  tableEdge: '#1D4B48',
  border: '#2A3446',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  accent: '#2DD4BF', // teal – main action colour, "your turn"
  accentDark: '#0F766E',
  warning: '#F59E0B', // amber – penalties
  danger: '#F43F5E', // red – errors, elimination
  success: '#22C55E',
  cardFace: '#F8F5EE',
  cardBack: '#334155',
  suitRed: '#E11D48',
  suitBlack: '#111827',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { sm: 8, md: 12, lg: 20, pill: 999 };

export const font = { small: 12, body: 15, title: 20, heading: 28, hero: 44 };

export const BOT_NAMES = ['Nova', 'Rex', 'Luna', 'Milo', 'Zara'];
