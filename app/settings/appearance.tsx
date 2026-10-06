/**
 * Figma `21-appearance` — back header + "Select Theme" with three preview
 * cards (light / dark / system). Theme-store wiring is unchanged.
 */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useThemeStore } from '../../src/store/useStores';
import type { ThemeMode } from '../../src/constants/theme';
import { Screen } from '../../src/components/Screen';
import { Txt, Type } from '../../src/components/ui';
import { BottomTabBar } from '../../src/components/TabBar';

const THEME_CARDS: { mode: ThemeMode; title: string; sub: string }[] = [
  { mode: 'light', title: 'Light Mode', sub: 'Crisp look for bright environments' },
  { mode: 'dark', title: 'Dark Mode', sub: 'Optimized for low light work' },
  { mode: 'system', title: 'System Default', sub: 'Matches your OS appearance' },
];

/* Mini previews (48x60, padding 6, gap 4) resolved from the spec. */
function MiniPreview({ variant }: { variant: ThemeMode }) {
  if (variant === 'system') {
    return (
      <View style={[styles.preview, styles.split]}>
        <View style={[styles.splitHalf, { backgroundColor: '#F8FAFC' }]}>
          <View style={{ width: 10, height: 4, borderRadius: 2, backgroundColor: '#2563EB' }} />
          <View style={{ width: 16, height: 12, borderRadius: 4, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' }} />
        </View>
        <View style={[styles.splitHalf, { backgroundColor: '#0B1120' }]}>
          <View style={{ width: 10, height: 4, borderRadius: 2, backgroundColor: '#3B82F6' }} />
          <View style={{ width: 16, height: 12, borderRadius: 4, backgroundColor: '#111827', borderWidth: 1, borderColor: '#334155' }} />
        </View>
      </View>
    );
  }
  const dark = variant === 'dark';
  return (
    <View
      style={[
        styles.preview,
        {
          backgroundColor: dark ? '#0B1120' : '#F8FAFC',
          borderColor: dark ? '#334155' : '#E2E8F0',
        },
      ]}
    >
      <View style={{ width: 20, height: 4, borderRadius: 2, backgroundColor: dark ? '#3B82F6' : '#2563EB' }} />
      <View
        style={{
          width: 36,
          height: 12,
          borderRadius: 4,
          backgroundColor: dark ? '#111827' : '#FFFFFF',
          borderWidth: 1,
          borderColor: dark ? '#334155' : '#E2E8F0',
        }}
      />
      <View
        style={{
          width: 36,
          height: 12,
          borderRadius: 4,
          backgroundColor: dark ? '#111827' : '#FFFFFF',
          borderWidth: 1,
          borderColor: dark ? '#334155' : '#E2E8F0',
        }}
      />
    </View>
  );
}

export default function Appearance() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Screen scroll bottomSpace>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={10}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.2} />
        </Pressable>
        <Txt style={[Type.bigTitle, { color: colors.text }]}>Appearance</Txt>
      </View>

      <View style={styles.container}>
        <Txt style={[Type.upper14, { color: colors.muted }]}>Select Theme</Txt>

        {THEME_CARDS.map((card) => {
          const selected = mode === card.mode;
          return (
            <Pressable
              key={card.mode}
              onPress={() => setMode(card.mode)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${card.title}. ${card.sub}`}
              style={({ pressed }) => [
                styles.themeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: selected ? colors.primary : colors.border,
                  borderWidth: selected ? 2 : 1,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <View style={styles.leftBlock}>
                <MiniPreview variant={card.mode} />
                <View style={{ gap: 4 }}>
                  <Txt style={[Type.cardTitle16b, { color: colors.text }]}>{card.title}</Txt>
                  <Txt style={[Type.caption12, { color: colors.muted }]}>{card.sub}</Txt>
                </View>
              </View>
              {selected ? (
                <CheckCircle size={24} color={colors.primary} strokeWidth={2} />
              ) : (
                <View style={[styles.radio, { borderColor: colors.border }]} />
              )}
            </Pressable>
          );
        })}
      </View>

      <BottomTabBar active="more" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  container: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, gap: 16 },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  leftBlock: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  preview: {
    width: 48,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    padding: 6,
    gap: 4,
    overflow: 'hidden',
  },
  split: { flexDirection: 'row', padding: 0, gap: 0, borderColor: '#E2E8F0', backgroundColor: 'transparent' },
  splitHalf: { width: 24, height: 60, padding: 6, gap: 4, alignItems: 'flex-start' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2 },
});
