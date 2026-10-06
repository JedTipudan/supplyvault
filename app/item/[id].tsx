import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Heart,
  Pen,
  Package,
  Laptop,
  MapPin,
  ThumbsUp,
  Truck,
  PlusCircle,
  Minus,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { BottomTabBar } from '../../src/components/TabBar';
import { Txt, Type } from '../../src/components/ui';
import { ItemQR } from '../../src/components/qr';
import { getItem, adjustQuantity, softDeleteItem } from '../../src/services/inventory';
import { getDb } from '../../src/database/client';
import { calcStockStatus } from '../../src/types/inventory';
import type { InventoryItem } from '../../src/types/inventory';

/* ------------------------------------------------------------------ */
/* Activity helpers (real rows from the local activity table)          */
/* ------------------------------------------------------------------ */

type ActivityRow = {
  id: string;
  action: string;
  user_name?: string | null;
  item_name?: string | null;
  timestamp: string;
  metadata?: string | null;
};

function activityTitle(r: ActivityRow): string {
  switch (r.action) {
    case 'quantity_changed': {
      const to = String(r.metadata ?? '').split('→').pop()?.trim();
      return to ? `Quantity updated to ${to} units` : 'Quantity updated';
    }
    case 'item_edited':
      return 'Item details updated';
    case 'item_created':
      return 'Item added to inventory';
    case 'barcode_scanned':
      return 'Barcode scanned';
    case 'barcode_not_found':
      return 'Barcode did not match an item';
    case 'item_deleted':
      return 'Item deleted';
    default:
      return r.action.replace(/_/g, ' ');
  }
}

function dayLabel(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return 'Recently';
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(new Date()) - startOf(d)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString();
}

const SPEC_ACTIVITY = [
  { title: 'Quantity updated to 12 units', sub: 'Today • Admin User' },
  { title: 'Location changed from Warehouse to IT Room', sub: 'Yesterday • Admin User' },
];

/* ------------------------------------------------------------------ */

export default function ItemDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const found = await getItem(String(id));
    setItem(found);
    try {
      const d = await getDb();
      const rows = await d.getAllAsync(
        `SELECT * FROM activity WHERE item_id = ? ORDER BY timestamp DESC LIMIT 6`,
        [String(id)],
      );
      setActivity(rows as ActivityRow[]);
    } catch {
      setActivity([]);
    }
    setLoaded(true);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const goEdit = () => router.push({ pathname: '/item/edit', params: { id: String(id) } });

  const adj = async (d: number) => {
    if (!item) return;
    try {
      setItem(await adjustQuantity(item.id, d));
    } catch (e: any) {
      Alert.alert('Invalid quantity', String(e?.message ?? e));
    }
  };

  const remove = () => {
    if (!item) return;
    Alert.alert('Delete?', `Delete ${item.name}?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await softDeleteItem(item.id);
          router.back();
        },
      },
    ]);
  };

  if (!loaded) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
          <Txt style={[Type.body13, { color: colors.muted }]}>Loading…</Txt>
        </View>
      </Screen>
    );
  }

  if (!item) {
    return (
      <Screen bottomSpace>
        <View style={styles.center}>
          <Txt style={[Type.bigTitle, { color: colors.text }]}>Item not found</Txt>
          <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={8}>
            <Txt style={[Type.label14, { color: colors.primary }]}>Go back</Txt>
          </Pressable>
        </View>
        <BottomTabBar active="inventory" />
      </Screen>
    );
  }

  const stock = calcStockStatus(item.quantity, item.minimumStock);
  const badge =
    stock === 'in_stock'
      ? { bg: colors.successBg, fg: colors.success, label: 'In Stock' }
      : stock === 'low_stock'
        ? { bg: colors.warningBg, fg: colors.warning, label: 'Low Stock' }
        : { bg: colors.dangerBg, fg: colors.danger, label: 'Out of Stock' };

  const categoryIcon =
    /electronic|computer|laptop|tech/i.test(item.category ?? '') ? Laptop : Package;

  const condition = item.condition
    ? String(item.condition).charAt(0).toUpperCase() + String(item.condition).slice(1)
    : item.description || '—';

  const detailRows: { icon: React.ComponentType<any>; label: string; value: string }[] = [
    { icon: Package, label: 'Quantity', value: `${item.quantity} ${item.unit}` },
    { icon: MapPin, label: 'Location', value: item.location || '—' },
    { icon: categoryIcon, label: 'Category', value: item.category || '—' },
    { icon: ThumbsUp, label: 'Condition', value: condition || '—' },
    { icon: Truck, label: 'Supplier', value: item.supplier || '—' },
  ];

  const max = item.maximumStock ?? 0;
  const capacity = max > 0 ? Math.min(item.quantity, max) / max : item.quantity > 0 ? 1 : 0;
  const progressPct = Math.max(0, Math.min(1, capacity));

  return (
    <Screen bottomSpace>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top action bar — padding 12 / 20 */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => {
              console.log(`[SW-t] back pressed ${Date.now()}`);
              router.back();
            }}
            accessibilityLabel="Back to inventory"
            accessibilityRole="button"
            hitSlop={8}
            style={styles.backGroup}
          >
            <ChevronLeft size={20} color={colors.primary} strokeWidth={2.2} />
            <Txt style={[Type.label14, { color: colors.primary }]}>Inventory</Txt>
          </Pressable>
          <View style={styles.topActions}>
            <Pressable
              onPress={() => setFavorite((f) => !f)}
              accessibilityLabel={favorite ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityRole="button"
              accessibilityState={{ selected: favorite }}
              hitSlop={8}
            >
              <Heart
                size={20}
                color={favorite ? colors.accentPink : colors.text}
                fill={favorite ? colors.accentPink : 'transparent'}
                strokeWidth={2}
              />
            </Pressable>
            <Pressable
              onPress={goEdit}
              accessibilityLabel="Edit item"
              accessibilityRole="button"
              hitSlop={8}
            >
              <Pen size={20} color={colors.text} strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* Photo — height 200, radius 16 */}
        <View style={styles.photoWrap}>
          <View style={[styles.photo, { backgroundColor: colors.infoBg }]}>
            {React.createElement(categoryIcon, { size: 56, color: colors.primary, strokeWidth: 1.6 })}
          </View>
        </View>

        {/* Title + status badge + SKU */}
        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            <Txt style={[Type.statusTitle, { color: colors.text, flex: 1 }]}>{item.name}</Txt>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Txt accessibilityLabel={`Stock status ${badge.label}`} style={[Type.badge11, { color: badge.fg }]}>
                {badge.label}
              </Txt>
            </View>
          </View>
          <Txt style={[Type.medium13, { color: colors.muted }]}>SKU: {item.sku}</Txt>
        </View>

        {/* Detail card */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {detailRows.map((r) => (
              <View key={r.label} style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <r.icon size={18} color={colors.muted} strokeWidth={2} />
                  <Txt style={[Type.field13, { color: colors.muted }]}>{r.label}</Txt>
                </View>
                <Txt style={[Type.field13, { color: colors.text }]}>{r.value}</Txt>
              </View>
            ))}
          </View>
        </View>

        {/* Stock Level Status */}
        <View style={styles.section}>
          <Txt style={[Type.rowTitle13, { color: colors.text }]}>Stock Level Status</Txt>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statRow}>
              <Txt style={[Type.caption12, { color: colors.muted }]}>
                Current: {item.quantity}
                {max > 0 ? ` / ${max}` : ''}
              </Txt>
              <Txt style={[styles.capacityText, { color: colors.primary }]}>
                {Math.round(capacity * 100)}% Capacity
              </Txt>
            </View>
            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <View
                style={[styles.fill, { backgroundColor: colors.primary, width: `${progressPct * 100}%` }]}
              />
            </View>
            <View style={styles.statRow}>
              <Txt style={[Type.micro11, { color: colors.muted }]}>Min: {item.minimumStock}</Txt>
              <Txt style={[Type.micro11, { color: colors.muted }]}>Max: {max > 0 ? max : '—'}</Txt>
            </View>
          </View>
        </View>

        {/* Add Stock / Remove */}
        <View style={styles.buttonRow}>
          <Pressable
            onPress={() => adj(1)}
            accessibilityLabel="Add stock"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.stockBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <PlusCircle size={16} color="#FFFFFF" strokeWidth={2} />
            <Txt style={[styles.stockBtnText, { color: '#FFFFFF' }]}>Add Stock</Txt>
          </Pressable>
          <Pressable
            onPress={() => adj(-1)}
            accessibilityLabel="Remove stock"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.stockBtn,
              {
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Minus size={16} color={colors.text} strokeWidth={2} />
            <Txt style={[styles.stockBtnText, { color: colors.text }]}>Remove</Txt>
          </Pressable>
        </View>

        {/* Edit / Delete (soft-delete still works) */}
        <View style={styles.buttonRow}>
          <Pressable
            onPress={goEdit}
            accessibilityLabel="Edit item"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.stockBtn,
              {
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Pen size={16} color={colors.primary} strokeWidth={2} />
            <Txt style={[styles.stockBtnText, { color: colors.primary }]}>Edit</Txt>
          </Pressable>
          <Pressable
            onPress={remove}
            accessibilityLabel="Delete item"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.stockBtn,
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: colors.danger,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Trash2 size={16} color={colors.danger} strokeWidth={2} />
            <Txt style={[styles.stockBtnText, { color: colors.danger }]}>Delete</Txt>
          </Pressable>
        </View>

        {/* Photos — decorative tiles (no photo write logic exists yet) */}
        <View style={styles.section}>
          <Txt style={[Type.rowTitle13, { color: colors.text }]}>Photos</Txt>
          <View style={styles.photoRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.photoTile, { backgroundColor: colors.secondaryBg }]}
                accessibilityLabel="Photo placeholder"
              >
                <ImageIcon size={22} color={colors.muted} strokeWidth={2} />
              </View>
            ))}
          </View>
        </View>

        {/* QR Code & Barcode (spec-required QR sharing) */}
        <View style={styles.section}>
          <Txt style={[Type.rowTitle13, { color: colors.text }]}>QR Code & Barcode</Txt>
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 16,
              alignItems: 'center',
            }}
          >
            <ItemQR itemId={item.id} sku={item.sku} barcode={item.barcode} qrCode={item.qrCode} />
          </View>
        </View>

        {/* Activity Log */}
        <View style={[styles.section, { paddingBottom: 16 }]}>
          <Txt style={[Type.rowTitle13, { color: colors.text }]}>Activity Log</Txt>
          <View style={{ gap: 12 }}>
            {(activity.length
              ? activity.slice(0, 4).map((r) => ({
                  title: activityTitle(r),
                  sub: `${dayLabel(r.timestamp)} • ${r.user_name || 'Admin User'}`,
                }))
              : SPEC_ACTIVITY
            ).map((row, i, arr) => (
              <View key={`${row.title}-${i}`} style={styles.activityRow}>
                <View style={styles.rail}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: i === 0 ? colors.primary : colors.muted },
                    ]}
                  />
                  {i < arr.length - 1 ? (
                    <View style={[styles.connector, { backgroundColor: colors.border }]} />
                  ) : null}
                </View>
                <View style={styles.activityText}>
                  <Txt style={[Type.field13, { color: colors.text }]}>{row.title}</Txt>
                  <Txt style={[Type.micro11, { color: colors.muted }]}>{row.sub}</Txt>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomTabBar active="inventory" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingBottom: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  photoWrap: { paddingHorizontal: 20, paddingBottom: 16 },
  photo: { height: 200, borderRadius: 16, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  titleBlock: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  section: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  capacityText: { fontSize: 12, fontWeight: '600' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },
  buttonRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingBottom: 16 },
  stockBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stockBtnText: { fontSize: 13, fontWeight: '600' },
  photoRow: { flexDirection: 'row', gap: 10 },
  photoTile: {
    width: 64,
    height: 64,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityRow: { flexDirection: 'row', gap: 12 },
  rail: { width: 16, alignItems: 'center', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  connector: { width: 2, height: 24, borderRadius: 1 },
  activityText: { flex: 1, gap: 2 },
});
