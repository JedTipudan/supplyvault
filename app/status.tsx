import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, TriangleAlert } from 'lucide-react-native';
import { Screen } from '../src/components/Screen';
import { BottomTabBar } from '../src/components/TabBar';
import { Txt, Type, PrimaryButton, OutlineButton } from '../src/components/ui';
import { Shadows } from '../src/constants/theme';
import { useTheme } from '../src/hooks/useTheme';

/**
 * Status / feedback screen (Figma 25-success, 26-error).
 *
 * Renders either a success or an error confirmation depending on the `tone`
 * param, with the copy passed by the caller (title / message) and action
 * buttons wired to the existing routes.
 */
export default function StatusScreen() {
  const { colors } = useTheme();
  const {
    tone,
    title,
    message,
    itemId,
    failed,
  } = useLocalSearchParams<{
    tone?: string;
    title?: string;
    message?: string;
    itemId?: string;
    failed?: string;
  }>();

  const isError = tone === 'error' || failed === '1' || failed === 'true';

  const displayTitle = isError
    ? title ?? 'Item Not Recognized'
    : title ?? 'Item Added';
  const displayMessage = isError
    ? message ?? 'Try taking a clearer photo or enter the item manually.'
    : message ?? 'Your change has been saved.';

  const ringColor = isError ? colors.dangerBg : colors.successBg;
  const innerColor = isError ? colors.danger : colors.success;

  return (
    <Screen bottomSpace>
      <View style={styles.body}>
        {/* 100 ring + 72 inner circle */}
        <View
          accessibilityRole="image"
          accessibilityLabel={isError ? 'Error' : 'Success'}
          style={[styles.ring, { backgroundColor: ringColor }]}
        >
          <View style={[styles.inner, { backgroundColor: innerColor }]}>
            {isError ? (
              <TriangleAlert size={32} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <Check size={32} color="#FFFFFF" strokeWidth={3} />
            )}
          </View>
        </View>

        <Txt
          style={[
            styles.title,
            { fontSize: isError ? 20 : 22, fontWeight: '800', color: colors.text },
          ]}
        >
          {displayTitle}
        </Txt>
        <Txt
          style={[
            Type.medium14,
            { color: colors.muted, fontWeight: '400' },
            styles.message,
          ]}
        >
          {displayMessage}
        </Txt>

        <View style={styles.actions}>
          {isError ? (
            <>
              <PrimaryButton title="Try Again" onPress={() => router.back()} />
              <OutlineButton
                title="Enter Manually"
                tone="ghost"
                onPress={() => router.replace({ pathname: '/item/new', params: { mode: 'manual' } })}
              />
            </>
          ) : (
            <>
              {itemId ? (
                <PrimaryButton
                  title="View Item"
                  onPress={() => router.replace(`/item/${itemId}`)}
                />
              ) : null}
              <OutlineButton
                title="Done"
                tone="ghost"
                onPress={() => router.replace('/(tabs)')}
              />
            </>
          )}
        </View>
      </View>

      <BottomTabBar active="home" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  ring: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  inner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  title: {
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 300,
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 32,
  },
});
