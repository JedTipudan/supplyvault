/**
 * StockWise AI shared UI kit — every primitive here is resolved directly from
 * docs/FIGMA_SPEC.md (Component Inventory section). Screens must compose these
 * instead of inventing new visual styles.
 */
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextProps,
  TextInput,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';
import { ChevronLeft, ChevronRight, Search, X, LayoutGrid, List, Check, TriangleAlert, PackageOpen } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { fontFamilyFor, Radius, Shadows, Spacing } from '../constants/theme';
import { useTabBarTopOffset } from './TabBar';

/* ------------------------------------------------------------------ */
/* Text — always renders in Inter with the exact Figma weight          */
/* ------------------------------------------------------------------ */

export function Txt({ style, children, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style) as { fontWeight?: string | number } | undefined;
  const family = fontFamilyFor(flat?.fontWeight);
  return (
    <Text style={[{ fontFamily: family }, style]} {...rest}>
      {children}
    </Text>
  );
}

/** Figma type scale shortcuts: style={[Type.screenTitle, { color: colors.text }]} */
export const Type = StyleSheet.create({
  screenTitle: { fontSize: 24, fontWeight: '800' }, // 800 / 24 screen titles
  bigTitle: { fontSize: 20, fontWeight: '800' }, // 800 / 20 section headers
  display: { fontSize: 32, fontWeight: '800' }, // splash wordmark
  statusTitle: { fontSize: 22, fontWeight: '800' }, // 800 / 22 full-screen status
  cardTitle16: { fontSize: 16, fontWeight: '800' }, // 800 / 16 big numbers
  bold18: { fontSize: 18, fontWeight: '700' }, // 700 / 18 camera/result headers
  cardTitle16b: { fontSize: 16, fontWeight: '700' }, // 700 / 16 card titles
  name15: { fontSize: 15, fontWeight: '700' }, // 700 / 15 row names
  section14: { fontSize: 14, fontWeight: '700' }, // 700 / 14 section titles
  rowTitle13: { fontSize: 13, fontWeight: '700' }, // 700 / 13 list titles
  bold12: { fontSize: 12, fontWeight: '700' }, // 700 / 12 statuses
  upper12: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' }, // settings group labels
  upper14: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase' }, // "SELECT THEME"
  badge11: { fontSize: 11, fontWeight: '700' }, // 700 / 11 badges
  badge9: { fontSize: 9, fontWeight: '700' }, // 700 / 9 tiny badges
  button15: { fontSize: 15, fontWeight: '600' }, // 600 / 15 button labels
  label14: { fontSize: 14, fontWeight: '600' }, // 600 / 14 UI labels
  field13: { fontSize: 13, fontWeight: '600' }, // 600 / 13 field labels
  stat11: { fontSize: 11, fontWeight: '600' }, // 600 / 11 stat labels
  nav10: { fontSize: 10, fontWeight: '600' }, // 600 / 10 tab labels
  medium14: { fontSize: 14, fontWeight: '500' }, // 500 / 14 body labels
  medium13: { fontSize: 13, fontWeight: '500' }, // 500 / 13
  body14: { fontSize: 14, fontWeight: '400' }, // 400 / 14 body
  body13: { fontSize: 13, fontWeight: '400' }, // 400 / 13 subtitles
  caption12: { fontSize: 12, fontWeight: '400' }, // 400 / 12 captions
  micro11: { fontSize: 11, fontWeight: '400' }, // 400 / 11 micro captions
  centerBody: { fontSize: 14, fontWeight: '400', textAlign: 'center' },
  link: { fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
});

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  style,
  radius = Radius.xl,
  padded = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  padded?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius },
        padded && { padding: Spacing.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Icon chip — 32/40/48/52 squares from the Figma icon-chip family. */
export function IconChip({
  icon: Icon,
  size = 32,
  bg,
  color,
  radius,
  strokeWidth = 2,
}: {
  icon: React.ComponentType<any>;
  size?: number;
  bg: string;
  color?: string;
  radius?: number;
  strokeWidth?: number;
}) {
  const r = radius ?? (size <= 32 ? Radius.md : size <= 40 ? Radius.lg : Radius.xl);
  const IconSize = Math.round(size * (size <= 32 ? 0.5 : size <= 40 ? 0.5 : 22 / 52));
  return (
    <View style={{ width: size, height: size, borderRadius: r, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={IconSize} color={color ?? '#2563EB'} strokeWidth={strokeWidth} />
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Badges & dots                                                       */
/* ------------------------------------------------------------------ */

export function Badge({
  label,
  bg,
  color,
  size = 'tiny',
  style,
}: {
  label: string;
  bg: string;
  color: string;
  size?: 'tiny' | 'role' | 'status';
  style?: StyleProp<ViewStyle>;
}) {
  const pad =
    size === 'tiny'
      ? { paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm }
      : size === 'role'
        ? { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.md }
        : { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.md };
  return (
    <View style={[pad, { backgroundColor: bg, alignSelf: 'flex-start' }, style]}>
      <Txt style={[size === 'tiny' ? Type.badge9 : Type.badge11, { color }]}>{label}</Txt>
    </View>
  );
}

export function Dot({ color, size = 6 }: { color: string; size?: number }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

export function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <View style={styles.statusPill}>
      <Dot color={color} />
      <Txt style={[Type.stat11, { color }]}>{label}</Txt>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

type BtnProps = {
  title: string;
  onPress?: () => void;
  icon?: React.ComponentType<any>;
  height?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function PrimaryButton({ title, onPress, icon: Icon, height = 48, disabled, style, accessibilityLabel }: BtnProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [
        styles.btn,
        { height, backgroundColor: colors.primary, borderRadius: Radius.xl, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {Icon ? <Icon size={16} color="#FFFFFF" strokeWidth={2} /> : null}
      <Txt style={[Type.button15, { color: '#FFFFFF' }]}>{title}</Txt>
    </Pressable>
  );
}

/** tone: gray = 1px #CBD5E1 / blue = 1.5px primary / ghost = 1.5px border */
export function OutlineButton({ title, onPress, icon: Icon, height = 48, tone = 'gray', disabled, style }: BtnProps & { tone?: 'gray' | 'blue' | 'ghost' }) {
  const { colors } = useTheme();
  const conf = {
    gray: { border: colors.borderStrong, width: 1, color: colors.text },
    blue: { border: colors.primary, width: 1.5, color: colors.primary },
    ghost: { border: colors.border, width: 1.5, color: colors.text },
  }[tone];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.btn,
        {
          height,
          borderRadius: Radius.xl,
          borderWidth: conf.width,
          borderColor: conf.border,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {Icon ? <Icon size={16} color={conf.color} strokeWidth={2} /> : null}
      <Txt style={[Type.button15, { color: conf.color, fontWeight: tone === 'blue' ? '700' : '600' }]}>{title}</Txt>
    </Pressable>
  );
}

/** Full-width pill button (empty states / offline actions): padding 12, gap 10, radius 12. */
export function PillButton({ title, onPress, icon: Icon, outline, style }: { title: string; onPress?: () => void; icon?: React.ComponentType<any>; outline?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.btn,
        {
          alignSelf: 'stretch',
          padding: Spacing.md,
          borderRadius: Radius.xl,
          gap: 10,
          backgroundColor: outline ? 'transparent' : colors.primary,
          borderWidth: outline ? 1.5 : 0,
          borderColor: colors.primary,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {Icon ? <Icon size={20} color={outline ? colors.primary : '#FFFFFF'} strokeWidth={2} /> : null}
      <Txt style={[Type.section14, { color: outline ? colors.primary : '#FFFFFF' }]}>{title}</Txt>
    </Pressable>
  );
}

export function LinkText({ title, onPress, color }: { title: string; onPress?: () => void; color?: string }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Txt style={[Type.link, { color: color ?? colors.primary }]}>{title}</Txt>
    </Pressable>
  );
}

/**
 * FAB — 56x56, primary, radius 28, blue shadow (Figma `EL-7a7cb8eb`).
 * `bottom` defaults to 16px above the *actual* tab-bar top edge (which varies
 * with the phone's system-nav inset), so the bar never covers it.
 */
export function Fab({ onPress, icon: Icon, bottom }: { onPress?: () => void; icon: React.ComponentType<any>; bottom?: number }) {
  const { colors } = useTheme();
  const barOffset = useTabBarTopOffset(16);
  const fabBottom = bottom ?? barOffset;
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Add"
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.fab,
        { bottom: fabBottom, backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
        Shadows.fab as ViewStyle,
      ]}
    >
      <Icon size={24} color="#FFFFFF" strokeWidth={2.2} />
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Headers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Screen header: padding 16/20/12, title 800/24 over subtitle 400/13,
 * optional trailing action icons (Figma `EL-98219dd2`).
 */
export function ScreenHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.screenHeader}>
      <View style={{ width: 280, gap: 4 }}>
        <Txt style={[Type.screenTitle, { color: colors.text }]}>{title}</Txt>
        {subtitle ? <Txt style={[Type.body13, { color: colors.muted }]}>{subtitle}</Txt> : null}
      </View>
      {right ? <View style={styles.headerActions}>{right}</View> : null}
    </View>
  );
}

/**
 * App bar: height 56, padding 0/20 — large title 800/24 with trailing icons,
 * OR back variant (chevron-left 24 + title 800/20).
 */
export function AppBar({
  title,
  onBack,
  right,
  subtitle,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
  subtitle?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.appBar}>
      <View style={styles.appBarSide}>
        {onBack ? (
          <Pressable onPress={onBack} accessibilityLabel="Go back" accessibilityRole="button" hitSlop={8}>
            <ChevronLeft size={24} color={colors.text} strokeWidth={2.2} />
          </Pressable>
        ) : null}
        <View style={{ gap: subtitle ? 4 : 0 }}>
          <Txt style={[subtitle ? Type.bigTitle : Type.screenTitle, { color: colors.text }]} numberOfLines={1}>
            {title}
          </Txt>
          {subtitle ? <Txt style={[Type.body13, { color: colors.muted }]}>{subtitle}</Txt> : null}
        </View>
      </View>
      {right ? <View style={styles.headerActions}>{right}</View> : null}
    </View>
  );
}

/** Square icon button used in headers (40x40 white, border, radius 10). */
export function IconButton({
  icon: Icon,
  onPress,
  size = 40,
  iconSize = 18,
  color,
  badge,
  accessibilityLabel,
}: {
  icon: React.ComponentType<any>;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  badge?: number;
  accessibilityLabel?: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: Radius.lg,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Icon size={iconSize} color={color ?? colors.text} strokeWidth={2} />
      {badge != null && badge > 0 ? (
        <View style={[styles.bellBadge, { backgroundColor: colors.danger }]}>
          <Txt style={[Type.badge9, { fontSize: 10, color: '#FFFFFF' }]}>{badge > 9 ? '9+' : badge}</Txt>
        </View>
      ) : null}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

/** Search input — height 40, radius 10, padding 0/12, gap 8, icon 16, placeholder 400/13. */
export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search items...',
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Search size={16} color={colors.muted} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={[styles.searchInput, { color: colors.text, fontFamily: 'Inter_400Regular' }]}
        accessibilityLabel={placeholder}
        returnKeyType="search"
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} accessibilityLabel="Clear search" hitSlop={8}>
          <X size={16} color={colors.muted} strokeWidth={2} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Label over input (600/13) + input (h48, radius 12, padding 0/16, gap 12). */
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Txt style={[Type.field13, { color: colors.text }]}>{label}</Txt>
      {children}
    </View>
  );
}

export function TextInputBox({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  icon: Icon,
  trailing,
  keyboardType,
  autoCapitalize,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  icon?: React.ComponentType<any>;
  trailing?: React.ReactNode;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.fieldBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {Icon ? <Icon size={18} color={colors.muted} strokeWidth={2} /> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[styles.fieldInput, { color: colors.text, fontFamily: 'Inter_400Regular' }]}
      />
      {trailing}
    </View>
  );
}

/** Grid/list segmented toggle — group radius 6, segments 28x24 radius 4. */
export function ViewToggle({
  view,
  onChange,
}: {
  view: 'grid' | 'list';
  onChange: (v: 'grid' | 'list') => void;
}) {
  const { colors } = useTheme();
  const GridIcon = LayoutGrid;
  const ListIcon = List;
  const seg = (active: boolean, Icon: React.ComponentType<any>, label: string) => (
    <Pressable
      onPress={() => onChange(label as 'grid' | 'list')}
      accessibilityLabel={`${label} view`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={{
        width: 28,
        height: 24,
        borderRadius: Radius.sm,
        backgroundColor: active ? colors.card : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon size={14} color={active ? colors.text : colors.muted} strokeWidth={2} />
    </Pressable>
  );
  return (
    <View style={[styles.toggleGroup, { backgroundColor: colors.border }]}>
      {seg(view === 'grid', GridIcon, 'grid')}
      {seg(view === 'list', ListIcon, 'list')}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Rows & sections                                                     */
/* ------------------------------------------------------------------ */

export function SectionTitle({ children, action, onAction }: { children: React.ReactNode; action?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.sectionRow}>
      <Txt style={[Type.section14, { color: colors.text }]}>{children}</Txt>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button">
          <Txt style={[Type.bold12, { color: colors.primary, fontWeight: '600' }]}>{action}</Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Settings row — padding 14, space-between, icon 18 + label 600/14, chevron 16. */
export function SettingsRow({
  icon: Icon,
  label,
  onPress,
  first = false,
  trailing,
}: {
  icon?: React.ComponentType<any>;
  label: string;
  onPress?: () => void;
  first?: boolean;
  trailing?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.settingsRow,
        first && { borderBottomWidth: 1, borderBottomColor: colors.divider },
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.settingsLeft}>
        {Icon ? <Icon size={18} color={colors.text} strokeWidth={2} /> : null}
        <Txt style={[Type.label14, { color: colors.text }]}>{label}</Txt>
      </View>
      {trailing ?? <ChevronRight size={16} color={colors.muted} strokeWidth={2} />}
    </Pressable>
  );
}

/** Wide card row — padding 16, gap 16, center (selection & location cards). */
export function WideCard({ children, style, onPress, radius = Radius.xxl }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; radius?: number }) {
  const { colors } = useTheme();
  const Comp: any = onPress ? Pressable : View;
  return (
    <Comp
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [
        styles.wideCard,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius, opacity: pressed ? 0.9 : 1 },
        Shadows.card as ViewStyle,
        style,
      ]}
    >
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Full-screen states (Figma 24/25/26)                                 */
/* ------------------------------------------------------------------ */

export function StateScreen({
  tone,
  title,
  message,
  children,
}: {
  tone: 'success' | 'error' | 'empty';
  title: string;
  message: string;
  children?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const conf = {
    success: { ring: colors.successBg, inner: colors.success, iconSize: 32 },
    error: { ring: colors.dangerBg, inner: colors.danger, iconSize: 32 },
    empty: { ring: colors.infoBg, inner: colors.primary, iconSize: 48 },
  }[tone];
  const Icon = tone === 'success' ? Check : tone === 'error' ? TriangleAlert : PackageOpen;
  return (
    <View style={styles.stateScreen}>
      <View style={[styles.stateRing, { backgroundColor: conf.ring, borderRadius: 50 }]}>
        <View style={{ width: tone === 'empty' ? 0 : 72, height: tone === 'empty' ? 0 : 72, borderRadius: 36, backgroundColor: conf.inner, alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={tone === 'empty' ? 48 : 32} color={tone === 'empty' ? conf.inner : '#FFFFFF'} strokeWidth={2} />
        </View>
        {tone === 'empty' ? <Icon size={48} color={conf.inner} strokeWidth={2} style={{ position: 'absolute' }} /> : null}
      </View>
      <View style={{ gap: 8, alignItems: 'center' }}>
        <Txt style={[tone === 'empty' ? { fontSize: 18, fontWeight: '800' } : Type.bigTitle, { color: colors.text, textAlign: 'center' }]}>{title}</Txt>
        <Txt style={[Type.centerBody, { color: colors.muted, lineHeight: 20, maxWidth: 300 }]}>{message}</Txt>
      </View>
      {children ? <View style={{ alignSelf: 'stretch', gap: 12 }}>{children}</View> : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Donut chart (home stock distribution)                               */
/* ------------------------------------------------------------------ */

export function Donut({
  data,
  size = 80,
  thickness = 8,
  centerLabel,
  centerSub,
}: {
  data: { value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const { colors } = useTheme();
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  // Precompute segment arcs (pure — no mutation during render).
  const lens = data.map((d) => (d.value / total) * circ);
  const segments = data.map((d, i) => ({
    color: d.color,
    dash: `${lens[i]} ${circ - lens[i]}`,
    offset: -lens.slice(0, i).reduce((s, l) => s + l, 0),
  }));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.border} strokeWidth={thickness} fill="none" />
          {segments.map((seg, i) => (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={seg.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={seg.dash}
              strokeDashoffset={seg.offset}
              strokeLinecap="butt"
            />
          ))}
        </G>
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        {centerLabel ? <Txt style={{ fontSize: 14, fontWeight: '800', color: colors.text }}>{centerLabel}</Txt> : null}
        {centerSub ? <Txt style={{ fontSize: 8, fontWeight: '400', color: colors.muted }}>{centerSub}</Txt> : null}
      </View>
    </View>
  );
}

/** Gradient scan button used by the bottom nav (135deg blue → pink). */
export function GradientCircle({ size = 56, children, style }: { size?: number; children?: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <LinearGradient
      colors={['#2563EB', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      {children}
    </LinearGradient>
  );
}

/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  card: { borderWidth: 1, width: '100%' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  fab: { position: 'absolute', right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  screenHeader: { flexDirection: 'row', padding: 16, paddingHorizontal: 20, paddingBottom: 12, justifyContent: 'space-between', alignItems: 'center' },
  appBar: { height: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  appBarSide: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellBadge: { position: 'absolute', right: -4, top: -2, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 3, alignItems: 'center', justifyContent: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 40, borderRadius: Radius.lg, paddingHorizontal: 12, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 13, padding: 0 },
  fieldBox: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 48, borderRadius: Radius.xl, paddingHorizontal: 16, borderWidth: 1 },
  fieldInput: { flex: 1, fontSize: 14, padding: 0 },
  toggleGroup: { flexDirection: 'row', gap: 4, padding: 2, borderRadius: Radius.md },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingsRow: { flexDirection: 'row', padding: 14, justifyContent: 'space-between', alignItems: 'center' },
  settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wideCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: Spacing.lg, borderWidth: 1 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stateScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32, paddingHorizontal: 24, paddingVertical: 60 },
  stateRing: { width: 100, height: 100, alignItems: 'center', justifyContent: 'center' },
});
