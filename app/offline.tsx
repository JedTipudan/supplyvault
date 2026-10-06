/**
 * Figma `15-offline-mode` — offline banner, illustration, real pending/last
 * sync stats and the two actions from the spec.
 */
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, CloudOff, Database } from 'lucide-react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getDb } from '../src/database/client';
import { pendingCount } from '../src/services/sync';
import { Screen } from '../src/components/Screen';
import { Txt, Type } from '../src/components/ui';
import { BottomTabBar } from '../src/components/TabBar';

function timeOf(d: Date): string {
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function Offline() {
  const { colors } = useTheme();
  const router = useRouter();
  const [pending, setPending] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setPending(await pendingCount());
        const d = await getDb();
        const act = await d.getFirstAsync<{ timestamp: string }>(
          `SELECT timestamp FROM activity WHERE action='sync_completed' ORDER BY timestamp DESC LIMIT 1`,
        );
        setLastSync(act?.timestamp ?? null);
      } catch {
        /* offline stats are best-effort */
      }
    })();
  }, []);

  let lastSyncLabel = '—';
  if (lastSync) {
    const d = new Date(lastSync);
    if (!isNaN(d.getTime())) {
      const today = d.toDateString() === new Date().toDateString();
      lastSyncLabel = today ? timeOf(d) : `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeOf(d)}`;
    }
  }

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/more');
  };

  return (
    <Screen scroll bottomSpace>
      {/* Offline banner */}
      <View style={styles.banner}>
        <CloudOff size={16} color="#FFFFFF" strokeWidth={2} />
        <Txt style={[Type.rowTitle13, styles.bannerText]}>
          Offline Mode Active • SupplyVault will cache changes locally
        </Txt>
      </View>

      {/* Illustration */}
      <View style={styles.illustration}>
        <View style={[styles.circle, { backgroundColor: colors.orangeBg }]}>
          <CloudOff size={48} color="#F97316" strokeWidth={2} />
        </View>
        <View style={{ gap: 8, alignItems: 'center' }}>
          <Txt style={[Type.statusTitle, { color: colors.text, textAlign: 'center' }]}>You are Offline</Txt>
          <Txt style={[Type.body14, styles.body]}>
            You can keep scanning and editing items. Changes will automatically sync when you reconnect.
          </Txt>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statLeft}>
            <Database size={18} color={colors.text} strokeWidth={2} />
            <Txt style={[Type.label14, { color: colors.text }]}>Pending Changes</Txt>
          </View>
          <View style={[styles.pill, { backgroundColor: colors.infoBg }]}>
            <Txt style={[styles.pillValue, { color: colors.primary }]}>{pending}</Txt>
          </View>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statLeft}>
            <Clock size={18} color={colors.text} strokeWidth={2} />
            <Txt style={[Type.label14, { color: colors.text }]}>Last Sync</Txt>
          </View>
          <Txt style={[Type.label14, { color: colors.muted }]}>{lastSyncLabel}</Txt>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => router.push('/sync/index')}
          accessibilityRole="button"
          accessibilityLabel="View Pending Changes"
          style={({ pressed }) => [styles.btn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
        >
          <Txt style={[Type.button15, { color: '#FFFFFF' }]}>View Pending Changes</Txt>
        </Pressable>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Continue Offline"
          style={({ pressed }) => [styles.btn, { borderWidth: 1, borderColor: '#CBD5E1', opacity: pressed ? 0.85 : 1 }]}
        >
          <Txt style={[Type.button15, styles.continueText]}>Continue Offline</Txt>
        </Pressable>
      </View>

      <BottomTabBar active="more" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F97316',
  },
  bannerText: { color: '#FFFFFF', flex: 1 },
  illustration: { alignItems: 'center', gap: 24, paddingVertical: 48, paddingHorizontal: 32, paddingBottom: 24 },
  circle: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
  body: { color: '#64748B', lineHeight: 20, textAlign: 'center' },
  stats: { paddingHorizontal: 20, gap: 12 },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  pillValue: { fontSize: 14, fontWeight: '700' },
  actions: { padding: 20, gap: 12 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  continueText: { color: '#000000' },
});
