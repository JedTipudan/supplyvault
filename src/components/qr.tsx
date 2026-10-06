import React from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Share2 } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { Txt, Type } from './ui';

/**
 * Item QR (Figma 05 has no QR frame — this is the spec-required QR sharing
 * feature, styled in the design language). The QR contains only a safe
 * identifier, never sensitive data. White tile keeps the code scannable in
 * both light and dark themes.
 */
export function ItemQR({
  itemId,
  sku,
  barcode,
  qrCode,
}: {
  itemId: string;
  sku: string;
  barcode?: string | null;
  qrCode?: string | null;
}) {
  const { colors } = useTheme();
  const value = qrCode || `stockwise://item/${itemId}`;
  return (
    <View style={styles.wrap}>
      <View style={[styles.qrBox, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
        <QRCode value={value} size={152} />
      </View>
      <Txt style={[Type.field13, { color: colors.text }]}>{sku}</Txt>
      {barcode ? <Txt style={[Type.micro11, { color: colors.muted }]}>Barcode: {barcode}</Txt> : null}
      <Pressable
        onPress={() => Share.share({ message: `${value} (${sku})` })}
        accessibilityRole="button"
        accessibilityLabel={`Share QR code for ${sku}`}
        style={({ pressed }) => [styles.btn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
      >
        <Share2 size={16} color="#FFFFFF" strokeWidth={2} />
        <Txt style={[Type.button15, { color: '#FFFFFF' }]}>Share QR</Txt>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  qrBox: { padding: 8, borderRadius: 8, borderWidth: 1 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 10, padding: 12, paddingHorizontal: 24, marginTop: 4, minHeight: 44 },
});
