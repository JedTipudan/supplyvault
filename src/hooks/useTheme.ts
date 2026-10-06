import { useColorScheme } from 'react-native';
import { LightColors, DarkColors } from '../constants/theme';
import { useThemeStore } from '../store/useStores';

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const system = useColorScheme();
  const effective = mode === 'system' ? (system ?? 'light') : mode;
  const colors = effective === 'dark' ? DarkColors : LightColors;
  return { mode, effective, colors, isDark: effective === 'dark' };
}
