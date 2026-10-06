import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronLeft, GitMerge } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { getDb } from '../../src/database/client';
import { resolveConflict } from '../../src/services/sync';
import { getItem } from '../../src/services/inventory';
import { uid, nowIso } from '../../src/utils/helpers';
import { Screen } from '../../src/components/Screen';
import { Badge, OutlineButton, PrimaryButton, ScreenHeader, Txt, Type } from '../../src/components/ui';
import { BottomTabBar } from '../../src/components/TabBar';

interface ConflictRow {
  id: string;
  item_id: string;
  item_name: string | null;
  local_quantity: number;
  server_quantity: number;
  local_updated_at: string;
  server_updated_at: string;
  created_at: string;
}

function timeOf(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function Conflicts() {
  const { colors } = useTheme();
  const router = useRouter();
  const [rows, setRows] = useState<ConflictRow[]>([]);

  const load = useCallback(async () => {
    try {
      const d = await getDb();
      const raw = await d.getAllAsync<any>(
        `SELECT * FROM conflicts WHERE resolution IS NULL ORDER BY created_at DESC`,
      );
      const withNames = await Promise.all(
        raw.map(async (r) => {
          let name: string | null = null;
          try { name = (await getItem(r.item_id))?.name ?? null; } catch { name = null; }
          return { ...r, item_name: name } as ConflictRow;
        }),
      );
      setRows(withNames);
    } catch {
      setRows([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const merge = async (c: ConflictRow) => {
    try {
      const d = await getDb();
      const merged = Math.max(c.local_quantity, c.server_quantity);
      const now = nowIso();
      await d.runAsync(`UPDATE items SET quantity=?, updated_at=? WHERE id=?`, [merged, now, c.item_id]);
      await d.runAsync(`UPDATE conflicts SET resolution=? WHERE id=?`, ['merged', c.id]);
      await d.runAsync(
        `INSERT INTO activity (id,action,item_id,timestamp,metadata) VALUES (?,?,?,?,?)`,
        [uid('act'), 'conflict_resolved', c.item_id, now, `merged=${merged}`],
      );
      load();
    } catch { /* ignore */ }
  };

  return (
    <Screen scroll bottomSpace>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.2} />
        </Pressable>
        <ScreenHeader title="Conflict Resolution" subtitle="Choose which value wins" />
      </View>

      <View style={styles.list}>
        {rows.length === 0 ? (
          <View style={styles.empty}>
            <Txt style={[Type.section14, { color: colors.text }]}>No unresolved conflicts</Txt>
            <Txt style={[Type.body13, { color: colors.muted, textAlign: 'center' }]}>
              Your device and the server agree on every item.
            </Txt>
          </View>
        ) : (
          rows.map((c) => (
            <View key={c.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHead}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt style={[Type.name15, { color: colors.text }]} numberOfLines={1}>
                    {c.item_name ?? `Item ${c.item_id}`}
                  </Txt>
                  <Txt style={[Type.micro11, { color: colors.muted }]}>Quantity conflict</Txt>
                </View>
                <Badge label="Unresolved" bg={colors.warningBg} color={colors.warning} size="role" />
              </View>
              <View style={styles.badges}>
                <Badge label={`Local: ${c.local_quantity}`} bg={colors.infoBg} color={colors.primary} size="role" />
                <Badge label={`Server: ${c.server_quantity}`} bg={colors.secondaryBg} color={colors.muted} size="role" />
              </View>
              <Txt style={[Type.micro11, { color: '#94A3B8' }]}>
                Local {timeOf(c.local_updated_at)} • Server {timeOf(c.server_updated_at)}
              </Txt>
              <View style={styles.actions}>
                <View style={styles.actionRow}>
                  <PrimaryButton
                    title="Keep Mine"
                    height={44}
                    style={styles.flexBtn}
                    onPress={async () => { await resolveConflict(c.id, 'keep_local'); load(); }}
                  />
                  <OutlineButton
                    title="Keep Server"
                    height={44}
                    tone="gray"
                    style={styles.flexBtn}
                    onPress={async () => { await resolveConflict(c.id, 'keep_server'); load(); }}
                  />
                </View>
                <OutlineButton
                  title="Merge"
                  height={44}
                  tone="blue"
                  icon={GitMerge}
                  style={styles.flexBtn}
                  onPress={() => merge(c)}
                />
              </View>
            </View>
          ))
        )}
      </View>

      <BottomTabBar active="more" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingTop: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  card: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  badges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actions: { gap: 8 },
  actionRow: { flexDirection: 'row', gap: 8 },
  flexBtn: { flex: 1, borderRadius: 10 },
  empty: { alignItems: 'center', gap: 6, paddingVertical: 32, paddingHorizontal: 12 },
});
