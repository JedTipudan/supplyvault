/**
 * Figma `02-login` — mini-logo header, Email/Password fields, Remember me,
 * primary Sign In, OR divider and the biometric button.
 *
 * The biometric button restores the existing SecureStore session (the build
 * ships no biometric library): it re-reads `sw_token` with
 * `requireAuthentication` so the OS prompts Face ID / Touch ID / lock screen,
 * then falls back to `loadSession()` + `signIn`.
 */
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Boxes, Eye, EyeOff, Fingerprint, LockKeyhole, Mail } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { PrimaryButton, Txt, Type } from '../../src/components/ui';
import { devSignIn, loadSession } from '../../src/services/auth';
import { useAuthStore } from '../../src/store/useStores';

export default function Login() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('staff@stockwise.dev');
  const [password, setPassword] = useState('password123');
  const [reveal, setReveal] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const signIn = useAuthStore((s: any) => s.signIn);

  const onLogin = async () => {
    if (!email.includes('@')) { Alert.alert('Validation', 'Enter a valid email address'); return; }
    if (password.length < 6) { Alert.alert('Validation', 'Password must be at least 6 characters'); return; }
    setBusy(true);
    try {
      const s = await devSignIn(email);
      signIn(s.token, s.userId, s.name, s.role);
    } catch (e: any) { Alert.alert('Login failed', String(e?.message ?? e)); }
    finally { setBusy(false); }
  };

  const onBiometric = async () => {
    try {
      // Authenticated read → OS biometric/lock prompt before revealing the token.
      await SecureStore.getItemAsync('sw_token', {
        requireAuthentication: true,
        authenticationPrompt: 'Sign in to SupplyVault',
      });
      const session = await loadSession();
      if (!session) {
        Alert.alert('No saved session', 'Sign in with your email and password first to enable biometric sign-in.');
        return;
      }
      signIn(session.token, session.userId, session.name, session.role);
    } catch (e: any) {
      Alert.alert('Authentication failed', String(e?.message ?? e));
    }
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      {/* Header: 48x48 mini-logo + titles */}
      <View style={styles.header}>
        <View style={[styles.miniLogo, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LinearGradient colors={['#2563EB', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.miniLogoInner}>
            <Boxes size={18} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </View>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Txt style={[Type.screenTitle, { color: colors.text }]}>Welcome back</Txt>
          <Txt style={[Type.body14, { color: colors.muted }]}>Manage your inventory anywhere.</Txt>
        </View>
      </View>

      {/* Fields */}
      <View style={{ gap: 16 }}>
        <View style={{ gap: 6 }}>
          <Txt style={[Type.field13, { color: colors.text }]}>Email Address</Txt>
          <View style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Mail size={18} color={colors.muted} strokeWidth={2} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@stockwise.com"
              placeholderTextColor={colors.muted}
              style={[styles.inputText, { color: colors.text }]}
              accessibilityLabel="Email Address"
            />
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Txt style={[Type.field13, { color: colors.text }]}>Password</Txt>
          <View style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <LockKeyhole size={18} color={colors.muted} strokeWidth={2} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!reveal}
              autoComplete="password"
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              style={[styles.inputText, { color: reveal ? colors.text : colors.muted }]}
              accessibilityLabel="Password"
            />
            <Pressable onPress={() => setReveal((v) => !v)} hitSlop={8} accessibilityRole="button"
              accessibilityLabel={reveal ? 'Hide password' : 'Show password'}>
              {reveal ? <Eye size={18} color={colors.muted} strokeWidth={2} /> : <EyeOff size={18} color={colors.muted} strokeWidth={2} />}
            </Pressable>
          </View>
        </View>

        {/* Remember me + Forgot Password? */}
        <View style={styles.rememberRow}>
          <Pressable
            onPress={() => setRemember((v) => !v)}
            style={styles.rememberLeft}
            accessibilityRole="switch"
            accessibilityState={{ checked: remember }}
            accessibilityLabel="Remember me"
            hitSlop={8}
          >
            <View style={[styles.toggle, { backgroundColor: remember ? '#2563EB' : colors.borderStrong }]}>
              <View style={[styles.knob, { alignSelf: remember ? 'flex-end' : 'flex-start' }]} />
            </View>
            <Txt style={[Type.medium13, { color: colors.muted }]}>Remember me</Txt>
          </Pressable>
          <Link href="/(auth)/forgot" accessibilityRole="button" style={styles.forgotLink}>
            <Txt style={{ fontSize: 13, fontWeight: '600', color: '#2563EB' }}>Forgot Password?</Txt>
          </Link>
        </View>
      </View>

      {/* Actions */}
      <View style={{ gap: 16 }}>
        <PrimaryButton title={busy ? 'Signing in...' : 'Sign In'} onPress={onLogin} disabled={busy} accessibilityLabel="Sign In" />

        <View style={styles.orRow}>
          <View style={[styles.line, { backgroundColor: colors.border }]} />
          <Txt style={[Type.bold12, { color: colors.muted, fontWeight: '600' }]}>OR</Txt>
          <View style={[styles.line, { backgroundColor: colors.border }]} />
        </View>

        <Pressable
          onPress={onBiometric}
          accessibilityRole="button"
          accessibilityLabel="Sign In with Touch ID / Face ID"
          style={({ pressed }) => [
            styles.biometric,
            { borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Fingerprint size={20} color={colors.text} strokeWidth={2} />
          <Txt style={[Type.label14, { color: colors.text }]}>Sign In with Touch ID / Face ID</Txt>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, flexGrow: 1, justifyContent: 'center', gap: 32 },
  header: { alignSelf: 'stretch', alignItems: 'center', gap: 12 },
  miniLogo: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  miniLogoInner: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  input: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 48, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1 },
  inputText: { flex: 1, fontSize: 14, padding: 0, fontFamily: 'Inter_400Regular' },
  rememberRow: { flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'space-between' },
  rememberLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggle: { width: 36, height: 20, borderRadius: 10, padding: 2, flexDirection: 'row', alignItems: 'center' },
  knob: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFFFFF' },
  forgotLink: { textDecorationLine: 'none' },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1 },
  biometric: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
});
