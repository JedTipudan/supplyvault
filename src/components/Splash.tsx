import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Boxes } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Txt, Type } from './ui';
import { LightColors, Shadows } from '../constants/theme';

/**
 * Figma `01-splash`: logo card 100x100 (white, 1px border, radius 24, soft
 * shadow) over "SupplyVault" 800/32 + tagline 500/14, and a bottom
 * 120x4 radius-2 gradient accent (90deg #2563EB → #EC4899).
 * Rendered while the database/session restore is running.
 */
export function Splash() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, 8) + 8 }]}>
      <View style={styles.brand}>
        <View style={[styles.logo, Shadows.logo as object]}>
          <LinearGradient colors={['#2563EB', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.logoInner}>
            <Boxes size={34} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </View>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Txt style={[Type.display, { color: LightColors.text }]}>SupplyVault</Txt>
          <Txt style={{ fontSize: 14, fontWeight: '500', color: LightColors.muted, textAlign: 'center' }}>
            Know what you have. Wherever you are.
          </Txt>
        </View>
      </View>

      <View style={{ alignItems: 'center', gap: 16 }}>
        <LinearGradient
          colors={['#2563EB', '#EC4899']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.accent}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: LightColors.background, justifyContent: 'space-between', paddingHorizontal: 32, paddingTop: 0 },
  brand: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoInner: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  accent: { width: 120, height: 4, borderRadius: 2 },
});
