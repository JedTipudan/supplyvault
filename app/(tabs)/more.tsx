/**
 * "More" menu hub — styled exactly like Figma `20-settings` group rows:
 * group label (700/12 UPPER #94A3B8) over a rows-card (radius 12, card,
 * border) whose first row carries the divider.
 */
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  CloudOff,
  FileSpreadsheet,
  GitCompare,
  Grid3x3,
  History,
  LogOut,
  MapPin,
  Palette,
  PieChart,
  RefreshCw,
  Settings as SettingsIcon,
  Sparkles,
  Users,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader, SettingsRow, Txt, Type } from '../../src/components/ui';
import { useAuthStore } from '../../src/store/useStores';
import { signOut } from '../../src/services/auth';

type Row = { label: string; icon: React.ComponentType<any>; href: string };
type Group = { title: string; rows: Row[] };

const GROUPS: Group[] = [
  {
    title: 'STAY UPDATED',
    rows: [
      { label: 'Notifications', icon: Bell, href: '/notifications' },
      { label: 'Activity Log', icon: History, href: '/(tabs)/activity' },
    ],
  },
  {
    title: 'DATA & SYNC',
    rows: [
      { label: 'Sync Center', icon: RefreshCw, href: '/sync/index' },
      { label: 'Offline Mode', icon: CloudOff, href: '/offline' },
      { label: 'Conflicts', icon: GitCompare, href: '/sync/conflicts' },
      { label: 'Import/Export', icon: FileSpreadsheet, href: '/reports' },
    ],
  },
  {
    title: 'INSIGHTS',
    rows: [
      { label: 'Reports', icon: PieChart, href: '/reports' },
      { label: 'Categories', icon: Grid3x3, href: '/categories' },
      { label: 'Locations', icon: MapPin, href: '/locations' },
    ],
  },
  {
    title: 'SMART FEATURES (AI)',
    rows: [{ label: 'AI Camera', icon: Sparkles, href: '/ai/camera' }],
  },
  {
    title: 'ADMIN',
    rows: [
      { label: 'Team Management', icon: Users, href: '/team' },
      { label: 'Settings', icon: SettingsIcon, href: '/settings/index' },
      { label: 'Appearance', icon: Palette, href: '/settings/appearance' },
    ],
  },
];

export default function More() {
  const { colors } = useTheme();
  const router = useRouter();

  const logout = async () => {
    await signOut();
    useAuthStore.getState().signOut();
    router.replace('/(auth)/login');
  };

  return (
    <Screen scroll bottomSpace>
      <ScreenHeader title="More" subtitle="Manage your account, data and app preferences" />
      <View style={styles.groups}>
        {GROUPS.map((g) => (
          <View key={g.title} style={{ gap: 8 }}>
            <Txt style={[Type.upper12, { color: colors.placeholder }]}>{g.title}</Txt>
            <View style={[styles.rowsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {g.rows.map((r, i) => (
                <SettingsRow
                  key={r.label}
                  icon={r.icon}
                  label={r.label}
                  first={i === 0}
                  onPress={() => router.push(r.href as never)}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={[styles.rowsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pressable
            onPress={logout}
            accessibilityRole="button"
            accessibilityLabel="Logout"
            style={({ pressed }) => [styles.logoutRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={styles.rowLeft}>
              <LogOut size={18} color={colors.danger} strokeWidth={2} />
              <Txt style={[Type.label14, { color: colors.danger }]}>Logout</Txt>
            </View>
            <ChevronRight size={16} color={colors.muted} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  groups: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 8, gap: 20 },
  rowsCard: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  logoutRow: { flexDirection: 'row', padding: 14, justifyContent: 'space-between', alignItems: 'center' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
