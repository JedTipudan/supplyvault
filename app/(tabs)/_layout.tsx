import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { CenterScanButton, tabIcon, useTabBarStyle } from '../../src/components/TabBar';
import { House, PackageOpen, History, MoreHorizontal } from 'lucide-react-native';

/** Minimal React Navigation bottom-tab bar props (custom tabBar implementation). */
type BarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: Record<string, any>; navigation: { navigate: (name: string) => void } }>;
  navigation: { navigate: (name: string) => void };
};

/**
 * Bottom navigation exactly as specified in docs/FIGMA_SPEC.md:
 * full-bleed surface + top border, row height 64 / padding 0 12,
 * tab items width 60 (icon 20, label 600/10), center Scan raised -18.
 * Floats above the system navigation bar via safe-area insets.
 */
function SpecTabBar({ state, descriptors, navigation }: BarProps) {
  const { colors } = useTheme();
  const style = useTabBarStyle();
  const activeRoute = state.routes[state.index];
  const activeOptions = descriptors[activeRoute.key]?.options ?? {};

  // Screens that hide the bar entirely (full-bleed camera scanners).
  if (activeOptions.tabBarStyle?.display === 'none') return null;

  const item = (route: { key: string; name: string }, fallbackLabel: string, FallbackIcon: React.ComponentType<any>) => {
    const d = descriptors[route.key];
    const opts = d?.options ?? {};
    const focused = state.routes[state.index].key === route.key;
    const color = focused ? colors.primary : colors.muted;
    const label: string = opts.tabBarLabel ?? opts.title ?? fallbackLabel;
    const Icon = opts.tabBarIcon ? undefined : FallbackIcon;
    return (
      <Pressable
        key={route.key}
        onPress={() => d?.navigation.navigate(route.name)}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={label}
        style={{ width: 60, alignItems: 'center', gap: 4 }}
      >
        {opts.tabBarIcon ? opts.tabBarIcon({ color, size: 20, focused }) : Icon ? <Icon size={20} color={color} strokeWidth={2} /> : null}
        <Text style={{ fontSize: 10, fontWeight: '600', color, textAlign: 'center', fontFamily: 'Inter_600SemiBold' }}>{label}</Text>
      </Pressable>
    );
  };

  const scanRoute = state.routes.find((r) => r.name === 'scan');
  const tabRoutes = state.routes.filter((r) => r.name !== 'scan');

  return (
    <View style={style} accessibilityRole="tablist">
      <View style={{ height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 }}>
        {tabRoutes.map((r) => item(r, r.name, House))}
      </View>
      {scanRoute ? (
        <View style={{ position: 'absolute', left: 0, right: 0, top: -18, alignItems: 'center' }} pointerEvents="box-none">
          <CenterScanButton onPress={() => navigation.navigate('scan')} />
        </View>
      ) : null}
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        // Tab scenes share the app background so a transition never flashes white.
        sceneStyle: { backgroundColor: colors.background },
      }}
      tabBar={(props) => <SpecTabBar {...(props as unknown as BarProps)} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="inventory" options={{ title: 'Inventory', tabBarIcon: tabIcon(PackageOpen) }} />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          // Full-bleed scanner — no bottom nav on this screen (Figma 10/11).
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: tabIcon(History) }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: tabIcon(MoreHorizontal) }} />
    </Tabs>
  );
}
