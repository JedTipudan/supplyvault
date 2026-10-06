/**
 * Figma `04-inventory` (+ dark `23-dark-inventory`, empty state `24-empty-state`).
 * Header (file-search / plus-circle) → search row + filter → "Showing X of Y"
 * + grid/list toggle → 2-column grid or list cards → FAB.
 * All search / filter / refresh logic preserved from the previous version.
 */
import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { CirclePlus, FileSearch, Package, Plus, ScanBarcode, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen, useTabBarInset } from '../../src/components/Screen';
import {
  Badge,
  Fab,
  OutlineButton,
  PillButton,
  ScreenHeader,
  SearchInput,
  StateScreen,
  Txt,
  Type,
  ViewToggle,
} from '../../src/components/ui';
import { getDb } from '../../src/database/client';
import { listItems } from '../../src/services/inventory';
import { calcStockStatus } from '../../src/types/inventory';
import type { InventoryItem } from '../../src/types/inventory';

const FILTERS: { key: 'in' | 'low' | 'out'; label: string }[] = [
  { key: 'in', label: 'In Stock' },
  { key: 'low', label: 'Low Stock' },
  { key: 'out', label: 'Out of Stock' },
];

/** Deterministic tinted photo placeholder (no remote images allowed). */
function photoTint(key: string) {
  const tints = ['infoBg', 'warningBg', 'successBg', 'purpleBg', 'orangeBg', 'pinkBg'] as const;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h + key.charCodeAt(i)) % 997;
  return tints[h % tints.length];
}

function StockBadge({ item, colors }: { item: InventoryItem; colors: any }) {
  const st = calcStockStatus(item.quantity, item.minimumStock);
  const conf =
    st === 'in_stock'
      ? { bg: colors.successBg, color: '#22C55E', label: 'In Stock' }
      : st === 'low_stock'
        ? { bg: colors.warningBg, color: '#F59E0B', label: 'Low Stock' }
        : { bg: colors.dangerBg, color: '#EF4444', label: 'Out of Stock' };
  return <Badge label={conf.label} bg={conf.bg} color={conf.color} />;
}

function PhotoTile({ item, height, colors }: { item: InventoryItem; height: number; colors: any }) {
  const tint = colors[photoTint(item.id + item.name)];
  const iconColor =
    tint === colors.warningBg ? colors.warning : tint === colors.successBg ? colors.success : tint === colors.orangeBg ? colors.orange : tint === colors.pinkBg ? colors.accentPink : colors.primary;
  return (
    <View style={{ height, borderRadius: 8, backgroundColor: tint, alignItems: 'center', justifyContent: 'center' }}>
      <Package size={26} color={iconColor} strokeWidth={2} />
    </View>
  );
}

export default function Inventory() {
  const { colors } = useTheme();
  const router = useRouter();
  const bottomSpace = useTabBarInset();
  const [q, setQ] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const load = useCallback(async () => {
    const rows = await listItems({ search: q, stock: filter });
    const d = await getDb();
    const t = await d.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM items WHERE deleted_at IS NULL`);
    setTotal(t?.c ?? 0);
    setItems(rows);
    setLoading(false);
    console.log(`[SW-t] inventory data ready ${Date.now()}`);
  }, [q, filter]);

  // Reload whenever the tab comes into focus (e.g. returning from item detail).
  useFocusEffect(
    useCallback(() => {
      console.log(`[SW-t] inventory focus ${Date.now()}`);
      setLoading(true);
      const t = setTimeout(load, 100);
      return () => clearTimeout(t);
    }, [load]),
  );

  // Dev-only timing probe: fires when the screen's view gets laid out after
  // returning from a pushed screen (reveals native re-attach delay).
  const onProbeLayout = useCallback(() => {
    console.log(`[SW-t] inventory layout ${Date.now()}`);
  }, []);

  const headerRight = (
    <>
      <Pressable
        onPress={() => {
          setQ('');
          setFilter(undefined);
        }}
        accessibilityRole="button"
        accessibilityLabel="Reset search and filters"
        hitSlop={8}
      >
        <FileSearch size={22} color={colors.text} strokeWidth={2} />
      </Pressable>
      <Pressable
        onPress={() => router.push('/item/new')}
        accessibilityRole="button"
        accessibilityLabel="Add item"
        hitSlop={8}
      >
        <CirclePlus size={22} color={colors.text} strokeWidth={2} />
      </Pressable>
    </>
  );

  const showEmptyState = !loading && total === 0;

  if (showEmptyState) {
    return (
      <Screen bottomSpace>
        <ScreenHeader title="Inventory" right={headerRight} />
        <StateScreen
          tone="empty"
          title="No inventory yet"
          message="Start building your inventory by scanning an item or adding one manually."
        >
          <PillButton title="Scan Item" icon={ScanBarcode} onPress={() => router.push('/(tabs)/scan')} />
          <OutlineButton title="Add Manually" tone="blue" icon={Plus} onPress={() => router.push('/item/new')} />
        </StateScreen>
      </Screen>
    );
  }

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const sub = `${item.quantity} ${item.unit || 'units'} • ${item.location}`;
    const onPress = () => router.push(`/item/${item.id}`);
    if (view === 'list') {
      return (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Item ${item.name}`}
          style={({ pressed }) => [
            styles.listCard,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <View style={{ flex: 1, gap: 4 }}>
            <Txt style={[Type.rowTitle13, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Txt>
            <Txt style={[Type.micro11, { color: colors.muted }]} numberOfLines={1}>
              {sub}
            </Txt>
          </View>
          <StockBadge item={item} colors={colors} />
        </Pressable>
      );
    }
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Item ${item.name}`}
        style={({ pressed }) => [
          styles.gridCard,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <PhotoTile item={item} height={100} colors={colors} />
        <View style={{ gap: 4 }}>
          <Txt style={[Type.rowTitle13, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Txt>
          <Txt style={[Type.micro11, { color: colors.muted }]} numberOfLines={1}>
            {sub}
          </Txt>
          <StockBadge item={item} colors={colors} />
        </View>
      </Pressable>
    );
  };

  return (
    <Screen style={styles.root}>
      <ScreenHeader title="Inventory" right={headerRight} />

      {/* search row + filter — padding 0 20 12 */}
      <View style={styles.controls} onLayout={onProbeLayout}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchInput value={q} onChangeText={setQ} />
          </View>
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Filter items"
            accessibilityState={{ selected: showFilters }}
            style={({ pressed }) => [
              styles.filterBtn,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <SlidersHorizontal size={18} color={colors.text} strokeWidth={2} />
          </Pressable>
        </View>

        {showFilters ? (
          <View style={styles.chips}>
            {FILTERS.map((f) => (
              <Pressable
                key={f.key}
                onPress={() => setFilter(filter === f.key ? undefined : f.key)}
                accessibilityRole="button"
                accessibilityState={{ selected: filter === f.key }}
                style={[
                  styles.chip,
                  { borderColor: colors.border, backgroundColor: filter === f.key ? colors.primary : colors.card },
                ]}
              >
                <Txt style={[Type.caption12, { color: filter === f.key ? '#FFFFFF' : colors.text }]}>{f.label}</Txt>
              </Pressable>
            ))}
          </View>
        ) : null}

        <View style={styles.countRow}>
          <Txt style={[styles.count, { color: colors.muted }]}>
            Showing {items.length} of {total} items
          </Txt>
          <ViewToggle view={view} onChange={setView} />
        </View>
      </View>

      <FlatList
        key={view}
        style={{ flex: 1 }}
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={view === 'grid' ? 2 : 1}
        columnWrapperStyle={view === 'grid' ? styles.gridRow : undefined}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomSpace }]}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <Txt style={[Type.body13, { color: colors.muted, textAlign: 'center', marginTop: 40 }]}>
            {loading ? 'Loading…' : 'No items match your search.'}
          </Txt>
        }
      />

      <Fab icon={Plus} onPress={() => router.push('/item/new')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { gap: 0 },
  controls: { paddingHorizontal: 20, paddingBottom: 12, gap: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { fontSize: 12, fontWeight: '600' },
  listContent: { paddingHorizontal: 20, gap: 12 },
  gridRow: { gap: 12 },
  gridCard: { flex: 1, padding: 10, gap: 8, borderRadius: 12, borderWidth: 1 },
  listCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 12, borderWidth: 1 },
});
