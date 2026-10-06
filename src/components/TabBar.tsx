/**
 * Bottom navigation — resolved from docs/FIGMA_SPEC.md "Bottom Navigation":
 *  - container: full-bleed, surface fill, top border 1px
 *  - tabs-row: height 64, padding 0/12, space-between
 *  - tab item: width 60, column, gap 4, icon 20, label 600/10
 *  - center Scan: absolute (167, -18), 56x56, radius 28,
 *    gradient 135deg #2563EB→#EC4899, shadow 0 4 12 rgba(236,72,153,.25),
 *    icon scan-face 24 white
 * The bar floats above the phone's system navigation bar using safe-area
 * insets, so the Redmi's gesture pill / buttons never cover it.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, PackageOpen, History, MoreHorizontal, ScanFace } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { Shadows } from '../constants/theme';

export const TAB_BAR_HEIGHT = 64;

/** Bottom inset shared by the bar and screen content padding. */
export function tabBarBottom(insets: { bottom: number }): number {
  return Math.max(insets.bottom, 8);
}

/**
 * Distance from the screen bottom to a point [gap]px above the tab bar's top
 * edge. Use for FABs / floating elements so they clear the bar on any device
 * (bar height = 64 + the phone's system-navigation inset).
 */
export function useTabBarTopOffset(gap = 16): number {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + tabBarBottom(insets) + gap;
}

/** Tab bar geometry for React Navigation's tabBarStyle. */
export function useTabBarStyle() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = tabBarBottom(insets);
  return {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    height: TAB_BAR_HEIGHT + bottom,
    paddingBottom: bottom,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderWidth: 0,
    borderRadius: 0,
    paddingTop: 0,
    paddingHorizontal: 0,
    elevation: isDark ? 4 : 8,
    shadowColor: '#0F172A',
    shadowOpacity: isDark ? 0.4 : 0.06,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 12,
  };
}

type TabKey = 'home' | 'inventory' | 'activity' | 'more';

const TABS: { key: TabKey; label: string; path: string; Icon: React.ComponentType<any> }[] = [
  { key: 'home', label: 'Home', path: '/(tabs)', Icon: House },
  { key: 'inventory', label: 'Inventory', path: '/(tabs)/inventory', Icon: PackageOpen },
  { key: 'activity', label: 'Activity', path: '/(tabs)/activity', Icon: History },
  { key: 'more', label: 'More', path: '/(tabs)/more', Icon: MoreHorizontal },
];

/** Which tab should read as active for a given route path. */
export function activeTabFor(pathname: string): TabKey {
  const p = pathname.toLowerCase();
  if (p.startsWith('/(tabs)/inventory') || p.startsWith('/item') || p.startsWith('/categories') || p.startsWith('/locations') || p.startsWith('/scan/result') || p.startsWith('/ai/result') || p.startsWith('/ai/upload')) return 'inventory';
  if (p.startsWith('/(tabs)/activity') || p.startsWith('/activity')) return 'activity';
  if (
    p.startsWith('/(tabs)/more') ||
    p.startsWith('/settings') ||
    p.startsWith('/sync') ||
    p.startsWith('/reports') ||
    p.startsWith('/notifications') ||
    p.startsWith('/team') ||
    p.startsWith('/offline') ||
    p.startsWith('/status')
  )
    return 'more';
  return 'home';
}

/** Raised center Scan button (out of flow, y = -18 relative to the row). */
export function CenterScanButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Scan"
      accessibilityRole="button"
      style={({ pressed }) => [styles.centerWrap, { opacity: pressed ? 0.9 : 1 }]}
    >
      <LinearGradient
        colors={['#2563EB', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centerBtn}
      >
        <ScanFace size={24} color="#FFFFFF" strokeWidth={2} />
      </LinearGradient>
    </Pressable>
  );
}

/** Tab icon renderer for the expo-router Tabs navigator. */
export function tabIcon(Icon: React.ComponentType<any>) {
  const RenderTabIcon = ({ color, size }: { color: import('react-native').ColorValue; size: number }) => (
    <Icon size={size} color={color as string} strokeWidth={2} />
  );
  RenderTabIcon.displayName = 'TabIcon';
  return RenderTabIcon;
}

/**
 * Static bottom bar for Stack screens (the Figma design shows bottom-nav on
 * almost every screen). Place it as the last child of a Screen; it positions
 * itself absolutely above the system navigation bar.
 */
export function BottomTabBar({ active }: { active?: TabKey }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const current = active ?? activeTabFor(pathname);
  const bottom = tabBarBottom(insets);

  const go = (path: string) => {
    if (pathname !== path) router.replace(path as never);
  };

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.card, borderTopColor: colors.border, height: TAB_BAR_HEIGHT + bottom, paddingBottom: bottom },
      ]}
      accessibilityRole="tablist"
    >
      <View style={styles.row}>
        {TABS.map((t) => {
          const isActive = current === t.key;
          const color = isActive ? colors.primary : colors.muted;
          return (
            <Pressable
              key={t.key}
              onPress={() => go(t.path)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={t.label}
              style={styles.item}
            >
              <t.Icon size={20} color={color} strokeWidth={2} />
              <Text style={[styles.label, { color, fontFamily: 'Inter_600SemiBold' }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.centerSlot} pointerEvents="box-none">
        <CenterScanButton onPress={() => go('/(tabs)/scan')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    ...Shadows.pill,
  },
  row: {
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  item: { width: 60, alignItems: 'center', gap: 4 },
  label: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  centerSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -18,
    alignItems: 'center',
  },
  centerWrap: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  centerBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.scan,
  },
});
