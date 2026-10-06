/**
 * Figma `14-notifications` — screen header + notification cards with a 4px
 * leading accent bar, title row (icon 16 + title 700/14 over timestamp 400/11)
 * and body 400/13 lineHeight 18.
 *
 * Data: locally recorded notifications (low-stock / out-of-stock alerts written
 * by src/services/notifications.ts into the `notifications` table) render first,
 * mapped to the spec's four accent/icon patterns. The spec's static cards are
 * only used while the table is empty.
 */
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Calendar, CircleAlert, RefreshCw, TriangleAlert } from 'lucide-react-native';
import { Screen } from '../src/components/Screen';
import { BottomTabBar } from '../src/components/TabBar';
import { ScreenHeader, Txt, Type } from '../src/components/ui';
import { useTheme } from '../src/hooks/useTheme';
import { getDb } from '../src/database/client';

type IconComp = React.ComponentType<{ size?: number | string; color?: string; strokeWidth?: number | string }>;

type Pattern = { color: string; Icon: IconComp };

/** The four Figma accent/icon patterns (spec tints, hardcoded on purpose). */
const LOW: Pattern = { color: '#F59E0B', Icon: TriangleAlert };
const OUT: Pattern = { color: '#EF4444', Icon: CircleAlert };
const SYNC: Pattern = { color: '#22C55E', Icon: RefreshCw };
const MAINTENANCE: Pattern = { color: '#2563EB', Icon: Calendar };

function patternFor(kind: string): Pattern {
  const k = (kind || '').toLowerCase();
  if (k.includes('low')) return LOW;
  if (k.includes('out') || k.includes('empty')) return OUT;
  if (k.includes('sync')) return SYNC;
  if (k.includes('maint') || k.includes('reminder') || k.includes('calendar')) return MAINTENANCE;
  return MAINTENANCE;
}

type CardData = { id: string; color: string; Icon: IconComp; title: string; body: string; time: string };

/** Spec cards — rendered only when no real notifications exist. */
const STATIC_CARDS: CardData[] = [
  {
    id: 'static-low-stock',
    color: LOW.color,
    Icon: LOW.Icon,
    title: 'Low Stock Warning',
    time: '10m ago',
    body: 'USB Keyboard in Storage Room is running low (3 units left).',
  },
  {
    id: 'static-out-of-stock',
    color: OUT.color,
    Icon: OUT.Icon,
    title: 'Out of Stock Alert',
    time: '1h ago',
    body: 'Printer Ink in IT Room is completely out of stock.',
  },
  {
    id: 'static-database-synced',
    color: SYNC.color,
    Icon: SYNC.Icon,
    title: 'Database Synced',
    time: '3h ago',
    body: '12 pending offline changes synced successfully.',
  },
  {
    id: 'static-maintenance',
    color: MAINTENANCE.color,
    Icon: MAINTENANCE.Icon,
    title: 'Maintenance Reminder',
    time: '1d ago',
    body: 'Projector in AV Room is scheduled for quarterly filter cleanup.',
  },
];

type StoredNotification = { id: string; title: string; body: string; kind: string; created_at: string };

function timeAgo(iso?: string | null): string {
  if (!iso) return '';
  const ts = new Date(iso).getTime();
  if (!Number.isFinite(ts)) return '';
  const mins = Math.floor(Math.max(0, Date.now() - ts) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function NotifCard({ data, onPress }: { data: CardData; onPress: () => void }) {
  const { colors } = useTheme();
  const { Icon } = data;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${data.title}. ${data.body}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: data.color }]} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <View style={styles.iconBox}>
              <Icon size={16} color={data.color} strokeWidth={2} />
            </View>
            <Txt style={[Type.section14, { color: colors.text, flexShrink: 1 }]} numberOfLines={1}>
              {data.title}
            </Txt>
          </View>
          <Txt style={[Type.micro11, { color: colors.placeholder }]}>{data.time}</Txt>
        </View>
        <Txt style={[Type.body13, { color: colors.muted, lineHeight: 18 }]}>{data.body}</Txt>
      </View>
    </Pressable>
  );
}

export default function Notifications() {
  const router = useRouter();
  const [stored, setStored] = useState<StoredNotification[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const d = await getDb();
          const rows = await d.getAllAsync<StoredNotification>(
            `SELECT id, title, body, kind, created_at FROM notifications ORDER BY created_at DESC LIMIT 50`,
          );
          if (alive) setStored(rows);
        } catch {
          if (alive) setStored([]);
        }
      })();
      return () => { alive = false; };
    }, []),
  );

  const cards: CardData[] =
    stored && stored.length > 0
      ? stored.map((n) => {
          const p = patternFor(n.kind);
          return { id: n.id, color: p.color, Icon: p.Icon, title: n.title, body: n.body, time: timeAgo(n.created_at) };
        })
      : STATIC_CARDS;

  const openInventory = () => router.push('/(tabs)/inventory');

  return (
    <Screen scroll bottomSpace topInset>
      <ScreenHeader title="Notifications" subtitle="Stay updated with your inventory health" />
      <View style={styles.list}>
        {cards.map((c) => (
          <NotifCard key={c.id} data={c} onPress={openInventory} />
        ))}
      </View>
      <BottomTabBar active="more" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingTop: 8, paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  accent: { width: 4, alignSelf: 'stretch' },
  content: { flex: 1, padding: 12, gap: 8 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  titleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  iconBox: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
});
