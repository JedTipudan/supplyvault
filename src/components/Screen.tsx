import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, StyleProp, RefreshControlProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import { BottomTabBar } from './TabBar';

/**
 * Floating bottom tab bar geometry (see src/components/TabBar.tsx).
 * Content must be padded by useTabBarInset() so it clears the bar
 * AND the phone's system navigation bar (Android 3-button / gesture nav).
 */
export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_SIDE_MARGIN = 12;
export const TAB_BAR_BOTTOM_GAP = 8;

export function useTabBarInset(): number {
  const insets = useSafeAreaInsets();
  // insets.bottom = system nav bar height (gesture pill ~24, buttons ~48)
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + TAB_BAR_BOTTOM_GAP + 16;
}

interface ScreenProps {
  children: React.ReactNode;
  /** Use a ScrollView instead of a plain View. */
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Reserve space for the floating tab bar (tab screens only). */
  bottomSpace?: boolean;
  /** Apply top safe-area inset (for screens without a native header). */
  topInset?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

/**
 * Safe-area aware screen container. Fits content inside the visible screen
 * (notches, punch-hole cameras, status bar, system nav bar) automatically.
 *
 * A <BottomTabBar/> child is hoisted out of the scroll content so the bar is
 * pinned above the system navigation bar instead of scrolling with the page.
 */
export function Screen({
  children,
  scroll = false,
  style,
  contentStyle,
  bottomSpace = false,
  topInset = true,
  refreshControl,
}: ScreenProps) {
  const { colors } = useTheme();
  const bottomPad = useTabBarInset();

  const arr = React.Children.toArray(children);
  const isBar = (el: React.ReactNode): el is React.ReactElement =>
    React.isValidElement(el) && el.type === BottomTabBar;
  const bars = arr.filter(isBar);
  const content = arr.filter((el) => !isBar(el));

  return (
    <SafeAreaView
      edges={topInset ? ['top', 'left', 'right'] : ['left', 'right']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      {scroll ? (
        <ScrollView
          style={[styles.flex, style]}
          contentContainerStyle={[{ paddingBottom: bottomSpace ? bottomPad : 16 }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={[styles.flex, { backgroundColor: colors.background }, style, bottomSpace && { paddingBottom: bottomPad }]}>{content}</View>
      )}
      {bars}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
});
