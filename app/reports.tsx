/**
 * Figma `18-reports` — seven report rows that generate & download analytics.
 * Every row is wired to the export machinery (CSV + JSON share) that the
 * original screen used for its "Export JSON" action.
 */
import React, { useState } from 'react';
import { Alert, Pressable, Share, StyleSheet, View } from 'react-native';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  CircleAlert,
  Grid3x3,
  MapPin,
  PieChart,
  Users,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getDb } from '../src/database/client';
import { listItems } from '../src/services/inventory';
import { Screen } from '../src/components/Screen';
import { IconChip, ScreenHeader, Txt, Type } from '../src/components/ui';
import { BottomTabBar } from '../src/components/TabBar';

type ReportId = 'summary' | 'movement' | 'low' | 'out' | 'byCategory' | 'byLocation' | 'audit';

interface ReportDef {
  id: ReportId;
  title: string;
  sub: string;
  tint: string;
  color: string;
  icon: LucideIcon;
}

/* Copy + tints verbatim from docs/FIGMA_SPEC.md `18-reports`. */
const REPORTS: ReportDef[] = [
  { id: 'summary', title: 'Inventory Summary', sub: 'Overview of valuation, quantities & categories', tint: '#EFF6FF', color: '#2563EB', icon: PieChart },
  { id: 'movement', title: 'Stock Movement', sub: 'Track items checked-in, checked-out & moved', tint: '#F3E8FF', color: '#EC4899', icon: ArrowUpRight },
  { id: 'low', title: 'Low Stock Analysis', sub: 'Detailed listing of items near minimum limits', tint: '#FEF3C7', color: '#F59E0B', icon: AlertTriangle },
  { id: 'out', title: 'Out of Stock Log', sub: 'Urgent view of depleted items requiring reorder', tint: '#FEE2E2', color: '#EF4444', icon: CircleAlert },
  { id: 'byCategory', title: 'Category Report', sub: 'Distribution and health of assets per category', tint: '#FCE7F3', color: '#EC4899', icon: Grid3x3 },
  { id: 'byLocation', title: 'Location Report', sub: 'Asset allocations across various physical rooms', tint: '#FFEDD5', color: '#F97316', icon: MapPin },
  { id: 'audit', title: 'User Activity Audit', sub: 'Complete timeline breakdown per team member', tint: '#DCFCE7', color: '#22C55E', icon: Users },
];

type Row = Record<string, string | number>;

/* ------------------------------------------------------------------ */
/* Report datasets (real data from the local database)                 */
/* ------------------------------------------------------------------ */

const ITEM_COLUMNS = 'name, sku, category, location, quantity, minimum_stock, unit, price';

async function buildRows(id: ReportId): Promise<Row[]> {
  const d = await getDb();
  switch (id) {
    case 'summary': {
      const t = await d.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM items WHERE deleted_at IS NULL`);
      const low = await d.getFirstAsync<{ c: number }>(
        `SELECT COUNT(*) c FROM items WHERE deleted_at IS NULL AND quantity>0 AND quantity<=minimum_stock`,
      );
      const out = await d.getFirstAsync<{ c: number }>(
        `SELECT COUNT(*) c FROM items WHERE deleted_at IS NULL AND quantity<=0`,
      );
      const val = await d.getFirstAsync<{ v: number }>(
        `SELECT IFNULL(SUM(quantity * IFNULL(price, 0)), 0) v FROM items WHERE deleted_at IS NULL`,
      );
      const units = await d.getFirstAsync<{ u: number }>(
        `SELECT IFNULL(SUM(quantity), 0) u FROM items WHERE deleted_at IS NULL`,
      );
      const byCat = await d.getAllAsync<{ category: string; c: number; q: number }>(
        `SELECT category, COUNT(*) c, IFNULL(SUM(quantity), 0) q FROM items WHERE deleted_at IS NULL GROUP BY category ORDER BY category`,
      );
      return [
        { metric: 'Total items', value: t?.c ?? 0 },
        { metric: 'Total units', value: units?.u ?? 0 },
        { metric: 'Low stock', value: low?.c ?? 0 },
        { metric: 'Out of stock', value: out?.c ?? 0 },
        { metric: 'Estimated valuation', value: Number(val?.v ?? 0).toFixed(2) },
        ...byCat.map((c) => ({ metric: `Category: ${c.category}`, value: `${c.c} items • ${c.q} units` })),
      ];
    }
    case 'movement': {
      const rows = await d.getAllAsync<{ timestamp: string; user_name: string | null; action: string; item_name: string | null; metadata: string | null }>(
        `SELECT timestamp, user_name, action, item_name, metadata FROM activity
         WHERE action IN ('item_created','item_edited','item_deleted','quantity_changed')
         ORDER BY timestamp DESC LIMIT 1000`,
      );
      return rows.map((r) => ({
        timestamp: r.timestamp,
        user: r.user_name ?? 'System',
        action: r.action,
        item: r.item_name ?? '',
        details: r.metadata ?? '',
      }));
    }
    case 'low':
      return d.getAllAsync<Row>(
        `SELECT ${ITEM_COLUMNS} FROM items WHERE deleted_at IS NULL AND quantity > 0 AND quantity <= minimum_stock ORDER BY quantity ASC`,
      );
    case 'out':
      return d.getAllAsync<Row>(
        `SELECT ${ITEM_COLUMNS} FROM items WHERE deleted_at IS NULL AND quantity <= 0 ORDER BY name ASC`,
      );
    case 'byCategory': {
      const rows = await d.getAllAsync<{ category: string; items: number; units: number; value: number; low: number; out: number }>(
        `SELECT category,
                COUNT(*) items,
                IFNULL(SUM(quantity), 0) units,
                IFNULL(SUM(quantity * IFNULL(price, 0)), 0) value,
                SUM(CASE WHEN quantity > 0 AND quantity <= minimum_stock THEN 1 ELSE 0 END) low,
                SUM(CASE WHEN quantity <= 0 THEN 1 ELSE 0 END) out
         FROM items WHERE deleted_at IS NULL GROUP BY category ORDER BY category`,
      );
      return rows.map((r) => ({
        category: r.category,
        items: r.items,
        units: r.units,
        valuation: Number(r.value).toFixed(2),
        low_stock: r.low,
        out_of_stock: r.out,
      }));
    }
    case 'byLocation': {
      const rows = await d.getAllAsync<{ location: string; items: number; units: number; low: number; out: number }>(
        `SELECT location,
                COUNT(*) items,
                IFNULL(SUM(quantity), 0) units,
                SUM(CASE WHEN quantity > 0 AND quantity <= minimum_stock THEN 1 ELSE 0 END) low,
                SUM(CASE WHEN quantity <= 0 THEN 1 ELSE 0 END) out
         FROM items WHERE deleted_at IS NULL GROUP BY location ORDER BY location`,
      );
      return rows.map((r) => ({
        location: r.location,
        items: r.items,
        units: r.units,
        low_stock: r.low,
        out_of_stock: r.out,
      }));
    }
    case 'audit': {
      const rows = await d.getAllAsync<{ timestamp: string; user_name: string | null; action: string; item_name: string | null; metadata: string | null }>(
        `SELECT timestamp, user_name, action, item_name, metadata FROM activity ORDER BY timestamp DESC LIMIT 1000`,
      );
      return rows.map((r) => ({
        timestamp: r.timestamp,
        user: r.user_name ?? 'System',
        action: r.action,
        item: r.item_name ?? '',
        details: r.metadata ?? '',
      }));
    }
  }
}

/* ------------------------------------------------------------------ */
/* Export helpers                                                      */
/* ------------------------------------------------------------------ */

const csvEscape = (v: string | number): string => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function toCsv(rows: Row[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(','), ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(','))].join('\n');
}

async function shareContent(fileName: string, content: string): Promise<void> {
  const file = new File(Paths.document, fileName);
  file.write(content);
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(file.uri);
  else await Share.share({ message: content });
}

export default function Reports() {
  const { colors } = useTheme();
  const [busy, setBusy] = useState(false);

  /** Original screen's handler — kept for the Inventory Summary JSON export. */
  const exportJson = async () => {
    const items = await listItems();
    await shareContent('supplyvault-export.json', JSON.stringify(items, null, 2));
  };

  const shareReport = async (id: ReportId, format: 'csv' | 'json') => {
    setBusy(true);
    try {
      if (id === 'summary' && format === 'json') await exportJson();
      else if (format === 'json') await shareContent(`supplyvault-${id}.json`, JSON.stringify(await buildRows(id), null, 2));
      else await shareContent(`supplyvault-${id}.csv`, toCsv(await buildRows(id)));
    } catch (e: any) {
      Alert.alert('Export failed', String(e?.message ?? e));
    } finally {
      setBusy(false);
    }
  };

  const onRow = (r: ReportDef) => {
    if (busy) return;
    Alert.alert(r.title, 'Generate & download this report', [
      { text: 'Export CSV', onPress: () => shareReport(r.id, 'csv') },
      { text: 'Export JSON', onPress: () => shareReport(r.id, 'json') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <Screen scroll bottomSpace>
      <ScreenHeader title="Reports" subtitle="Generate & download inventory analytics" />
      <View style={styles.list}>
        {REPORTS.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => onRow(r)}
            accessibilityRole="button"
            accessibilityLabel={`${r.title}. ${r.sub}`}
            accessibilityHint="Exports this report as CSV or JSON"
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <IconChip icon={r.icon} size={40} radius={10} bg={r.tint} color={r.color} />
            <View style={styles.rowText}>
              <Txt style={[Type.section14, { color: colors.text }]}>{r.title}</Txt>
              <Txt style={[Type.micro11, { color: colors.muted }]}>{r.sub}</Txt>
            </View>
            <ChevronRight size={16} color={colors.muted} strokeWidth={2} />
          </Pressable>
        ))}
      </View>
      <BottomTabBar active="more" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, gap: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  rowText: { flex: 1, gap: 2 },
});
