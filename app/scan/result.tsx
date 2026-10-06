import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, CircleCheck, Package } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { Txt, Type } from '../../src/components/ui';
import { getItem } from '../../src/services/inventory';
import type { InventoryItem } from '../../src/types/inventory';

/**
 * Full-screen version of the scanner's bottom drawer (Figma `10`/`11`
 * `bottom-drawer-sheet` content): Item Found header, photo + name + SKU,
 * stat boxes and View Item / Update Stock actions.
 */
export default function ScanResult() {
  const { id, code } = useLocalSearchParams<{ id?: string; code?: string }>();
  const { colors } = useTheme();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (id) setItem(await getItem(String(id)));
      setLoaded(true);
    })();
  }, [id]);

  return (
    <Screen>
      <ScrollView style={s.flex} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Back header — chevron-left + title 800/20 */}
        <View style={s.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
          >
            <ChevronLeft size={20} color={colors.text} strokeWidth={2.2} />
          </Pressable>
          <Txt style={[Type.bigTitle, { color: colors.text }]}>Scan Result</Txt>
        </View>

        {!loaded ? (
          <View style={s.center}>
            <ActivityIndicator color={colors.primary} />
            <Txt style={[Type.body13, { color: colors.muted }]}>Looking up item…</Txt>
          </View>
        ) : !item ? (
          <View style={s.center}>
            <Txt style={[Type.section14, { color: colors.text }]}>No matching item found</Txt>
            {code ? <Txt style={[Type.body13, { color: colors.muted }]}>Code: {String(code)}</Txt> : null}
          </View>
        ) : (
          <View style={s.body}>
            {/* Item Found header */}
            <View style={s.foundRow}>
              <View style={s.foundLeft}>
                <CircleCheck size={18} color={colors.success} strokeWidth={2} />
                <Txt style={[Type.cardTitle16b, { color: colors.text }]}>Item Found</Txt>
              </View>
              <Txt style={[Type.field13, { color: '#94A3B8' }]}>1 sec ago</Txt>
            </View>

            {/* Photo + name + SKU */}
            <View style={s.itemRow}>
              <View style={[s.photo, { backgroundColor: colors.infoBg }]}>
                <Package size={26} color={colors.primary} strokeWidth={1.8} />
              </View>
              <View style={s.itemText}>
                <Txt style={[Type.name15, { color: colors.text }]}>{item.name}</Txt>
                <Txt style={[Type.body13, { color: '#475569' }]}>SKU: {item.sku}</Txt>
              </View>
            </View>

            {/* Stat boxes */}
            <View style={s.statsRow}>
              <View style={[s.statBox, { backgroundColor: colors.secondaryBg }]}>
                <Txt style={[Type.stat11, { color: '#94A3B8', textTransform: 'uppercase' }]}>Quantity</Txt>
                <Txt style={[Type.name15, { color: colors.text }]}>
                  {item.quantity} {item.unit}
                </Txt>
              </View>
              <View style={[s.statBox, { backgroundColor: colors.secondaryBg }]}>
                <Txt style={[Type.stat11, { color: '#94A3B8', textTransform: 'uppercase' }]}>Location</Txt>
                <Txt style={[Type.name15, { color: colors.text }]}>{item.location}</Txt>
              </View>
            </View>

            {/* Actions */}
            <View style={s.actions}>
              <Pressable
                onPress={() => router.replace(`/item/${item.id}`)}
                accessibilityLabel="View item"
                accessibilityRole="button"
                style={({ pressed }) => [
                  s.actionBtn,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Txt style={[Type.label14, { color: '#FFFFFF' }]}>View Item</Txt>
              </Pressable>
              <Pressable
                onPress={() => router.push(`/item/${item.id}`)}
                accessibilityLabel="Update stock for this item"
                accessibilityRole="button"
                style={({ pressed }) => [
                  s.actionBtn,
                  {
                    borderWidth: 1,
                    borderColor: '#CBD5E1',
                    backgroundColor: 'transparent',
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Txt style={[Type.label14, { color: colors.text }]}>Update Stock</Txt>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  body: { paddingHorizontal: 20, gap: 16 },
  foundRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  foundLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  itemText: { flex: 1, gap: 4 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, padding: 12, gap: 4, borderRadius: 8 },
  actions: { flexDirection: 'row', gap: 12, paddingTop: 4 },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
