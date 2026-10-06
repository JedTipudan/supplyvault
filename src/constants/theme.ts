// Figma source of truth: StockWise AI — Smart Inventory Management System
// 390x844, Inter type, light BG #F8FAFC, card #FFFFFF, border #E2E8F0
// See docs/FIGMA_SPEC.md for the full resolved spec.
export const LightColors = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  divider: '#F1F5F9',
  text: '#0F172A',
  muted: '#64748B',
  placeholder: '#94A3B8',
  secondaryBg: '#F1F5F9',
  primary: '#2563EB',
  accentPink: '#EC4899',
  success: '#22C55E',
  successBg: '#DCFCE7',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  infoBg: '#EFF6FF',
  purpleBg: '#F3E8FF',
  pinkBg: '#FCE7F3',
  orangeBg: '#FFEDD5',
  orange: '#F97316',
  cameraBg: '#0B0F19',
  overlay: 'rgba(15, 23, 42, 0.25)',
  glass: 'rgba(255, 255, 255, 0.1)',
} as const;

// Dark values from Figma screens 22/23.
export const DarkColors = {
  background: '#0B1120',
  card: '#111827',
  border: '#334155',
  borderStrong: '#475569',
  divider: '#1F2937',
  text: '#F8FAFC',
  muted: '#94A3B8',
  placeholder: '#94A3B8',
  secondaryBg: 'rgba(255, 255, 255, 0.1)',
  primary: '#3B82F6',
  accentPink: '#EC4899',
  success: '#22C55E',
  successBg: '#064E3B',
  warning: '#F59E0B',
  warningBg: '#78350F',
  danger: '#EF4444',
  dangerBg: '#7F1D1D',
  infoBg: '#1E3A8A',
  purpleBg: '#4C1D95',
  pinkBg: '#831843',
  orangeBg: '#7C2D12',
  orange: '#F97316',
  cameraBg: '#0B0F19',
  overlay: 'rgba(0, 0, 0, 0.6)',
  glass: 'rgba(255, 255, 255, 0.1)',
} as const;

export type ThemeColors = typeof LightColors;
export type ThemeMode = 'light' | 'dark' | 'system';

export const Radius = { xs: 2, sm: 4, md: 8, lg: 10, xl: 12, xxl: 16, card: 16, pill: 24, round: 28, full: 999 } as const;
export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

/** Font sizes exactly as specified in the Figma type scale. */
export const FontSizes = {
  tiny9: 9,
  nav10: 10,
  micro11: 11,
  caption12: 12,
  body13: 13,
  label14: 14,
  sub15: 15,
  h3: 16,
  h2: 18,
  title20: 20,
  display22: 22,
  screen24: 24,
  splash32: 32,
} as const;

export const GradientPrimary = ['#2563EB', '#EC4899'] as const;

/**
 * Inter (Figma type family) is loaded in app/_layout.tsx from
 * @expo-google-fonts/inter. Map a numeric weight to the loaded family name so
 * every <Txt> renders in Inter with the exact Figma weight.
 */
const WEIGHT_FAMILY: Record<string, string> = {
  '100': 'Inter_100Thin',
  '200': 'Inter_200ExtraLight',
  '300': 'Inter_300Light',
  '400': 'Inter_400Regular',
  'normal': 'Inter_400Regular',
  '500': 'Inter_500Medium',
  '600': 'Inter_600SemiBold',
  '700': 'Inter_700Bold',
  'bold': 'Inter_700Bold',
  '800': 'Inter_800ExtraBold',
  '900': 'Inter_900Black',
};

export function fontFamilyFor(weight?: string | number): string {
  if (weight == null) return 'Inter_400Regular';
  return WEIGHT_FAMILY[String(weight)] ?? 'Inter_400Regular';
}

/** Box shadows resolved from the Figma effects table. */
export const Shadows = {
  none: {},
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 1,
  },
  logo: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 2,
  },
  pill: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  scan: {
    shadowColor: '#EC4899',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  fab: {
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  sheet: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 16,
    elevation: 12,
  },
} as const;
