/**
 * Password recovery (no dedicated Figma frame — styled to match `02-login`).
 * The build ships no reset endpoint, so submitting shows the existing
 * "Contact your administrator…" guidance instead of pretending to send mail.
 */
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { LockKeyhole, Mail } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { Screen } from '../../src/components/Screen';
import { Field, PrimaryButton, TextInputBox, Txt, Type } from '../../src/components/ui';

export default function Forgot() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');

  const onReset = () => {
    Alert.alert('Reset password', 'Contact your administrator to reset access. Development builds use dev sign-in.');
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.header}>
        <View style={[styles.miniLogo, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <LockKeyhole size={22} color={colors.primary} strokeWidth={2} />
        </View>
        <View style={{ alignItems: 'center', gap: 4 }}>
          <Txt style={[Type.screenTitle, { color: colors.text }]}>Reset password</Txt>
          <Txt style={[Type.body14, { color: colors.muted, textAlign: 'center' }]}>
            {"Enter your email and we'll help you get back into your account."}
          </Txt>
        </View>
      </View>

      <View style={{ gap: 16 }}>
        <Field label="Email Address">
          <TextInputBox
            value={email}
            onChangeText={setEmail}
            icon={Mail}
            placeholder="you@stockwise.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Field>

        <PrimaryButton title="Reset Password" onPress={onReset} accessibilityLabel="Reset Password" />

        <View style={styles.backRow}>
          <Link href="/(auth)/login" accessibilityRole="button">
            <Txt style={{ fontSize: 13, fontWeight: '600', color: '#2563EB' }}>Back to login</Txt>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, flexGrow: 1, justifyContent: 'center', gap: 32 },
  header: { alignSelf: 'stretch', alignItems: 'center', gap: 12 },
  miniLogo: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  backRow: { alignItems: 'center' },
});
