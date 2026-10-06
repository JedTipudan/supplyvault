import React, { useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Image as ImageIcon, Camera, Folder } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { BottomTabBar } from '../../src/components/TabBar';
import { Txt, Type } from '../../src/components/ui';
import { recognizeImage, setRecognitionProvider, OnlineHeuristicProvider, OfflineUnavailableProvider } from '../../src/services/ai';
import { isOnline } from '../../src/services/sync';

function displayName(a: ImagePicker.ImagePickerAsset): string {
  if (a.fileName) return a.fileName;
  const last = (a.uri.split('/').pop() ?? 'image.jpg').split('?')[0];
  return decodeURIComponent(last);
}

function sizeLine(a: ImagePicker.ImagePickerAsset): string {
  const mb = a.fileSize ? `${(a.fileSize / (1024 * 1024)).toFixed(1)} MB • ` : '';
  return `${mb}Uploaded just now`;
}

/** Figma `09-upload-image` — recognize an item from a still photo. */
export default function UploadImage() {
  const { colors } = useTheme();
  const router = useRouter();
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  const analyze = async (uri: string) => {
    setBusy(true);
    setProgress(4);
    stopTimer();
    timer.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 8 : p));
    }, 140);
    try {
      const online = await isOnline();
      setRecognitionProvider(online ? new OnlineHeuristicProvider() : new OfflineUnavailableProvider());
      const r = await recognizeImage(uri);
      stopTimer();
      setProgress(100);
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
      // Recognition failure → Figma `26-error` presentation.
      stopTimer();
      router.push({
        pathname: '/ai/result',
        params: { failed: '1', message: String(e?.message ?? '') },
      });
    } finally {
      stopTimer();
      setBusy(false);
    }
  };

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
      if (res.canceled) return;
      const chosen = res.assets[0];
      if (!chosen) return;
      setAsset(chosen);
      analyze(chosen.uri);
    } catch (e: any) {
      Alert.alert('Image failed', String(e?.message ?? e));
    }
  };

  const openPicker = () => {
    Alert.alert('Add image', 'Take a photo or choose an image.', [
      { text: 'Take Photo', onPress: () => pick(true) },
      { text: 'Choose Image', onPress: () => pick(false) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <Screen bottomSpace>
      <ScrollView
        style={s.flex}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header — height 56, padding 0 / 20 */}
        <View style={s.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
          >
            <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
          </Pressable>
          <Txt style={[Type.bold18, { color: colors.text }]}>Recognize from Image</Txt>
          <View style={s.headerSpacer} />
        </View>

        <View style={s.main}>
          {/* Dashed dropzone — height 180, padding 32, gap 16 */}
          <Pressable
            onPress={openPicker}
            disabled={busy}
            accessibilityLabel="Take a photo or choose an image"
            accessibilityRole="button"
            style={({ pressed }) => [
              s.dropzone,
              {
                backgroundColor: colors.card,
                borderColor: colors.borderStrong,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={[s.dropIcon, { backgroundColor: colors.infoBg }]}>
              <ImageIcon size={22} color={colors.primary} strokeWidth={2} />
            </View>
            <Txt style={[Type.label14, { color: colors.text, fontWeight: '600' }]}>
              Take a photo or choose an image
            </Txt>
            <Txt style={[Type.caption12, { color: '#94A3B8' }]}>Supports PNG, JPG up to 10MB</Txt>
          </Pressable>

          {/* Buttons row — height 44, radius 12, gap 12 */}
          <View style={s.buttonRow}>
            <Pressable
              onPress={() => pick(true)}
              disabled={busy}
              accessibilityLabel="Take photo"
              accessibilityRole="button"
              style={({ pressed }) => [s.takeBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            >
              <Camera size={16} color="#FFFFFF" strokeWidth={2} />
              <Txt style={[Type.label14, { color: '#FFFFFF' }]}>Take Photo</Txt>
            </Pressable>
            <Pressable
              onPress={() => pick(false)}
              disabled={busy}
              accessibilityLabel="Choose from gallery"
              accessibilityRole="button"
              style={({ pressed }) => [
                s.takeBtn,
                {
                  borderWidth: 1,
                  borderColor: '#CBD5E1',
                  backgroundColor: 'transparent',
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Folder size={16} color={colors.text} strokeWidth={2} />
              <Txt style={[Type.label14, { color: colors.text }]}>Gallery</Txt>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={[s.divider, { backgroundColor: colors.border }]} />

          {/* Analyzer preview card */}
          {asset ? (
            <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={s.fileRow}>
                <View style={[s.thumb, { backgroundColor: colors.secondaryBg }]}>
                  <Image source={{ uri: asset.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                </View>
                <View style={s.fileText}>
                  <Txt style={[Type.section14, { color: colors.text }]} numberOfLines={1}>
                    {displayName(asset)}
                  </Txt>
                  <Txt style={[Type.caption12, { color: '#94A3B8' }]}>{sizeLine(asset)}</Txt>
                </View>
              </View>
              <View style={s.progressBlock}>
                <View style={s.progressLabels}>
                  <Txt style={[Type.label14, { color: colors.primary, fontSize: 12 }]}>
                    Analyzing image...
                  </Txt>
                  <Txt style={[Type.section14, { color: colors.primary, fontSize: 12 }]}>
                    {progress}%
                  </Txt>
                </View>
                <View style={[s.track, { backgroundColor: '#E2E8F0' }]}>
                  <LinearGradient
                    colors={['#2563EB', '#EC4899']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ width: `${progress}%`, height: '100%' }}
                  />
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
      <BottomTabBar active="inventory" />
    </Screen>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingBottom: 16 },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: { width: 24, height: 24 },
  main: { paddingHorizontal: 20, gap: 20 },
  dropzone: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  dropIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: { flexDirection: 'row', gap: 12 },
  takeBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  divider: { height: 1 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 16 },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 64, height: 64, borderRadius: 8, overflow: 'hidden' },
  fileText: { flex: 1, gap: 4 },
  progressBlock: { gap: 8 },
  progressLabels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
});
