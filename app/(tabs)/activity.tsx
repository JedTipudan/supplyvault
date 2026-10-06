/**
 * Figma `17-activity` — Activity Log timeline.
 * Real `activity` table (same query as before), rendered as spec timeline rows:
 * 48px avatar tile + 2px connector (except last) + card (author/time, action,
 * location badge).
 */
import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen, useTabBarInset } from '../../src/components/Screen';
import { ScreenHeader, Txt, Type } from '../../src/components/ui';
import { getDb } from '../../src/database/client';

type ActivityRow = {
  id: string;
  user_name?: string | null;
  action: string;
  item_name?: string | null;
  item_id?: string | null;
  timestamp: string;
  metadata?: string | null;
  item_location?: string | null;
};

const VERBS: Record<string, string> = {
  item_created: 'added',
  item_edited: 'updated',
  quantity_changed: 'updated',
  item_deleted: 'removed',
  barcode_scanned: 'scanned',
  barcode_not_found: 'scanned',
  qr_scanned: 'scanned QR',
  ai_recognized: 'recognized',
};

/** "2m ago" / "1h ago" / "Yesterday" / "Oct 24" — spec copy patterns. */
function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(then).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'A';
  return parts.slice(0, 2).map((p) => p[0]!.toUpperCase()).join('');
}

function authorOf(row: ActivityRow): string {
  const n = row.user_name?.trim();
  if (!n) return 'Admin (You)';
  return n === 'Admin' ? 'Admin (You)' : n;
}

function actionOf(row: ActivityRow): string {
  const verb = VERBS[row.action] ?? row.action.replace(/_/g, ' ');
  const base = row.item_name ? `${verb} ${row.item_name}` : verb;
  const meta = row.metadata?.trim();
  // Plain-text metadata (e.g. "12 → 15") is useful; raw JSON dumps are not.
  return meta && !meta.startsWith('{') ? `${base} • ${meta}` : base;
}

export default function Activity() {
  const { colors } = useTheme();
  const bottomSpace = useTabBarInset();
  const [rows, setRows] = useState<ActivityRow[]>([]);

  const load = useCallback(async () => {
    const d = await getDb();
    const data = await d.getAllAsync<ActivityRow>(
      `SELECT a.*, i.location AS item_location FROM activity a LEFT JOIN items i ON i.id = a.item_id ORDER BY a.timestamp DESC LIMIT 200`,
    );
    setRows(data ?? []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const tints = [colors.infoBg, colors.warningBg, colors.successBg, colors.purpleBg];
  const tintText = [colors.primary, colors.warning, colors.success, colors.primary];

  const renderItem = ({ item, index }: { item: ActivityRow; index: number }) => {
    const author = authorOf(item);
    const last = index === rows.length - 1;
    const i = index % tints.length;
    return (
      <View style={styles.rowWrap}>
        <View style={styles.timelineRow}>
          <View style={styles.avatarColumn}>
            <View style={[styles.avatar, { backgroundColor: tints[i], borderColor: colors.border }]}>
              <Txt style={[styles.initials, { color: tintText[i] }]}>{initialsOf(author)}</Txt>
            </View>
            {last ? null : <View style={[styles.connector, { backgroundColor: colors.border }]} />}
          </View>
          <View style={styles.cardColumn}>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeader}>
                <Txt style={[Type.rowTitle13, { color: colors.text }]}>{author}</Txt>
                <Txt style={[Type.micro11, { color: colors.placeholder }]}>{relTime(item.timestamp)}</Txt>
              </View>
              <Txt style={[Type.body13, { color: colors.text }]}>{actionOf(item)}</Txt>
              {item.item_location ? (
                <View style={[styles.locationBadge, { backgroundColor: colors.secondaryBg }]}>
                  <MapPin size={10} color={colors.muted} strokeWidth={2} />
                  <Txt style={[styles.locationText, { color: colors.muted }]}>{item.item_location}</Txt>
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Screen>
      <FlatList
        style={{ flex: 1 }}
        data={rows}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={<ScreenHeader title="Activity Log" subtitle="Real-time audit of inventory events" />}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: bottomSpace, flexGrow: 1 }}
        initialNumToRender={12}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={{ paddingHorizontal: 20 }}>
            <Txt style={[Type.body13, { color: colors.muted, textAlign: 'center', marginTop: 40 }]}>No activity yet.</Txt>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowWrap: { paddingHorizontal: 20 },
  timelineRow: { flexDirection: 'row', gap: 16 },
  avatarColumn: { width: 48, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 14, fontWeight: '700' },
  connector: { width: 2, flex: 1 },
  cardColumn: { flex: 1, paddingBottom: 24 },
  card: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  locationText: { fontSize: 10, fontWeight: '600' },
});
