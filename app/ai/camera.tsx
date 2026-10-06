import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Zap, ZapOff, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { Txt, Type, GradientCircle } from '../../src/components/ui';
import { recognizeImage, setRecognitionProvider, OnlineHeuristicProvider, OfflineUnavailableProvider } from '../../src/services/ai';
import { isOnline } from '../../src/services/sync';

/** Figma `07-ai-camera` — full-bleed dark camera screen, no bottom nav. */
export default function AICamera() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [uri, setUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(false);

  // Pink laser line inside the viewfinder bracket.
  const [laser] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(laser, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(laser, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [laser]);
  const laserY = laser.interpolate({ inputRange: [0, 1], outputRange: [-100, 100] });

  const pick = async (camera: boolean) => {
    try {
      const perm = camera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission denied', 'Allow camera/gallery access to continue.');
        return;
      }
      const res = camera
        ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
      if (!res.canceled) setUri(res.assets[0].uri);
    } catch (e: any) {
      Alert.alert('Image failed', String(e?.message ?? e));
    }
  };

  const analyze = async () => {
    if (!uri || busy) return;
    setBusy(true);
    try {
      const online = await isOnline();
      setRecognitionProvider(online ? new OnlineHeuristicProvider() : new OfflineUnavailableProvider());
      const r = await recognizeImage(uri);
      router.push({
        pathname: '/ai/result',
        params: {
          uri,
          name: r.name,
          category: r.category,
          desc: r.suggestedDescription,
          conf: String(r.confidence),
          brand: r.brand ?? '',
          type: r.type ?? '',
          color: r.color ?? '',
        },
      });
    } catch (e: any) {
      // Recognition failure → Figma `26-error` presentation on the result screen.
      router.push({
        pathname: '/ai/result',
        params: { failed: '1', message: String(e?.message ?? '') },
      });
    } finally {
      setBusy(false);
    }
  };

  const onCapture = () => {
    if (busy) return;
    if (uri) analyze();
    else pick(true);
  };

  return (
    <Screen topInset={false} style={{ backgroundColor: colors.cameraBg }}>
      <StatusBar style="light" />
      <View style={[s.root, { paddingTop: insets.top }]}>
        {/* Header — height 56, padding 0 / 20 */}
        <View style={s.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
          >
            <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
          <Txt style={[Type.bold18, { color: '#FFFFFF' }]}>AI Recognize</Txt>
          <Zap size={24} color="#FFFFFF" strokeWidth={2} />
        </View>

        <View style={s.centerArea}>
          {/* Viewfinder — height 480 */}
          <View style={s.viewfinder}>
            {uri ? (
              <>
                <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <View style={s.scrim} />
              </>
            ) : null}
            <View style={s.bracket}>
              <Animated.View style={[s.laser, { transform: [{ translateY: laserY }] }]} />
            </View>
          </View>

          {/* Instruction panel */}
          <View style={s.instructions}>
            <Txt style={s.instructionTitle}>Point your camera at an item</Txt>
            <Txt style={s.instructionSub}>SupplyVault will automatically identify &amp; categorize</Txt>
          </View>
        </View>

        {/* Control dock — padding 20 / 32 / 40 */}
        <View style={s.dock}>
          <Pressable
            onPress={() => pick(false)}
            accessibilityLabel="Choose image from gallery"
            accessibilityRole="button"
            disabled={busy}
            style={({ pressed }) => [s.glass, { opacity: pressed ? 0.7 : 1 }]}
          >
            <ImageIcon size={24} color="#FFFFFF" strokeWidth={2} />
          </Pressable>

          <Pressable
            onPress={onCapture}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel={busy ? 'Analyzing photo' : uri ? 'Analyze photo' : 'Take photo'}
            style={s.capture}
          >
            <GradientCircle size={62}>
              {busy ? <ActivityIndicator color="#FFFFFF" /> : null}
            </GradientCircle>
          </Pressable>

          <Pressable
            onPress={() => setFlash((f) => !f)}
            accessibilityLabel={flash ? 'Turn flash off' : 'Turn flash on'}
            accessibilityRole="switch"
            accessibilityState={{ checked: flash }}
            disabled={busy}
            style={({ pressed }) => [s.glass, { opacity: pressed ? 0.7 : 1 }]}
          >
            {flash ? (
              <Zap size={24} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <ZapOff size={24} color="#FFFFFF" strokeWidth={2} />
            )}
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 },
  viewfinder: {
    height: 480,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    overflow: 'hidden',
  },
  scrim: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(11, 15, 25, 0.25)' },
  bracket: {
    width: 260,
    height: 260,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  laser: { width: 240, height: 3, borderRadius: 2, backgroundColor: '#EC4899' },
  instructions: { paddingHorizontal: 40, gap: 8, alignSelf: 'stretch' },
  instructionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  instructionSub: { fontSize: 12, fontWeight: '400', color: '#94A3B8', textAlign: 'center' },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 40,
  },
  glass: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
