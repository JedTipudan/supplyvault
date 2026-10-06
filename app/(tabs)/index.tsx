/**
 * Figma `03-home` (+ dark `22-dark-home`).
 * Dashboard header → stat scroll row → Quick Actions → Stock Status
 * Distribution → Recent Activity Items.
 * Pull-to-refresh + sync behaviour kept exactly as before.
 */
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, RefreshControl, ScrollView, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  AlertTriangle,
  Bell,
  CircleAlert,
  FileSpreadsheet,
  Grid3x3,
  Package,
  Plus,
  ScanBarcode,
  Sparkles,
  User,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { Badge, Dot, Donut, IconChip, IconButton, SectionTitle, Txt, Type } from '../../src/components/ui';
import { getDb } from '../../src/database/client';
import { useSyncStore } from '../../src/store/useStores';
import { pendingCount, syncNow } from '../../src/services/sync';
import { checkLowStockAndNotify } from '../../src/services/notifications';
import { calcStockStatus } from '../../src/types/inventory';

type RecentRow = {
  id: string;
  name: string;
  quantity: number;
  minimum_stock: number;
  unit: string;
  location: string;
  updated_at: string;
};

/** Spec copy used only while the inventory has no rows at all. */
const SPEC_RECENT = [
  { name: 'Dell Latitude', sub: '12 units • IT Room', status: 'in_stock' as const },
  { name: 'USB Keyboard', sub: '3 units • Storage', status: 'low_stock' as const },
  { name: 'Projector', sub: '5 units • AV Room', status: 'in_stock' as const },
];

/** Spec badge tint per stock status — light values, dark values via theme tokens. */
function badgeFor(status: string, colors: { successBg: string; warningBg: string; dangerBg: string }) {
  const map = {
    in_stock: { bg: colors.successBg, color: '#22C55E', label: 'In Stock' },
    low_stock: { bg: colors.warningBg, color: '#F59E0B', label: 'Low Stock' },
    out_of_stock: { bg: colors.dangerBg, color: '#EF4444', label: 'Out of Stock' },
  } as const;
  return map[status as keyof typeof map] ?? map.in_stock;
}

export default function Home() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const status = useSyncStore((s) => s.status);
  const pending = useSyncStore((s) => s.pendingCount);
  const [stats, setStats] = useState({ total: 0, low: 0, out: 0, categories: 0 });
  const [unread, setUnread] = useState(0);
  const [recent, setRecent] = useState<RecentRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const d = await getDb();
    const t = await d.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM items WHERE deleted_at IS NULL`);
    const l = await d.getFirstAsync<{ c: number }>(
      `SELECT COUNT(*) c FROM items WHERE deleted_at IS NULL AND quantity>0 AND quantity<=minimum_stock`,
    );
    const o = await d.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM items WHERE deleted_at IS NULL AND quantity<=0`);
    const cats = await d.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM categories`);
    const notifs = await d.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM notifications WHERE read_at IS NULL`);
    const rows = await d.getAllAsync<RecentRow>(
      `SELECT id, name, quantity, minimum_stock, unit, location, updated_at FROM items WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 3`,
    );
    setStats({ total: t?.c ?? 0, low: l?.c ?? 0, out: o?.c ?? 0, categories: cats?.c ?? 0 });
    setUnread(notifs?.c ?? 0);
    setRecent(rows ?? []);
    useSyncStore.getState().setPendingCount(await pendingCount());
    checkLowStockAndNotify().catch(() => {});
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await syncNow((s: string) => useSyncStore.getState().setStatus(s as any));
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const inStock = Math.max(0, stats.total - stats.low - stats.out);
  const healthy = stats.total > 0 ? Math.round((inStock / stats.total) * 100) : 0;
  const bellBadge = unread > 0 ? unread : pending;

  const syncColor =
    status === 'offline'
      ? colors.placeholder
      : status === 'syncing'
        ? colors.primary
        : status === 'error'
          ? colors.danger
          : pending > 0
            ? colors.warning
            : colors.success;
  const syncLabel =
    status === 'offline'
      ? 'Offline'
      : status === 'syncing'
        ? 'Syncing…'
        : status === 'error'
          ? 'Sync Error'
          : pending > 0
            ? `${pending} pending`
            : 'Synced';

  const statCards = [
    { label: 'Total Items', value: stats.total.toLocaleString(), icon: Package, tint: colors.infoBg, iconColor: colors.primary },
    { label: 'Low Stock', value: String(stats.low), icon: AlertTriangle, tint: colors.warningBg, iconColor: colors.warning },
    { label: 'Out of Stock', value: String(stats.out), icon: CircleAlert, tint: colors.dangerBg, iconColor: colors.danger },
    { label: 'Categories', value: String(stats.categories), icon: Grid3x3, tint: colors.purpleBg, iconColor: colors.primary },
  ];

  // No dedicated import screen exists — Import/Export lives in /reports.
  const quickActions = [
    { label: 'Add Item', icon: Plus, onPress: () => router.push('/item/new') },
    { label: 'Scan', icon: ScanBarcode, onPress: () => router.push('/(tabs)/scan') },
    { label: 'AI Recognize', icon: Sparkles, onPress: () => router.push('/ai/camera'), ai: true },
    { label: 'Import', icon: FileSpreadsheet, onPress: () => router.push('/reports') },
  ];

  const legend = [
    { color: colors.success, label: `In Stock (${inStock} items)` },
    { color: colors.warning, label: `Low Stock (${stats.low} items)` },
    { color: colors.danger, label: `Out of Stock (${stats.out} items)` },
  ];

  const recentCards: { key: string; name: string; sub: string; status: string }[] =
    recent.length > 0
      ? recent.map((r) => ({
          key: r.id,
          name: r.name,
          sub: `${r.quantity} ${r.unit || 'units'} • ${r.location}`,
          status: calcStockStatus(r.quantity, r.minimum_stock),
        }))
      : SPEC_RECENT.map((c, i) => ({ key: `spec-${i}`, ...c }));

  return (
    <Screen
      scroll
      bottomSpace
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* dashboard-header — padding 16 20 12 */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Txt style={[Type.bigTitle, { color: colors.text }]}>Good morning, Admin</Txt>
          <Txt style={[Type.caption12, { color: colors.muted }]}>{"Here's what's happening with your inventory."}</Txt>
          <View style={styles.syncRow}>
            <Dot color={syncColor} />
            <Txt style={[Type.stat11, { color: syncColor }]} accessibilityLabel={`Sync status ${syncLabel}`}>
              {syncLabel}
            </Txt>
          </View>
        </View>
        <View style={styles.headerActions}>
          <IconButton
            icon={Bell}
            size={40}
            iconSize={20}
            badge={bellBadge}
            accessibilityLabel="Notifications"
            onPress={() => router.push('/notifications')}
          />
          <View style={[styles.avatar, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <User size={18} color={colors.primary} strokeWidth={2} />
          </View>
        </View>
      </View>

      {/* stat-scroll-row — padding 8 20, gap 12, 100px cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statRow}
        accessibilityLabel="Inventory statistics"
      >
        {statCards.map((s) => (
          <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconChip icon={s.icon} size={32} bg={s.tint} color={s.iconColor} />
            <View style={{ gap: 2 }}>
              <Txt style={[Type.stat11, { color: colors.muted }]}>{s.label}</Txt>
              <Txt style={[Type.cardTitle16, { color: colors.text }]}>{s.value}</Txt>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Quick Actions — padding 12 20 8 */}
      <View style={styles.section}>
        <Txt style={[Type.section14, { color: colors.text }]}>Quick Actions</Txt>
        <View style={styles.quickRow}>
          {quickActions.map((a) => (
            <Pressable
              key={a.label}
              onPress={a.onPress}
              accessibilityRole="button"
              accessibilityLabel={a.label}
              style={({ pressed }) => [styles.quickItem, { opacity: pressed ? 0.75 : 1 }]}
            >
              <View
                style={[
                  styles.quickChip,
                  {
                    backgroundColor: a.ai ? (isDark ? '#4D1D3C' : colors.pinkBg) : colors.card,
                    borderColor: a.ai ? (isDark ? '#F472B6' : '#EC4899') : colors.border,
                    borderWidth: a.ai ? 1.5 : 1,
                  },
                ]}
              >
                <a.icon size={22} color={a.ai ? (isDark ? '#F472B6' : '#EC4899') : colors.text} strokeWidth={2} />
              </View>
              <Txt style={[Type.stat11, { color: colors.text, textAlign: 'center' }]}>{a.label}</Txt>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Stock Status Distribution — padding 12 20 */}
      <View style={styles.section}>
        <SectionTitle action="View Report" onAction={() => router.push('/reports')}>
          Stock Status Distribution
        </SectionTitle>
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Donut
            data={[
              { value: inStock, color: colors.success },
              { value: stats.low, color: colors.warning },
              { value: stats.out, color: colors.danger },
            ]}
            centerLabel={`${healthy}%`}
            centerSub="Healthy"
          />
          <View style={styles.legend}>
            {legend.map((l) => (
              <View key={l.label} style={styles.legendRow}>
                <Dot color={l.color} size={8} />
                <Txt style={[styles.legendText, { color: colors.muted }]}>{l.label}</Txt>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Recent Activity Items — padding 8 20 20 */}
      <View style={[styles.section, { paddingTop: 8, paddingBottom: 20 }]}>
        <Txt style={[Type.section14, { color: colors.text }]}>Recent Activity Items</Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>
          {recentCards.map((c) => {
            const badge = badgeFor(c.status, colors);
            return (
              <Pressable
                key={c.key}
                onPress={() => router.push('/(tabs)/inventory')}
                accessibilityRole="button"
                accessibilityLabel={`Recent item ${c.name}`}
                style={({ pressed }) => [
                  styles.recentCard,
                  { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <View style={[styles.recentPhoto, { backgroundColor: colors.infoBg }]}>
                  <Package size={26} color={colors.primary} strokeWidth={2} />
                </View>
                <View style={{ gap: 4 }}>
                  <Txt style={[Type.bold12, { color: colors.text }]} numberOfLines={1}>
                    {c.name}
                  </Txt>
                  <Txt style={[Type.micro11, { color: colors.muted }]} numberOfLines={1}>
                    {c.sub}
                  </Txt>
                </View>
                <Badge label={badge.label} bg={badge.bg} color={badge.color} />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { flex: 1, paddingRight: 12, gap: 4 },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 8 },
  statCard: { width: 100, padding: 12, gap: 8, borderRadius: 12, borderWidth: 1 },
  section: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 12 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quickItem: { width: 76, alignItems: 'center', gap: 6 },
  quickChip: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  chartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  legend: { flex: 1, gap: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendText: { fontSize: 12, fontWeight: '500' },
  recentRow: { flexDirection: 'row', gap: 12 },
  recentCard: { width: 140, padding: 10, gap: 8, borderRadius: 12, borderWidth: 1 },
  recentPhoto: { height: 80, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
});
