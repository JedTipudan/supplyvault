/**
 * Figma `12-categories` (CategoriesScreen) + `13-locations` (LocationsScreen).
 *
 * Data, CRUD guards (a category/location that still has items cannot be
 * deleted) and the inline add flow come from the original implementation;
 * only the presentation is restyled to docs/FIGMA_SPEC.md.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import {
  Armchair,
  Box,
  Car,
  ChevronRight,
  GraduationCap,
  Laptop,
  MapPin,
  Package,
  Plus,
  PlusCircle,
  Printer,
  Search,
  Wrench,
} from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { getDb } from '../database/client';
import { uid, nowIso } from '../utils/helpers';
import { Screen } from './Screen';
import { AppBar, Dot, IconChip, SearchInput, Txt, Type, WideCard } from './ui';
import { BottomTabBar } from './TabBar';

type TaxRow = { id: string; name: string; count: number; low: number; tintIdx: number };

/* Spec tint cycle for the 8 category chips (12-categories). */
const CAT_TINTS = [
  { bg: '#EFF6FF', Icon: Laptop, color: '#2563EB' },
  { bg: '#DCFCE7', Icon: Printer, color: '#22C55E' },
  { bg: '#FEF3C7', Icon: Armchair, color: '#F59E0B' },
  { bg: '#F1F5F9', Icon: Wrench, color: '#64748B' },
  { bg: '#F5F3FF', Icon: Package, color: '#EC4899' },
  { bg: '#F0FDFA', Icon: Car, color: '#22C55E' },
  { bg: '#FFF7ED', Icon: GraduationCap, color: '#F97316' },
  { bg: '#F1F5F9', Icon: Box, color: '#64748B' },
];

function useTable(table: 'categories' | 'locations') {
  const [rows, setRows] = useState<TaxRow[]>([]);
  const [name, setName] = useState('');

  const load = useCallback(async () => {
    const d = await getDb();
    const base = await d.getAllAsync<{ id: string; name: string }>(
      `SELECT id, name FROM ${table} ORDER BY name ASC`,
    );
    const counts =
      table === 'categories'
        ? await d.getAllAsync<{ key: string; c: number; low: number }>(
            `SELECT category key, COUNT(*) c, 0 low FROM items WHERE deleted_at IS NULL GROUP BY category`,
          )
        : await d.getAllAsync<{ key: string; c: number; low: number }>(
            `SELECT location key, COUNT(*) c,
                    SUM(CASE WHEN quantity > 0 AND quantity <= minimum_stock THEN 1 ELSE 0 END) low
             FROM items WHERE deleted_at IS NULL GROUP BY location`,
          );
    const map = new Map(counts.map((r) => [r.key, r]));
    setRows(
      base.map((r, i) => {
        const hit = map.get(r.name);
        return {
          id: r.id,
          name: r.name,
          count: hit?.c ?? 0,
          low: table === 'locations' ? Number(hit?.low ?? 0) : 0,
          tintIdx: i,
        };
      }),
    );
  }, [table]);
  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const add = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name required');
      return;
    }
    const d = await getDb();
    const now = nowIso();
    try {
      await d.runAsync(
        `INSERT INTO ${table} (id,name,created_at,updated_at) VALUES (?,?,?,?)`,
        [uid(table), name.trim(), now, now],
      );
      setName('');
      load();
    } catch {
      Alert.alert('Error', 'Name already exists');
    }
  };

  /** CRUD guard: never delete a category/location that is still in use. */
  const remove = async (id: string, n: string) => {
    const d = await getDb();
    if (table === 'categories') {
      const c = await d.getFirstAsync<{ c: number }>(
        `SELECT COUNT(*) c FROM items WHERE category=? AND deleted_at IS NULL`,
        [n],
      );
      if (c && c.c > 0) {
        Alert.alert('Blocked', `Category has ${c.c} items. Reassign first.`);
        return;
      }
    }
    if (table === 'locations') {
      const c = await d.getFirstAsync<{ c: number }>(
        `SELECT COUNT(*) c FROM items WHERE location=? AND deleted_at IS NULL`,
        [n],
      );
      if (c && c.c > 0) {
        Alert.alert('Blocked', `Location has ${c.c} items. Reassign first.`);
        return;
      }
    }
    await d.runAsync(`DELETE FROM ${table} WHERE id=?`, [id]);
    load();
  };

  return { rows, name, setName, add, remove };
}

/* ------------------------------------------------------------------ */
/* Shared chrome (56px app bar + optional search / add rows)           */
/* ------------------------------------------------------------------ */

function HeaderActions({
  searching,
  adding,
  onToggleSearch,
  onToggleAdd,
  addLabel,
  searchLabel,
}: {
  searching: boolean;
  adding: boolean;
  onToggleSearch: () => void;
  onToggleAdd: () => void;
  addLabel: string;
  searchLabel: string;
}) {
  const { colors } = useTheme();
  return (
    <>
      <Pressable
        onPress={onToggleSearch}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={searchLabel}
        accessibilityState={{ selected: searching }}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <Search size={22} color={colors.text} strokeWidth={2} />
      </Pressable>
      <Pressable
        onPress={onToggleAdd}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={addLabel}
        accessibilityState={{ selected: adding }}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        {addLabel.includes('category') ? (
          <PlusCircle size={22} color={colors.text} strokeWidth={2} />
        ) : (
          <Plus size={22} color={colors.text} strokeWidth={2} />
        )}
      </Pressable>
    </>
  );
}

function AddRow({
  value,
  onChangeText,
  placeholder,
  onSubmit,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  onSubmit: () => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.pad, styles.addRow]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        accessibilityLabel={placeholder}
        style={[styles.addInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
      <Pressable
        onPress={onSubmit}
        accessibilityRole="button"
        accessibilityLabel="Add"
        style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
      >
        <Txt style={[Type.button15, { color: '#FFFFFF' }]}>Add</Txt>
      </Pressable>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* 12-categories                                                       */
/* ------------------------------------------------------------------ */

export function CategoriesScreen() {
  const { colors } = useTheme();
  const t = useTable('categories');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = q ? t.rows.filter((r) => r.name.toLowerCase().includes(q)) : t.rows;
  const gridRows: TaxRow[][] = [];
  for (let i = 0; i < filtered.length; i += 2) gridRows.push(filtered.slice(i, i + 2));

  const onCardPress = (row: TaxRow) => {
    Alert.alert(row.name, `${row.count} item${row.count === 1 ? '' : 's'} in this category.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete Category', style: 'destructive', onPress: () => t.remove(row.id, row.name) },
    ]);
  };

  return (
    <Screen scroll bottomSpace>
      <AppBar
        title="Categories"
        right={
          <HeaderActions
            searching={searching}
            adding={adding}
            searchLabel="Search categories"
            addLabel="Add category"
            onToggleSearch={() => {
              setSearching((s) => !s);
              if (searching) setQuery('');
            }}
            onToggleAdd={() => setAdding((a) => !a)}
          />
        }
      />
      {searching ? (
        <View style={styles.pad}>
          <SearchInput value={query} onChangeText={setQuery} placeholder="Search categories..." />
        </View>
      ) : null}
      {adding ? (
        <AddRow
          value={t.name}
          onChangeText={t.setName}
          placeholder="New category"
          onSubmit={() => t.add()}
        />
      ) : null}

      <View style={styles.grid}>
        {gridRows.map((pair, i) => (
          <View key={`row-${i}`} style={styles.gridRow}>
            {pair.map((row) => {
              const chip = CAT_TINTS[row.tintIdx % CAT_TINTS.length];
              return (
                <Pressable
                  key={row.id}
                  onPress={() => onCardPress(row)}
                  accessibilityRole="button"
                  accessibilityLabel={`${row.name}, ${row.count} items. Opens actions.`}
                  style={({ pressed }) => [
                    styles.catCard,
                    { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <IconChip icon={chip.Icon} size={40} radius={10} bg={chip.bg} color={chip.color} />
                  <View style={{ gap: 2 }}>
                    <Txt style={[Type.section14, { color: colors.text }]} numberOfLines={1}>
                      {row.name}
                    </Txt>
                    <Txt style={[Type.caption12, { color: '#94A3B8' }]}>{row.count} items</Txt>
                  </View>
                </Pressable>
              );
            })}
            {pair.length === 1 ? <View style={[styles.catCard, { borderWidth: 0, backgroundColor: 'transparent' }]} /> : null}
          </View>
        ))}
        {filtered.length === 0 ? (
          <Txt style={[Type.body13, { color: colors.muted, paddingVertical: 12 }]}>
            {t.rows.length === 0 ? 'No categories yet — tap + to add one.' : 'No categories match your search.'}
          </Txt>
        ) : null}
      </View>

      <BottomTabBar active="inventory" />
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* 13-locations                                                        */
/* ------------------------------------------------------------------ */

export function LocationsScreen() {
  const { colors } = useTheme();
  const t = useTable('locations');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);

  const q = query.trim().toLowerCase();
  const filtered = q ? t.rows.filter((r) => r.name.toLowerCase().includes(q)) : t.rows;

  const onCardPress = (row: TaxRow) => {
    Alert.alert(row.name, `${row.count} item${row.count === 1 ? '' : 's'} stored here.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete Location', style: 'destructive', onPress: () => t.remove(row.id, row.name) },
    ]);
  };

  return (
    <Screen scroll bottomSpace>
      <AppBar
        title="Locations"
        right={
          <HeaderActions
            searching={searching}
            adding={adding}
            searchLabel="Search locations"
            addLabel="Add location"
            onToggleSearch={() => {
              setSearching((s) => !s);
              if (searching) setQuery('');
            }}
            onToggleAdd={() => setAdding((a) => !a)}
          />
        }
      />
      {searching ? (
        <View style={styles.pad}>
          <SearchInput value={query} onChangeText={setQuery} placeholder="Search locations..." />
        </View>
      ) : null}
      {adding ? (
        <AddRow
          value={t.name}
          onChangeText={t.setName}
          placeholder="New location (Building → Room → Area)"
          onSubmit={() => t.add()}
        />
      ) : null}

      <View style={styles.grid}>
        {filtered.map((row) => (
          <WideCard key={row.id} radius={16} onPress={() => onCardPress(row)}>
            <IconChip icon={MapPin} size={40} radius={10} bg="#EFF6FF" color="#2563EB" />
            <View style={{ flex: 1, gap: 4 }}>
              <Txt style={[Type.name15, { color: colors.text }]} numberOfLines={1}>
                {row.name}
              </Txt>
              <View style={styles.metaRow}>
                <Txt style={[Type.caption12, { color: '#94A3B8' }]}>{row.count} items</Txt>
                {row.low > 0 ? (
                  <View style={styles.lowPill}>
                    <Dot color="#F59E0B" size={6} />
                    <Txt style={[styles.lowText]}>{row.low} low stock</Txt>
                  </View>
                ) : null}
              </View>
            </View>
            <ChevronRight size={16} color={colors.muted} strokeWidth={2} />
          </WideCard>
        ))}
        {filtered.length === 0 ? (
          <Txt style={[Type.body13, { color: colors.muted, paddingVertical: 12 }]}>
            {t.rows.length === 0 ? 'No locations yet — tap + to add one.' : 'No locations match your search.'}
          </Txt>
        ) : null}
      </View>

      <BottomTabBar active="inventory" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: 20, paddingBottom: 12 },
  grid: { paddingHorizontal: 20, gap: 12, paddingBottom: 16 },
  gridRow: { flexDirection: 'row', gap: 12 },
  catCard: { flex: 1, minWidth: 0, padding: 16, gap: 12, borderRadius: 16, borderWidth: 1 },
  addRow: { flexDirection: 'row', gap: 8 },
  addInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    padding: 0,
  },
  addBtn: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lowPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lowText: { fontSize: 12, fontWeight: '600', color: '#F59E0B' },
});
