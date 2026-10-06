/**
 * Figma `10-barcode-scanner` / `11-qr-scanner`.
 * Full-bleed #0B0F19 camera screen (tab bar hidden on this route): camera
 * header → 320px viewfinder zone → glass quick tools → success drawer sheet.
 * All camera / lookup / activity / permission logic from the previous version
 * is preserved — the drawer only replaces the presentation of the success path.
 */
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import type { ViewStyle } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, CircleCheck, Image as ImageIcon, Package, Zap } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Shadows } from '../../src/constants/theme';
import { Txt, Type } from '../../src/components/ui';
import { findByBarcode } from '../../src/services/inventory';
import { getDb } from '../../src/database/client';
import { uid, nowIso } from '../../src/utils/helpers';
import type { InventoryItem } from '../../src/types/inventory';

function StatBox({ label, value, bg, labelColor, valueColor }: { label: string; value: string; bg: string; labelColor: string; valueColor: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: 8, padding: 12, gap: 4 }}>
      <Txt style={[Type.stat11, { color: labelColor, textTransform: 'uppercase' }]}>{label}</Txt>
      <Txt style={[Type.name15, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Txt>
    </View>
  );
}

export default function Scan() {
  const [perm, requestPerm] = useCameraPermissions();
  const [locked, setLocked] = useState(false);
  const [torch, setTorch] = useState(false);
  const [mode, setMode] = useState<'barcode' | 'qr'>('barcode');
  const [found, setFound] = useState<InventoryItem | null>(null);
  const [elapsed, setElapsed] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  // Reset scan state every time the tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setFound(null);
      setLocked(false);
    }, []),
  );

  useEffect(() => {
    if (perm && !perm.granted && perm.canAskAgain) requestPerm();
  }, [perm, requestPerm]);

  const goBack = () => {
    // Scan is a tab — no stack to pop. Go to inventory tab.
    router.replace('/(tabs)/inventory');
  };

  const handleCode = async (data: string) => {
    if (locked || found) return;
    setLocked(true);
    try {
      const item = await findByBarcode(data);
      const d = await getDb();
      await d.runAsync(
        `INSERT INTO activity (id,action,item_id,item_name,timestamp,metadata) VALUES (?,?,?,?,?,?)`,
        [uid('act'), item ? 'barcode_scanned' : 'barcode_not_found', item?.id ?? null, item?.name ?? data, nowIso(), data],
      );
      if (item) {
        setFound(item);
        setElapsed('1 sec ago'); // spec copy for the drawer timestamp
      } else {
        Alert.alert('Item not found', `No item matches "${data}".`, [
          { text: 'Add Item', onPress: () => router.push({ pathname: '/item/new', params: { barcode: data } }) },
          { text: 'Manual Entry', onPress: () => router.push({ pathname: '/item/new', params: { barcode: data } }) },
          { text: 'Scan again', onPress: () => setLocked(false) },
        ]);
      }
    } catch {
      /* keep scanning */
    } finally {
      setTimeout(() => setLocked(false), 1500);
    }
  };

  const enterCode = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Enter Code',
        'Type a barcode or QR code to look it up',
        (text?: string) => {
          const v = text?.trim();
          if (v) handleCode(v);
        },
        'plain-text',
      );
    } else {
      // Alert.prompt is iOS-only — keep the existing manual-entry fallback.
      router.push('/item/new');
    }
  };

  if (!perm) {
    return (
      <View style={[styles.root, styles.permCenter, { paddingTop: insets.top + 24 }]}>
        <ActivityIndicator color="#2563EB" />
        <Txt style={[Type.body13, { color: '#94A3B8' }]}>Requesting camera…</Txt>
      </View>
    );
  }

  if (!perm.granted) {
    return (
      <View style={[styles.root, styles.permCenter, { paddingTop: insets.top + 24 }]}>
        <Txt style={[Type.cardTitle16b, { color: '#F8FAFC' }]}>Camera access needed</Txt>
        <Txt style={[Type.body13, { color: '#94A3B8', textAlign: 'center' }]}>
          Allow camera access to scan barcodes and QR codes. You can still add items manually.
        </Txt>
        <Pressable onPress={requestPerm} style={styles.permBtn} accessibilityRole="button" accessibilityLabel="Grant camera permission">
          <Txt style={styles.permBtnText}>{perm.canAskAgain ? 'Grant permission' : 'Open settings'}</Txt>
        </Pressable>
        <Pressable onPress={() => router.push('/item/new')} style={[styles.permBtn, styles.permBtnGhost]} accessibilityRole="button" accessibilityLabel="Manual entry">
          <Txt style={styles.permBtnText}>Manual entry</Txt>
        </Pressable>
      </View>
    );
  }

  const isBarcode = mode === 'barcode';

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'itf14', 'codabar'],
        }}
        onBarcodeScanned={locked || found ? undefined : ({ data }) => handleCode(data)}
      />

      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* camera-header — height 56, padding 0 20 */}
        <View style={styles.header}>
          <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Go back" hitSlop={8}>
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
          <Txt style={[Type.bold18, { color: '#FFFFFF' }]}>{isBarcode ? 'Scan Barcode' : 'Scan QR Code'}</Txt>
          <View style={{ width: 24, height: 24 }} />
        </View>

        {/* viewfinder-scanner-zone — height 320, centered */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Pressable
            onPress={() => setMode(isBarcode ? 'qr' : 'barcode')}
            accessibilityRole="button"
            accessibilityLabel={isBarcode ? 'Switch to QR code scanning' : 'Switch to barcode scanning'}
            style={styles.zone}
          >
            {isBarcode ? (
              <View style={styles.barcodeFrame}>
                <View style={styles.laser} />
              </View>
            ) : (
              <View style={styles.qrFrame} />
            )}
            <Txt style={[Type.medium13, { color: '#FFFFFF', marginTop: 16 }]}>
              {isBarcode ? 'Place the barcode inside the frame' : 'Align QR code within the frame'}
            </Txt>
          </Pressable>
        </View>

        {/* quick-tools — padding 0 40 */}
        <View style={[styles.tools, { paddingBottom: found ? 0 : insets.bottom + 16 }]}>
          <Pressable
            onPress={() => setTorch((t) => !t)}
            accessibilityRole="button"
            accessibilityLabel="Toggle flashlight"
            accessibilityState={{ selected: torch }}
            style={styles.glass}
          >
            <Zap size={20} color={torch ? '#F59E0B' : '#FFFFFF'} strokeWidth={2} />
          </Pressable>
          <Pressable onPress={enterCode} accessibilityRole="button" accessibilityLabel="Enter code manually" hitSlop={8}>
            <Txt style={[Type.label14, { color: '#FFFFFF', textDecorationLine: 'underline' }]}>Enter Code</Txt>
          </Pressable>
          <Pressable
            onPress={() => router.push('/item/new')}
            accessibilityRole="button"
            accessibilityLabel="Enter item manually"
            style={styles.glass}
          >
            <ImageIcon size={20} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>

        {/* bottom-drawer-sheet — radius 24 24 0 0, shadow 0 -4 16 rgba(15,23,42,.25) */}
        {found ? (
          <View style={[styles.drawer, { backgroundColor: colors.card }, Shadows.sheet as ViewStyle]}>
            <View style={{ alignItems: 'center', paddingBottom: 4 }}>
              <View style={[styles.grabber, { backgroundColor: colors.borderStrong }]} />
            </View>

            <View style={styles.drawerHead}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <CircleCheck size={18} color={colors.success} strokeWidth={2} />
                <Txt style={[Type.cardTitle16b, { color: colors.text }]}>Item Found</Txt>
              </View>
              <Txt style={[Type.field13, { color: colors.placeholder }]}>{elapsed}</Txt>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={[styles.photo, { backgroundColor: colors.infoBg }]}>
                <Package size={26} color={colors.primary} strokeWidth={2} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Txt style={[styles.drawerName, { color: colors.text }]} numberOfLines={1}>
                  {found.name}
                </Txt>
                <Txt style={[Type.body13, { color: '#475569' }]}>SKU: {found.sku}</Txt>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <StatBox
                label="Quantity"
                value={`${found.quantity} ${found.unit || 'units'}`}
                bg={colors.secondaryBg}
                labelColor={colors.placeholder}
                valueColor={colors.text}
              />
              <StatBox
                label="Location"
                value={found.location}
                bg={colors.secondaryBg}
                labelColor={colors.placeholder}
                valueColor={colors.text}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 12, paddingBottom: 12 }}>
              <Pressable
                onPress={() => {
                  const id = found.id;
                  setFound(null);
                  router.push(`/item/${id}`);
                }}
                accessibilityRole="button"
                accessibilityLabel="View Item"
                style={({ pressed }) => [styles.actionBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
              >
                <Txt style={[Type.label14, { color: '#FFFFFF' }]}>View Item</Txt>
              </Pressable>
              <Pressable
                onPress={() => {
                  const id = found.id;
                  setFound(null);
                  router.push({ pathname: '/item/edit', params: { id } });
                }}
                accessibilityRole="button"
                accessibilityLabel="Update Stock"
                style={({ pressed }) => [styles.actionBtn, { borderWidth: 1, borderColor: colors.borderStrong, opacity: pressed ? 0.85 : 1 }]}
              >
                <Txt style={[Type.label14, { color: colors.text }]}>Update Stock</Txt>
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B0F19' },
  permCenter: { alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 24 },
  permBtn: {
    alignSelf: 'stretch',
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permBtnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#CBD5E1' },
  permBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zone: { height: 320, alignItems: 'center', justifyContent: 'center' },
  barcodeFrame: {
    width: 280,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  laser: { width: 260, height: 2, backgroundColor: '#EF4444' },
  qrFrame: { width: 200, height: 200, borderRadius: 24, borderWidth: 3, borderColor: '#2563EB' },
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 8,
  },
  glass: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawer: {
    padding: 24,
    gap: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  grabber: { width: 36, height: 4, borderRadius: 2 },
  drawerHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  photo: { width: 64, height: 64, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  drawerName: { fontSize: 15, fontWeight: '800' },
  actionBtn: { flex: 1, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
