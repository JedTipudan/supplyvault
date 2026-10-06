import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View, Pressable } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { Txt, Type, PrimaryButton, Field, TextInputBox } from '../../src/components/ui';
import { getItem, updateItem } from '../../src/services/inventory';

export default function EditItem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const [name, setName] = useState(''); const [qty, setQty] = useState('0');
  const [location, setLocation] = useState(''); const [category, setCategory] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const it = await getItem(String(id));
        if (it) { setName(it.name); setQty(String(it.quantity)); setLocation(it.location); setCategory(it.category); }
      })();
    }, [id]),
  );

  const save = async () => {
    try {
      const q = parseInt(qty, 10);
      if (!name.trim()) { Alert.alert('Validation', 'Item name required'); return; }
      if (!Number.isFinite(q) || q < 0) { Alert.alert('Validation', 'Quantity must be valid'); return; }
      await updateItem(String(id), { name, quantity: q, location, category });
      router.back();
    } catch (e: any) { Alert.alert('Save failed', String(e?.message ?? e)); }
  };

  return (
    <Screen scroll contentStyle={s.scroll}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button" hitSlop={8}>
          <ChevronLeft size={20} color={colors.text} strokeWidth={2.2} />
        </Pressable>
        <Txt style={[Type.bigTitle, { color: colors.text }]}>Edit Item</Txt>
      </View>

      <View style={s.form}>
        <Field label="Name *">
          <TextInputBox value={name} onChangeText={setName} placeholder="Item name" autoCapitalize="words" />
        </Field>
        <Field label="Quantity">
          <TextInputBox value={qty} onChangeText={setQty} keyboardType="numeric" placeholder="0" />
        </Field>
        <Field label="Location">
          <TextInputBox value={location} onChangeText={setLocation} placeholder="Location" />
        </Field>
        <Field label="Category">
          <TextInputBox value={category} onChangeText={setCategory} placeholder="Category" />
        </Field>
        <PrimaryButton title="Save changes" onPress={save} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  scroll: { paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  form: { paddingHorizontal: 20, gap: 16 },
});
