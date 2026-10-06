import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  CloudOff,
  GitMerge,
  RefreshCw,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { getDb } from '../../src/database/client';
import { pendingCount, syncNow } from '../../src/services/sync';
import { useSyncStore } from '../../src/store/useStores';
import { Screen } from '../../src/components/Screen';
import { Dot, ScreenHeader, Txt, Type } from '../../src/components/ui';
import { BottomTabBar } from '../../src/components/TabBar';

type HistoryLine = { line1: string; line2: string; ok: boolean };

const MOCK_HISTORY: HistoryLine[] = [
  { line1: '12 items Synced', line2: 'Just now', ok: true },
  { line1: '5 items Synced', line2: 'Yesterday, 4:15 PM', ok: true },
  { line1: '1 item Synced', line2: 'Oct 24, 09:30 AM', ok: false },
];

function timeOf(d: Date): string {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function relTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const now = new Date();
  if (now.getTime() - d.getTime() < 60_000) return 'Just now';
  if (d.toDateString() === now.toDateString()) return `Today, ${timeOf(d)}`;
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return `Yesterday, ${timeOf(d)}`;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeOf(d)}`;
}

function lastSyncLine(iso: string | null): string {
  if (!iso) return 'Last sync: Not yet';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Last sync: Unknown';
  const today = d.toDateString() === new Date().toDateString();
  const day = today ? 'Today' : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `Last sync: ${day} at ${timeOf(d)}`;
}

export default function SyncCenter() {
  const { colors } = useTheme();
  const router = useRouter();
  const status = useSyncStore((s) => s.status);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(0);
  const [failed, setFailed] = useState(0);
  const [successful, setSuccessful] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryLine[] | null>(null);

  const load = useCallback(async () => {
    try {
      const d = await getDb();
      const queued = await pendingCount();
      const f = await d.getFirstAsync<{ c: number }>(`SELECT COUNT(*) c FROM sync_queue WHERE state='failed'`);
      const failedN = f?.c ?? 0;
      setFailed(failedN);
      setPending(Math.max(0, queued - failedN));
      const acts = await d.getAllAsync<{ timestamp: string; metadata: string | null }>(
        `SELECT timestamp, metadata FROM activity WHERE action='sync_completed' ORDER BY timestamp DESC LIMIT 50`,
      );
      let success = 0;
      const lines: HistoryLine[] = [];
      for (const a of acts) {
        const pushed = /pushed=(\d+)/.exec(a.metadata ?? '');
        const conflicts = /conflicts=(\d+)/.exec(a.metadata ?? '');
        const n = pushed ? Number(pushed[1]) : 0;
        const bad = conflicts ? Number(conflicts[1]) > 0 : false;
        success += n;
        if (lines.length < 3) {
          lines.push({ line1: `${n} item${n === 1 ? '' : 's'} Synced`, line2: relTime(a.timestamp), ok: !bad });
        }
      }
      setSuccessful(success);
      setLastSync(acts[0]?.timestamp ?? null);
      setHistory(lines.length ? lines : null);
    } catch {
      /* best-effort */
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const run = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await syncNow((s: string) => useSyncStore.getState().setStatus(s as any));
      await load();
    } finally {
      setBusy(false);
    }
  };

  const hero =
    busy || status === 'syncing'
      ? { ring: colors.infoBg, Icon: RefreshCw, iconColor: colors.primary, label: 'Syncing Changes' }
      : status === 'error'
        ? { ring: colors.dangerBg, Icon: CircleAlert, iconColor: colors.danger, label: 'Sync Needs Attention' }
        : status === 'offline'
          ? { ring: colors.orangeBg, Icon: CloudOff, iconColor: colors.orange, label: 'Offline — Changes Queued' }
          : status === 'pending' || pending > 0
            ? { ring: colors.warningBg, Icon: Clock, iconColor: colors.warning, label: 'Changes Pending' }
            : { ring: colors.successBg, Icon: Check, iconColor: colors.success, label: 'All Systems Synced' };

  const rows = history ?? MOCK_HISTORY;

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
        <ScreenHeader title="Sync Center" subtitle="Manage your cloud connectivity" />
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.ring, { backgroundColor: hero.ring }]}>
            <hero.Icon size={32} color={hero.iconColor} strokeWidth={2} />
          </View>
          <Txt style={[styles.heroTitle, { color: colors.text }]}>{hero.label}</Txt>
          <Txt style={[Type.body13, { color: colors.muted }]}>{lastSyncLine(lastSync)}</Txt>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {[
          { label: 'Pending', value: pending, color: colors.text },
          { label: 'Successful', value: successful, color: colors.success },
          { label: 'Failed', value: failed, color: colors.danger },
        ].map((s) => (
          <View key={s.label} style={[styles.statCol, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Txt style={[Type.stat11, { color: colors.muted }]}>{s.label}</Txt>
            <Txt style={[styles.statValue, { color: s.color }]}>{s.value}</Txt>
          </View>
        ))}
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Pressable
          onPress={run}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel="Sync Now"
          style={({ pressed }) => [
            styles.syncBtn,
            { backgroundColor: colors.primary, opacity: busy ? 0.6 : pressed ? 0.85 : 1 },
          ]}
        >
          <RefreshCw size={18} color="#FFFFFF" strokeWidth={2} />
          <Txt style={[Type.button15, { color: '#FFFFFF' }]}>{busy ? 'Syncing...' : 'Sync Now'}</Txt>
        </Pressable>
      </View>

      <View style={styles.history}>
        <Txt style={[Type.section14, { color: colors.text }]}>Sync History</Txt>
        <View style={{ gap: 12 }}>
          {rows.map((h, i) => (
            <View
              key={`${h.line1}-${i}`}
              style={[styles.historyRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.historyLeft}>
                <Dot color={h.ok ? colors.success : colors.danger} size={8} />
                <View style={{ gap: 2 }}>
                  <Txt style={[styles.historyLine1, { color: colors.text }]}>{h.line1}</Txt>
                  <Txt style={[Type.micro11, { color: '#94A3B8' }]}>{h.line2}</Txt>
                </View>
              </View>
              <Txt style={[Type.bold12, { color: h.ok ? colors.success : colors.danger }]}>
                {h.ok ? 'Success' : 'Failed'}
              </Txt>
            </View>
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <Pressable
          onPress={() => router.push('/sync/conflicts')}
          accessibilityRole="button"
          accessibilityLabel="Conflict Resolution"
          style={({ pressed }) => [
            styles.historyRow,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <View style={styles.historyLeft}>
            <GitMerge size={18} color={colors.primary} strokeWidth={2} />
            <Txt style={[styles.historyLine1, { color: colors.text }]}>Conflict Resolution</Txt>
          </View>
          <ChevronRight size={16} color={colors.muted} strokeWidth={2} />
        </Pressable>
      </View>

      <BottomTabBar active="more" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingTop: 8 },
  hero: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8, alignItems: 'center' },
  ring: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 18, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingTop: 16 },
  statCol: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '800' },
  syncBtn: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
  },
  history: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, gap: 12 },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyLine1: { fontSize: 13, fontWeight: '600' },
});
