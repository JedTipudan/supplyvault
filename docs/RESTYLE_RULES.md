# Restyle Rules (for agents implementing the Figma design)

Project: `stockwise-ai` — Expo SDK 57 / React Native 0.86 / TypeScript / Expo Router.

The complete, resolved design spec is **`docs/FIGMA_SPEC.md`** (1054 lines: Design Tokens, screens `01-splash`…`26-error`, Bottom Navigation, Component Inventory). Read it **fully** before coding — it is the single source of truth.

## Shared foundation (read before writing code)

| File | Contents |
|---|---|
| `src/components/ui.tsx` | `Txt` (renders Inter — **use it for ALL text**), `Type` (type-scale presets: `Type.screenTitle` = 800/24, `Type.section14`, `Type.body13`, …), `Card`, `IconChip`, `Badge`, `Dot`, `StatusPill`, `PrimaryButton`, `OutlineButton`, `PillButton`, `LinkText`, `Fab`, `ScreenHeader`, `AppBar`, `IconButton`, `SearchInput`, `Field`, `TextInputBox`, `ViewToggle`, `SectionTitle`, `SettingsRow`, `WideCard`, `StateScreen`, `Donut`, `GradientCircle` |
| `src/components/TabBar.tsx` | `BottomTabBar` (`<BottomTabBar active="inventory" />` — static bottom nav for stack screens), `CenterScanButton` |
| `src/components/Screen.tsx` | `Screen` container — safe areas (notch/status bar/system nav). Props: `scroll`, `bottomSpace`, `contentStyle`, `refreshControl` |
| `src/constants/theme.ts` | `useTheme()` → `colors` (LightColors/DarkColors), `Radius`, `Spacing`, `FontSizes`, `Shadows` |
| `src/components/Splash.tsx` | Figma `01-splash` (already implemented — used while the app boots) |

Icons: **`lucide-react-native`** (exact Lucide names from the spec: `Bell`, `Package`, `ScanBarcode`, `Sparkles`, `ChevronLeft`, …). Gradients: **`expo-linear-gradient`** (`GradientPrimary` / `['#2563EB', '#EC4899']`).

## Rules

1. **Match the spec exactly**: verbatim copy strings, font size/weight, paddings, gaps, radii, colors, icon names, section structure. Do not simplify, redesign, or invent components that differ from the spec.
2. **Preserve all functionality**: services, zustand stores, route params, navigation, alerts, offline/sync behavior, camera/scanner logic. You may freely restructure JSX, but every handler/query currently wired must still work.
3. **Real data where the app has data** (items, categories, locations, stats, activity, sync pending). Keep the spec's labels/typography around that data. For screens with no backend (team members, sync history, mock notifications), use the spec's mock copy verbatim.
4. **No remote images**: where the design shows photos/avatars, render tinted placeholder tiles (spec tint colors) with a lucide icon or initials. No network image URLs.
5. **Fit any phone**: every screen uses the `Screen` container. Where the spec shows a bottom-nav, render `<BottomTabBar active="…" />` as the last child AND pass `bottomSpace` to `Screen`. Do **not** also add the spec's `0 20 80` bottom padding — `Screen` already reserves nav space (use 0–16px extra bottom padding).
6. **Light + dark**: colors via `useTheme().colors`. Hardcoded hex is allowed only for the spec's tint chips/badges/dark-mode overrides that the spec lists as inline colors.
7. **Accessibility**: `accessibilityLabel`/`accessibilityRole` on interactive elements, ≥44px touch targets where feasible, never color-only status (label text always present).
8. **Typecheck**: run `npx tsc --noEmit`. Fix only errors **in files you own**. Other agents edit other files concurrently — ignore and never edit files outside your list.
9. **Never edit** (owned by the coordinator): `src/constants/theme.ts`, `src/components/ui.tsx`, `src/components/TabBar.tsx`, `src/components/Screen.tsx`, `src/components/Splash.tsx`, `src/components/cards.tsx`, `src/components/inputs.tsx`, `src/components/qr.tsx`, `app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `docs/*`, `package.json`, `tsconfig.json`.
10. Screens whose spec includes iOS chrome (`status-bar`, `home-indicator`) are handled by the OS — skip them.

## Report format (final message)

- Files changed
- Spec screens implemented
- Anything you could not implement (and why)
- `npx tsc --noEmit` result for your files
