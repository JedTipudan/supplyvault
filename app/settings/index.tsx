/**
 * Figma `20-settings` — profile summary + grouped settings rows.
 * Rows are wired to every destination the old settings screen (and the spec)
 * exposes; rows without a screen in this build explain that instead of
 * navigating nowhere.
 */
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import {
  Bell,
  Brain,
  CircleUser,
  Database,
  FileText,
  Lock,
  MapPin,
  Palette,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  User,
  Users,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuthStore } from '../../src/store/useStores';
import { Screen } from '../../src/components/Screen';
import { ScreenHeader, SettingsRow, Txt, Type } from '../../src/components/ui';
import { BottomTabBar } from '../../src/components/TabBar';

interface RowDef {
  icon: LucideIcon;
  label: string;
  href?: string;
  onUnavailable?: boolean;
}

const GROUPS: { label: string; rows: RowDef[] }[] = [
  {
    label: 'Account Settings',
    rows: [
      { icon: User, label: 'Profile Information', onUnavailable: true },
      { icon: Lock, label: 'Password & Security', onUnavailable: true },
    ],
  },
  {
    label: 'Inventory Configurations',
    rows: [
      { icon: MapPin, label: 'Storage Rooms & Locations', href: '/locations' },
      { icon: SlidersHorizontal, label: 'Minimum Threshold Rules', onUnavailable: true },
    ],
  },
  {
    label: 'Smart Features (AI)',
    rows: [
      { icon: Sparkles, label: 'AI Recognition Settings', onUnavailable: true },
      { icon: Brain, label: 'Custom Model Tuning', onUnavailable: true },
    ],
  },
  {
    label: 'System & Sync',
    rows: [
      { icon: RefreshCw, label: 'Cloud Sync Center', href: '/sync/index' },
      { icon: Database, label: 'Offline Storage Allocation', href: '/offline' },
    ],
  },
  {
    label: 'PREFERENCES',
    rows: [
      { icon: Palette, label: 'Appearance', href: '/settings/appearance' },
      { icon: Bell, label: 'Notifications', href: '/notifications' },
      { icon: Users, label: 'Team Management', href: '/team' },
      { icon: FileText, label: 'Reports', href: '/reports' },
    ],
  },
];

export default function Settings() {
  const { colors } = useTheme();
  const router = useRouter();
  const userName = useAuthStore((s) => s.userName);
  const role = useAuthStore((s) => s.role);
  const [email, setEmail] = useState('');

  // devSignIn() persists the signed-in user (incl. email) in SecureStore —
  // read it for the "email • Role" line of the profile summary.
  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync('sw_user');
        if (raw) {
          const u = JSON.parse(raw);
          if (typeof u?.email === 'string') setEmail(u.email);
        }
      } catch {
        /* no stored profile — fall back to the role line */
      }
    })();
  }, []);

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : '';
  const subLine = email ? `${email} • ${roleLabel}` : roleLabel;

  const onPressRow = (r: RowDef) => {
    if (r.href) router.push(r.href as never);
    else if (r.onUnavailable) Alert.alert(r.label, 'This setting is not available in this build yet.');
  };

  return (
    <Screen scroll bottomSpace>
      <ScreenHeader title="Settings" subtitle="Tailor SupplyVault to your workflow" />

      <View style={[styles.profile, { backgroundColor: colors.card, borderTopColor: colors.border, borderBottomColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.infoBg, borderColor: colors.border }]}>
          <CircleUser size={26} color={colors.primary} strokeWidth={2} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt style={[Type.cardTitle16, { color: colors.text }]} numberOfLines={1}>
            {userName}
          </Txt>
          <Txt style={[Type.caption12, { color: colors.muted }]} numberOfLines={1}>
            {subLine}
          </Txt>
        </View>
      </View>

      <View style={styles.groups}>
        {GROUPS.map((g) => (
          <View key={g.label} style={{ gap: 8 }}>
            <Txt style={[Type.upper12, { color: '#94A3B8' }]}>{g.label}</Txt>
            <View style={[styles.rowsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {g.rows.map((r, i) => (
                <SettingsRow
                  key={r.label}
                  icon={r.icon}
                  label={r.label}
                  first={i === 0}
                  onPress={() => onPressRow(r)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>

      <BottomTabBar active="more" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groups: { padding: 20, gap: 20 },
  rowsCard: { borderRadius: 12, borderWidth: 1 },
});
