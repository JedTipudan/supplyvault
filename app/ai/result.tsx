import React from 'react';
import { ScrollView, StyleSheet, View, Image, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  TriangleAlert,
  Package,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { BottomTabBar } from '../../src/components/TabBar';
import { Txt, Type, PrimaryButton, OutlineButton, LinkText } from '../../src/components/ui';
import { Shadows } from '../../src/constants/theme';

const INFO_COPY = 'These suggestions need your confirmation before saving.';
const ERROR_COPY = 'Try taking a clearer photo or enter the item manually.';

function confidenceLabel(conf?: string): string {
  const n = Number(conf);
  if (!Number.isFinite(n)) return '94% confidence';
  const pct = n <= 1 ? Math.round(n * 100) : Math.round(n);
  return `${pct}% confidence`;
}

export default function AIResult() {
  const p = useLocalSearchParams<{
    uri?: string;
    name?: string;
    category?: string;
    desc?: string;
    conf?: string;
    brand?: string;
    type?: string;
    color?: string;
    failed?: string;
    message?: string;
  }>();
  const { colors } = useTheme();
  const router = useRouter();

  const failed = String(p.failed ?? '') === '1';
  const uri = p.uri ? String(p.uri) : '';
  const name = String(p.name ?? '');
  const category = String(p.category ?? '');
  const brand = String(p.brand ?? '');
  const type = String(p.type ?? '');
  const color = String(p.color ?? '');

  const prefill = {
    aiName: name,
    aiCategory: category,
    aiDescription: String(p.desc ?? ''),
  };

  const header = (
    <View style={s.header}>
      <Pressable
        onPress={() => router.back()}
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={8}
      >
        <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
      </Pressable>
      <View style={s.headerTitle}>
        <Sparkles size={18} color={colors.primary} strokeWidth={2} />
        <Txt style={[Type.bold18, { color: colors.text }]}>Detected Item</Txt>
      </View>
      <View style={s.headerSpacer} />
    </View>
  );

  if (failed) {
    // Figma `26-error` — recognition failed.
    const message = String(p.message ?? '').trim() || ERROR_COPY;
    return (
      <Screen bottomSpace>
        <ScrollView
          style={s.flex}
          contentContainerStyle={s.errorScroll}
          showsVerticalScrollIndicator={false}
        >
          {header}
          <View style={s.errorCard}>
            <View style={[s.ring, { backgroundColor: colors.dangerBg }]}>
              <View style={[s.innerRing, { backgroundColor: colors.danger }]}>
                <TriangleAlert size={32} color="#FFFFFF" strokeWidth={2} />
              </View>
            </View>
            <View style={s.errorText}>
              <Txt style={[Type.bigTitle, { color: colors.text, textAlign: 'center' }]}>
                Item Not Recognized
              </Txt>
              <Txt style={[s.errorMessage, { color: colors.muted }]}>{message}</Txt>
            </View>
            <View style={s.errorButtons}>
              <PrimaryButton title="Try Again" onPress={() => router.back()} />
              <OutlineButton
                title="Enter Manually"
                tone="ghost"
                onPress={() => router.replace({ pathname: '/item/new', params: { mode: 'manual' } })}
              />
            </View>
          </View>
        </ScrollView>
        <BottomTabBar active="inventory" />
      </Screen>
    );
  }

  const sub = type
    ? `${type} Inventory Item`
    : category
      ? `${category} Inventory Item`
      : 'Hardware Inventory Item';

  const rows: { label: string; value: string }[] = [
    { label: 'Category', value: category || '—' },
    ...(brand ? [{ label: 'Brand', value: brand }] : []),
    ...(type ? [{ label: 'Type', value: type }] : []),
    ...(color ? [{ label: 'Color', value: color }] : []),
  ];

  return (
    <Screen bottomSpace>
      <ScrollView
        style={s.flex}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {header}

        {/* Result preview */}
        <View style={s.preview}>
          {/* Photo card — height 180, radius 16 */}
          <View style={[s.photoCard, { backgroundColor: colors.secondaryBg }]}>
            {uri ? (
              <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <Package size={48} color={colors.muted} strokeWidth={1.6} />
            )}
            <View style={s.confidencePill}>
              <Sparkles size={14} color="#EC4899" strokeWidth={2} />
              <Txt style={[Type.bold12, { color: '#EC4899' }]}>{confidenceLabel(p.conf)}</Txt>
            </View>
          </View>

          <View style={s.titleBlock}>
            <Txt style={[Type.bigTitle, { color: colors.text }]}>{name}</Txt>
            <Txt style={[Type.medium13, { color: '#94A3B8' }]}>{sub}</Txt>
          </View>

          {/* AI Classification Suggestions */}
          <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Txt style={s.cardLabel}>AI Classification Suggestions</Txt>
            <View style={s.rows}>
              {rows.map((r) => (
                <View key={r.label} style={s.suggestRow}>
                  <Txt style={[Type.medium14, { color: '#475569' }]}>{r.label}</Txt>
                  <Txt style={[Type.section14, { color: colors.text }]}>{r.value}</Txt>
                </View>
              ))}
            </View>
          </View>

          {/* Amber info banner */}
          <View style={s.banner}>
            <AlertCircle size={16} color="#F59E0B" strokeWidth={2} />
            <Txt style={[s.bannerText, { flex: 1 }]}>{INFO_COPY}</Txt>
          </View>
        </View>

        {/* Action buttons */}
        <View style={s.actions}>
          <PrimaryButton
            title="Use Information"
            onPress={() => router.push({ pathname: '/item/new', params: prefill })}
          />
          <OutlineButton
            title="Edit Details"
            tone="gray"
            onPress={() => router.push({ pathname: '/item/new', params: { ...prefill, mode: 'manual' } })}
          />
          <View style={s.linkRow}>
            <LinkText title="Try Again" onPress={() => router.back()} />
          </View>
        </View>
      </ScrollView>
      <BottomTabBar active="inventory" />
    </Screen>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: 8 },
  errorScroll: { flexGrow: 1 },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerSpacer: { width: 24, height: 24 },
  preview: { paddingHorizontal: 20, gap: 16 },
  photoCard: {
    height: 180,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  confidencePill: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 99,
    ...Shadows.pill,
  },
  titleBlock: { gap: 4 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  cardLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#94A3B8',
  },
  rows: { gap: 10 },
  suggestRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 0.5,
    borderColor: '#F59E0B',
  },
  bannerText: { fontSize: 12, fontWeight: '500', color: '#1E293B' },
  actions: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, gap: 12 },
  linkRow: { alignItems: 'center', paddingTop: 4 },
  errorCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  ring: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { gap: 8, alignItems: 'center' },
  errorMessage: { fontSize: 14, fontWeight: '400', textAlign: 'center', lineHeight: 20, maxWidth: 300 },
  errorButtons: { alignSelf: 'stretch', gap: 12 },
});
