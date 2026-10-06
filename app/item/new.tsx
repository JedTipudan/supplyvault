import React, { useState } from 'react';
import { ScrollView, Alert, StyleSheet, View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Barcode,
  QrCode,
  ScanFace,
  Image as ImageIcon,
  FilePen,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { BottomTabBar } from '../../src/components/TabBar';
import { Txt, Type, WideCard, OutlineButton, PrimaryButton, Field, TextInputBox } from '../../src/components/ui';
import { createItem } from '../../src/services/inventory';

type CardDef = {
  key: string;
  icon: React.ComponentType<any>;
  title: string;
  sub: string;
  ai?: boolean;
  onPress: () => void;
};

/** Default SKU seed, computed once at module load (not during render). */
const DEFAULT_SKU = `SKU-${Date.now().toString(36).toUpperCase()}`;

export default function NewItem() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{
    barcode?: string;
    aiName?: string;
    aiCategory?: string;
    aiDescription?: string;
    mode?: string;
  }>();

  // Manual-entry form state (kept from the original screen).
  const [entered, setEntered] = useState(false);
  const [name, setName] = useState(String(params.aiName ?? ''));
  const [sku, setSku] = useState(DEFAULT_SKU);
  const [category, setCategory] = useState(String(params.aiCategory ?? 'Unsorted'));
  const [qty, setQty] = useState('1');
  const [min, setMin] = useState('5');
  const [location, setLocation] = useState('IT Room');
  const [barcode, setBarcode] = useState(String(params.barcode ?? ''));

  const has = (v?: string) => v != null && String(v).length > 0;
  // Existing callers reach the form directly via barcode / AI-prefill params,
  // or explicitly via ?mode=manual (status error screen).
  const showForm = entered || params.mode === 'manual' || has(params.barcode) || has(params.aiName);

  const save = async () => {
    try {
      const q = parseInt(qty, 10);
      const m = parseInt(min, 10);
      if (!name.trim()) { Alert.alert('Validation', 'Item name required'); return; }
      if (!category.trim()) { Alert.alert('Validation', 'Category required'); return; }
      if (!Number.isFinite(q) || q < 0) { Alert.alert('Validation', 'Quantity must be valid'); return; }
      const it = await createItem({
        name, sku, category, quantity: q, minimumStock: Number.isFinite(m) ? m : 0,
        location, barcode: barcode || null, description: params.aiDescription ? String(params.aiDescription) : null,
      });
      router.replace(`/item/${it.id}`);
    } catch (e: any) { Alert.alert('Save failed', String(e?.message ?? e)); }
  };

  const goBack = () => router.back();

  const backHeader = (
    <View style={s.header}>
      <Pressable onPress={goBack} accessibilityLabel="Go back" accessibilityRole="button" hitSlop={8}>
        <ChevronLeft size={20} color={colors.text} strokeWidth={2.2} />
      </Pressable>
      <Txt style={[Type.bigTitle, { color: colors.text }]}>Add Item</Txt>
    </View>
  );

  const cards: CardDef[] = [
    {
      key: 'barcode',
      icon: Barcode,
      title: 'Scan Barcode',
      sub: "Scan an item's barcode",
      onPress: () => router.push({ pathname: '/(tabs)/scan', params: { mode: 'barcode' } }),
    },
    {
      key: 'qr',
      icon: QrCode,
      title: 'Scan QR Code',
      sub: 'Use an existing QR code',
      onPress: () => router.push({ pathname: '/(tabs)/scan', params: { mode: 'qr' } }),
    },
    {
      key: 'ai',
      icon: ScanFace,
      title: 'AI Recognize',
      sub: 'Identify an item using the camera',
      ai: true,
      onPress: () => router.push('/ai/camera'),
    },
    {
      key: 'upload',
      icon: ImageIcon,
      title: 'Upload Image',
      sub: 'Recognize an item from a photo',
      onPress: () => router.push('/ai/upload'),
    },
  ];

  return (
    <Screen bottomSpace>
      <ScrollView
        style={s.flex}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {backHeader}

        {showForm ? (
          <View style={s.form}>
            <Field label="Name *">
              <TextInputBox value={name} onChangeText={setName} placeholder="Item name" autoCapitalize="words" />
            </Field>
            <Field label="SKU *">
              <TextInputBox value={sku} onChangeText={setSku} placeholder="SKU" autoCapitalize="words" />
            </Field>
            <Field label="Category *">
              <TextInputBox value={category} onChangeText={setCategory} placeholder="Category" />
            </Field>
            <Field label="Quantity">
              <TextInputBox value={qty} onChangeText={setQty} keyboardType="numeric" placeholder="0" />
            </Field>
            <Field label="Min stock">
              <TextInputBox value={min} onChangeText={setMin} keyboardType="numeric" placeholder="0" />
            </Field>
            <Field label="Location">
              <TextInputBox value={location} onChangeText={setLocation} placeholder="Location" />
            </Field>
            <Field label="Barcode">
              <TextInputBox value={barcode} onChangeText={setBarcode} placeholder="Barcode (optional)" />
            </Field>
            <PrimaryButton title="Save item" onPress={save} />
          </View>
        ) : (
          <>
            <View style={s.intro}>
              <Txt style={[Type.cardTitle16b, { color: colors.text }]}>
                How would you like to add this item?
              </Txt>
              <Txt style={[Type.body13, { color: colors.muted }]}>
                Choose automated capture, AI parsing or manual entry.
              </Txt>
            </View>

            <View style={s.cards}>
              {cards.map((c) => (
                <WideCard
                  key={c.key}
                  onPress={c.onPress}
                  style={
                    c.ai
                      ? [
                          {
                            borderWidth: 1.5,
                            borderColor: '#EC4899',
                            shadowColor: '#EC4899',
                            shadowOpacity: 0.06,
                            shadowOffset: { width: 0, height: 4 },
                            shadowRadius: 8,
                            elevation: 2,
                          },
                        ]
                      : undefined
                  }
                >
                  <View
                    style={[
                      s.chip,
                      { backgroundColor: c.ai ? '#FCE7F3' : colors.infoBg },
                    ]}
                  >
                    <c.icon size={22} color={c.ai ? '#EC4899' : colors.primary} strokeWidth={2} />
                  </View>
                  <View style={s.cardText}>
                    <View style={s.cardTitleRow}>
                      <Txt style={[Type.section14, { color: colors.text }]}>{c.title}</Txt>
                      {c.ai ? (
                        <View style={s.aiBadge}>
                          <Txt style={[Type.badge9, { color: '#EC4899' }]}>AI SMART</Txt>
                        </View>
                      ) : null}
                    </View>
                    <Txt style={[Type.caption12, { color: colors.muted }]}>{c.sub}</Txt>
                  </View>
                  <ChevronRight size={16} color={colors.muted} strokeWidth={2} />
                </WideCard>
              ))}
            </View>

            <View style={s.bottomAction}>
              <OutlineButton
                title="Enter Manually"
                tone="blue"
                height={48}
                icon={FilePen}
                onPress={() => setEntered(true)}
              />
            </View>
          </>
        )}
      </ScrollView>
      <BottomTabBar active="home" />
    </Screen>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  intro: { paddingHorizontal: 20, paddingBottom: 24, gap: 4 },
  cards: { paddingHorizontal: 20, gap: 16 },
  chip: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1, gap: 2 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiBadge: {
    backgroundColor: '#FCE7F3',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bottomAction: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  form: { paddingHorizontal: 20, gap: 16, paddingBottom: 24 },
});
