# StockWise AI — Figma Spec

> **Source dump:** `tool_0ed0ec869001wKM2vwhlAexh6U` (Figma MCP export: `GLOBAL_VARS` → `ELEMENTS` → `NODES`).
> Design file: **"StockWise AI — Smart Inventory Management System"**, canvas **"StockWise AI — Mobile App"** `#0:1`.
> Every `layout_*`, `fill_*`, `style_*`, `effect_*` token and every `EL-*` template used by the 26 screen frames has been resolved below into concrete values.
>
> **Notation:** `fill` = horizontal fill / `flex:1` width; `hug` = content-sized; `fixed` = fixed px. Paddings are written `top right bottom left` when 4 values, `vertical horizontal` when 2, `all` when 1.
> **Text escaping:** the dump escapes literal parentheses/underscores in copy (`\\(` / `\\_` inside `NODES`, `\(` inside `ELEMENTS`). The intended UI copy has no backslashes — e.g. `In Stock (1,216 items)`, `Staff (Mike)`, `Manager (Lisa)`, `Smart Features (AI)`, `dell-latitude-photo_rev2.jpg`. Copy is quoted verbatim (unescaped) below.
> **Icons:** `IMAGE-SVG` nodes carry no fill/stroke token — the color is baked into the exported SVG. Names below are the Lucide icon names from the node names; render them with `currentColor` and color from the surrounding text context.

---

## Design Tokens

### Colors — `fill_*`

| Token | Value | Used for |
|---|---|---|
| `fill_85065e9e` | `#F8FAFC` | Light screen background (all `EL-6e3312cc` frames); also used as **text color** on dark screens |
| `fill_78125c34` | `#0F172A` | Primary text (titles, values, labels); dark home-indicator bar on light screens |
| `fill_658ab2fa` | `#FFFFFF` | Card / surface fill; button label on blue buttons; text on dark headers |
| `fill_c8fa25b1` | `#E2E8F0` | Borders & dividers (light theme), progress track |
| `fill_01b7a958` | `#2563EB` | Primary blue — buttons, active tab label, links, progress fill, dots |
| `fill_58d794a9` | `#EC4899` | Pink accent — AI strokes/badges, scan line |
| `fill_ba795e8a` | `#64748B` | Secondary text (sub-labels, captions, inactive tab labels) |
| `fill_34dc0314` | `#000000` | Splash home-indicator; "Continue Offline" button text |
| `fill_c378b97c` | `#22C55E` | Success green (dots, badges, donut segment, "Success" text) |
| `fill_9110d440` | `#EF4444` | Danger red (out-of-stock, notification bar, donut segment, "Failed") |
| `fill_13cb9f8f` | `#EFF6FF` | Light blue tint — icon chips, badges, dotted box |
| `fill_4b2e7399` | `#FEF3C7` | Amber tint — low-stock icon chips, info banner |
| `fill_041c34f7` | `#F59E0B` | Amber — low-stock accent, dots, info-banner border |
| `fill_b6bf7949` | `#FEE2E2` | Red tint — out-of-stock icon chips/badges, error ring |
| `fill_6f25f972` | `#F3E8FF` | Purple tint — category icon chip |
| `fill_37020283` | `#FCE7F3` | Pink tint — AI icon chip / AI badge |
| `fill_cd84211d` | `#DCFCE7` | Green tint — "In Stock" badge, success rings |
| `fill_a7308d45` | `#94A3B8` | Muted text (dark-theme friendly), section captions |
| `fill_dbe29f28` | `rgba(255, 255, 255, 0.1)` | Glass circular buttons on camera screens |
| `fill_e4a94f71` | `#475569` | AI-result card row labels |
| `fill_14a56e7b` | `#CBD5E1` | Secondary button borders, dashed upload border, drawer handle |
| `fill_3bc462b4` | `#F1F5F9` | Subtle surface — stat boxes, location badge, settings row divider, gray icon chips |
| `fill_e4238857` | `#FFEDD5` | Orange tint — offline illustration circle, location report icon chip |
| `fill_ea5c122a` | `#0B1120` | **Dark theme screen background** (22/23) |
| `fill_dcace0a8` | `#334155` | Dark theme borders |
| `fill_49d07232` | `#3B82F6` | Dark theme accent blue (active tab, theme preview bar) |
| `fill_cf97ac04` | `#111827` | Dark theme surface (cards, bottom nav) |
| `fill_b9ba3202` | `#78350F` | Dark amber tint (dark low-stock icon chip/badge) |
| `fill_43d6c5e4` | `IMAGE` ref `e1d427ae78b7a8a8c07e75ef16d481c2bdcf1728`, scaleMode FILL, objectFit cover | Default user avatar |
| `fill_c14833bf` | `IMAGE` ref `fa91edaf4b50834c102c9bc704a86b7ebcbbf626` | Avatar / product photo |
| `fill_34476bc1` | `IMAGE` ref `f98872d39730214026a87b8c9e60ca7633e7931c` | Avatar / product photo |
| `fill_80a925a3` | `IMAGE` ref `2aa1806e572567a957bbfea4a884c4610c497baa` | Avatar / product photo |
| `fill_ba65485a` | `IMAGE` ref `16f06a2543f215006df23ed1733f8cd9b401bec7` | Avatar / product photo |

**Inline (non-tokenized) colors appearing in nodes:**

| Value | Where |
|---|---|
| `#0B0F19` | Background of camera screens `07-ai-camera`, `10-barcode-scanner`, `11-qr-scanner` (`EL-a61e1641`) |
| `rgba(11, 15, 25, 0.25)` | Scrim over the AI-camera viewfinder photo |
| `#1E293B` | Text of the AI-result info banner (`#3:802`) |
| `#F97316` | `15-offline-mode` offline banner background |
| `#F5F3FF` | `Supplies` category icon chip |
| `#F0FDFA` | `Vehicles` category icon chip |
| `#FFF7ED` | `School Equip.` category icon chip |
| `#1E3A8A` | Dark home "Total Items" icon chip |
| `#7F1D1D` | Dark home "Out of Stock" icon chip |
| `#4D1D3C` | Dark home "AI Recognize" icon chip |
| `#F472B6` | Dark home "AI Recognize" chip stroke |
| `#064E3B` | Dark "In Stock" badge background |
| `rgba(0, 0, 0, 0)` | 24×24 transparent spacer rectangles (header right side) |

### Gradients

| Token / location | Definition |
|---|---|
| `fill_11d5d1fa` | `linear-gradient(90deg, rgba(37, 99, 235, 1) 0%, rgba(236, 72, 153, 1) 100%)` — blue → pink, left→right. Used by: splash accent bar (120×4), AI-camera capture button inner circle, bottom-nav center button on screens `08`, `09` (`EL-ef21b7f1`) |
| `EL-f63602ed` (inline) | `linear-gradient(135deg, rgba(37, 99, 235, 1) 0%, rgba(236, 72, 153, 1) 100%)` — blue → pink, top-left → bottom-right. Bottom-nav center Scan button on all other screens |

### Typography — `style_*`

All styles are **Inter**. `align` values are `LEFT`/`CENTER` (vertical is `TOP` everywhere).

| Token | Weight | Size | Style | Align | Extra | Typical usage |
|---|---|---|---|---|---|---|
| `style_17e3ca04` | 800 Extra Bold | 24 | — | LEFT | | Screen titles: `Inventory`, `Categories`, `Locations`, `Notifications`, `Sync Center`, `Activity Log`, `Reports`, `Team Management`, `Settings`, `My Inventory` |
| `style_35bf6c7f` | 800 Extra Bold | 20 | — | LEFT | | Big screen/section titles: `Good morning, Admin`, `Add Item`, `Appearance`, `Dell Latitude Laptop` (AI result) |
| `style_bd56f6bc` | 800 Extra Bold | 16 | — | LEFT | | Big numbers (`1,248`), `System Administrator` |
| `style_fb3b6625` | 800 Extra Bold | 15 | — | LEFT | | Scan-drawer item name |
| `style_5922f97a` | 800 Extra Bold | 14 | — | LEFT | | Donut center value `82%` |
| `style_7b23b663` | 800 Extra Bold | 22 | — | CENTER | | Full-screen status titles: `You are Offline`, `Item Added` |
| `style_5a40495c` | 700 Bold | 18 | — | LEFT | | Camera/detected-item headers |
| `style_781cdc5a` | 700 Bold | 16 | — | LEFT | | Card titles: `Light Mode`, `Item Found`, `How would you like to add this item?` |
| `style_43426335` | 700 Bold | 15 | — | LEFT | | Location / team member names, drawer stat values |
| `style_8d922e75` | 700 Bold | 14 | — | LEFT | | Section titles (`Quick Actions`), row titles, button labels |
| `style_7f0e5c40` | 700 Bold | 13 | — | LEFT | | Card/list titles (inventory cards, notification titles, activity author) |
| `style_f7cbe4d3` | 700 Bold | 12 | — | LEFT | | `Success`/`Failed` status, `94% confidence`, mini-card titles (`Dell Latitude`) |
| `style_f3d08554` | 700 Bold | 12 | — | LEFT | `textCase: UPPER` | Settings group labels |
| `style_eaa2436b` | 700 Bold | 11 | — | LEFT | | Small badges: `In Stock`, `Owner`, `Admin`, `Manager`, `Staff`, `Viewer` |
| `style_3d283bfd` | 700 Bold | 9 | — | LEFT | | Tiny stock badges: `In Stock`, `Low Stock`, `Out of Stock`, `AI SMART` |
| `style_0ee299fa` | 600 Semi Bold | 15 | — | LEFT | | Primary button labels (`Sign In`, `Use Information`, `Sync Now`, `View Pending Changes`) |
| `style_5dea1e0b` | 600 Semi Bold | 14 | — | LEFT | | UI labels: `9:41`, settings row labels, input/button text, `Enter Manually` |
| `style_9d3a82ea` | 600 Semi Bold | 14 | — | LEFT | `textDecoration: UNDERLINE` | Text links: `Forgot Password?`, `Enter Code`, `Try Again` |
| `style_c5d2a607` | 600 Semi Bold | 13 | — | LEFT | | Field labels, detail-row labels/values, `1 sec ago` |
| `style_9f9d6ffd` | 500 Medium | 13 | — | LEFT | | SKU line, `Remember me`, scanner hints |
| `style_d293234e` | 500 Medium | 14 | — | LEFT | | AI suggestion row labels (`Category`, `Brand`, …) |
| `style_c456853f` | 500 Medium | 12 | — | LEFT | | Donut legend, subtitle lines, banner text |
| `style_d5123ae4` | 600 Semi Bold | 11 | — | CENTER | | Quick-action labels under 52px icon chips |
| `style_42960bc5` | 600 Semi Bold | 11 | — | LEFT | | Stat card labels, `Synced`, sync stat labels |
| `style_1542b7c8` | 600 Semi Bold | 12 | — | LEFT | | Secondary blue/gray links: `View Report`, `OR`, counts, toggle labels |
| `style_b5b20e67` | 600 Semi Bold | 11 | — | LEFT | `textCase: UPPER` | Drawer stat box labels (`QUANTITY`, `LOCATION`) |
| `style_4429437a` | 600 Semi Bold | 10 | — | LEFT | | Bottom-nav tab labels |
| `style_63aa6fa3` | 500 Medium | 10 | — | LEFT | | Bottom-nav tab labels (alt/dark variant) |
| `style_d6226fef` | 400 Regular | 14 | — | LEFT | | Body / input text |
| `style_2bb8d52c` | 400 Regular | 14 | — | CENTER | | Full-screen body copy (success / error / empty state) |
| `style_defc74b3` | 400 Regular | 13 | — | LEFT | | Screen subtitles, search placeholder, activity action text |
| `style_6c8f3b2b` | 400 Regular | 13 | — | LEFT | `lineHeight: 18px` | Notification body copy |
| `style_c487cf45` | 400 Regular | 12 | — | LEFT | | Captions / sub-lines (category counts, header subtitles) |
| `style_0665b73a` | 400 Regular | 11 | — | LEFT | | Micro captions (`12 units • IT Room`, timestamps, report descriptions) |
| `style_c26b2ea4` | 400 Regular | 8 | — | LEFT | | Donut center caption `Healthy` |

**Inline (non-tokenized) text styles in nodes:**

| Node | Value |
|---|---|
| `#3:23` `"StockWise AI"` | 800 Extra Bold / 32 / LEFT |
| `#3:24` splash tagline | 500 Medium / 14 / CENTER |
| `#3:96` / `EL-f1e4657e` bell badge `"3"` | 700 Bold / 10 / LEFT, `#FFFFFF` |
| `#3:320` `"Dell Latitude Laptop"` (item details) | 800 Extra Bold / 22 / LEFT |
| `#3:754` `"Point your camera at an item"` | 500 Medium / 15 / CENTER |
| `#3:755` camera sub-line | 400 Regular / 12 / CENTER |
| `#3:786` `"AI Classification Suggestions"` | 700 Bold / 13 / UPPER / LEFT |
| `#3:1522` offline body | 400 Regular / 14 / `lineHeight 20px` / CENTER |
| `#3:1586` `"All Systems Synced"` | 800 Extra Bold / 18 / LEFT |
| `#3:2393` `"Select Theme"` | 700 Bold / 14 / UPPER / LEFT |
| `#3:2662` `"No inventory yet"` | 800 Extra Bold / 18 / CENTER |
| `#3:2762` `"Item Not Recognized"` | 800 Extra Bold / 20 / CENTER |

### Layouts — `layout_*` (containers only; 16×16 & other icon-only boxes omitted)

| Token | Resolved |
|---|---|
| `layout_d7459ef1` | `column` · justifyContent `space-between` · alignItems `stretch` · **fixed 390 × 844** (every screen frame) |
| `layout_177c5efc` | `none` (absolute/no auto-layout) · hug × hug — default TEXT wrapper |
| `layout_56d3c81c` | `none` · fill × hug — full-width hug-height text |
| `layout_5c79c5b1` | `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug — generic scroll/column body |
| `layout_e9077466` (= `layout_5c79c5b1`) | same as above — screen scroll areas |
| `layout_d5aec931` | `row` · alignSelf `stretch` · padding `16` · alignItems `center` · gap `16` · fill × hug — wide list/selection card |
| `layout_ebdfb70e` | `row` · alignSelf `stretch` · padding `16` · justifyContent `space-between` · alignItems `center` · fill × hug — theme card / stat box row |
| `layout_ec30bae9` | `column` · padding `12` · gap `8` · **fixed width 100** × hug — stat card |
| `layout_7be3ea2b` | `column` · padding `10` · alignItems `stretch` · gap `8` · fill × hug — inventory/list card |
| `layout_8043525e` | `row` · padding `0 12` · alignItems `center` · gap `8` · fill × **height 40** — search input |
| `layout_ab730573` | `row` · alignSelf `stretch` · justifyContent/alignItems `center` · fill × **height 48** — full-width button |
| `layout_167fc1f4` | `row` · alignSelf `stretch` · center/center · gap `8` · fill × **height 48** — button with icon |
| `layout_43b89e4f` | `row` · alignSelf `stretch` · padding `12 24` · center/center · gap `8` · fill × hug — padded button |
| `layout_2e180bd7` | `row` · center/center · gap `8` · fill × **height 44** — 44px button with icon |
| `layout_15654257` | `row` · center/center · fill × **height 44** — 44px button (text only) |
| `layout_e544f696` | `row` · alignSelf `stretch` · padding `12` · center/center · gap `10` · fill × hug — pill button with icon |
| `layout_60856039` | `row` · alignSelf `stretch` · padding `14` · space-between · alignItems `center` · fill × hug — settings row |
| `layout_98219dd2` (inline `EL-98219dd2`) | `row` · alignSelf `stretch` · padding `16 20 12` · space-between · center · fill × hug — screen header |
| `layout_54481dae` (inline `EL-54481dae`) | `row` · alignSelf `stretch` · padding `0 20` · space-between · center · fill × **height 56** — app bar |
| `layout_11a0e869` | `column` · center/center · **fixed 40 × 40** — notification bell wrapper |
| `layout_8066c7f2` | `row` · center/center · **fixed 32 × 32** — stat icon chip |
| `layout_26a1f280` | `row` · center/center · **fixed 48 × 48** — big icon chip |
| `layout_fc432d2f` | `row` · center/center · **fixed 52 × 52** — quick-action icon chip |
| `layout_dfbdbcec` | `row` · center/center · **fixed 40 × 40** — category/report icon chip |
| `layout_690a2f67` | `row` · center/center · **fixed 28 × 24** — grid/list toggle segment |
| `layout_36968c3a` | `row` · center/center · **fixed 44 × 44** — glass quick-tool button / square icon button |
| `layout_f6f98b83` | `row` · center/center · **fixed 64 × 64** — photo tile / green ring |
| `layout_60de0a81` | `none` · **fixed 48 × 48** — photo/avatar rectangle |
| `layout_95b8216e` | `none` · **fixed 64 × 64** — small photo rectangle |
| `layout_019a9238` | `none` · fill × **height 100** — list-card photo |
| `layout_5920d916` | `none` · fill × **height 80** — mini-card photo |
| `layout_10fb2e8d` | `none` · **fixed width 4** × fill height — notification accent bar |
| `layout_ada04cd4` | `none` · **fixed 134 × 5** — home indicator bar |
| `layout_3e71dd93` | `row` · padding `2 6` · hug × hug — tiny stock badge |
| `layout_f13f55be` | `row` · padding `2 8` · hug × hug — role badge |
| `layout_144bdfbe` | `row` · padding `2` · gap `4` · hug × hug — view toggle group |
| `layout_3c041855` | `none` · **fixed 6 × 6** — status dot |
| `layout_c58ecd0a` | `none` · **fixed 8 × 8** — legend/timeline dot |
| `layout_a111c4b6` | `none` · **fixed 24 × 24** — 24px icon / spacer |
| `layout_ff44da31` | `none` · **fixed 22 × 22** — 22px icon |
| `layout_e4b6f33f` | `none` · **fixed 16 × 16** — toggle knob / 16px icon |
| `layout_319495d9` | `column` · center/center · **absolute at (x 167, y −18)** · **fixed 56 × 56** — bottom-nav center Scan button |
| `layout_bd7d3b9e` | `none` · **absolute (0, 0)** · **fixed 80 × 80** — donut segment circle |
| `layout_b3696cbd` | `column` · padding `6` · gap `4` · **fixed 48 × 60** — mini theme preview |
| `layout_929c53a8` | `column` · padding `6` · gap `4` · **fixed 24 × 60** — split theme preview half |
| `layout_83039b2f` | `column` · alignSelf `stretch` · center/center · fill × **height 320** — scanner viewfinder zone |
| `layout_26a1f280` (see above) | 48×48 chip |
| `layout_b4d5f714` | `column` · center/center · **fixed 72 × 72** — success/error inner ring |
| `layout_6d9caf1f` | `column` · center/center · **fixed 100 × 100** — logo wrapper / icon ring |
| `layout_54481daf` — n/a | (header layout is inline, see `EL-54481dae`) |
| `layout_0a89a48c` | `none` · **fixed 20 × 4** — theme-preview accent bar |
| `layout_1d33690b` | `none` · **fixed 10 × 4** — split-preview accent bar |
| `layout_e5ae7573` | `none` · **fixed 36 × 12** — theme-preview row block |
| `layout_96fe2fca` | `none` · **fixed 16 × 12** — split-preview row block |
| `layout_10cdfab9` | `none` · **fixed 40 × 40** — avatar rectangle |
| `layout_56d3c81c` | `none` · fill × hug (see top) |

### Border radius, strokes & effects

**Radii used:** `2` (splash bar, theme accent bars), `4` (tiny badges, theme blocks, progress track, timeline dot container), `6` (small badges, toggle group), `8` (photos, stat-box, chips, previews), `10` (buttons, icon chips, history rows), `12` (default card/button/input radius), `16` (big cards, banners), `20` (bell wrapper, avatar), `22` (glass quick-tool), `24` (avatar/photo, dropzone, brackets, drawer top-left), `26` (glass circle), `27` (settings avatar), `28` (center Scan button, FAB), `31` (capture inner), `32` (green ring), `36` (inner ring), `40` (capture button), `50` (icon ring), `55` (offline circle), `99` (confidence pill), `100` (home indicator), `24 24 0 0` (bottom drawer sheet).

**Strokes:**

| Weight | Color | Where |
|---|---|---|
| `1px` | `#E2E8F0` | Default light card/input/avatar border |
| `1px` (vertical) | `#E2E8F0` | `strokeWeight "1px 0px"` on settings `profile-summary` (top & bottom only, per CSS-style shorthand) |
| top only `1px 0px 0px` | `#E2E8F0` | Bottom-nav top divider (light) |
| top only `1px 0px 0px` | `#334155` | Bottom-nav top divider (dark) |
| bottom only `0px 0px 1px` | `#F1F5F9` | Settings row divider (first row of each group) |
| `1px` | `#F1F5F9` | *(inline `EL-4a1cebaf` uses `strokes: fill_3bc462b4` with weight `0px 0px 1px`)* |
| `1px` | `#CBD5E1` | Secondary/outline buttons, dashed upload zone (solid variant) |
| `1.5px` | `#CBD5E1` + `strokeDashes 6,4` | Upload dropzone dashed border |
| `1.5px` | `#2563EB` + `strokeDashes 6,4` | Empty-state dotted box |
| `1.5px` | `#EC4899` | AI quick-action / AI select card border |
| `1.5px` | `#2563EB` | `Enter Manually`, `Add Manually` outlined buttons |
| `1.5px` | `#E2E8F0` | `Done` / `Enter Manually` ghost buttons (`EL-73e04d43`) |
| `0.5px` | `#F59E0B` | AI info banner |
| `1px` | `#E2E8F0` | Light viewfinder bracket (`10-barcode`: `#2563EB 2px`, `11-qr`: `#2563EB 3px`, `07-ai`: `#2563EB 2px`) |
| `2px` | `#E2E8F0` | Activity timeline vertical line, avatar online-dot ring is `#FFFFFF 2px` |
| `2px` / `3px` | `#2563EB` | Scanner frames |
| `3px` / `2px` | `#EC4899` / `#EF4444` | Scan laser lines |
| `4px` | `#FFFFFF` | Capture button ring |
| `2px` | `#E2E8F0` | Theme radio `Ellipse` (unselected, `EL-c9e2157c` 22×22) |

**Effects (box shadows):**

| Value | Where |
|---|---|
| `0px 8px 16px 0px rgba(15, 23, 42, 0.03)` | Splash logo wrapper |
| `0px 4px 12px 0px rgba(236, 72, 153, 0.25)` | `effect_def2e297` — bottom-nav center Scan button |
| `0px 4px 12px 0px rgba(37, 99, 235, 0.25)` | FAB (`EL-7a7cb8eb`) |
| `0px 4px 8px 0px rgba(15, 23, 42, 0.02)` | `EL-5df0c6da` select cards (06-add-item) |
| `0px 4px 8px 0px rgba(236, 72, 153, 0.06)` | `06-add-item` AI Recognize card |
| `0px 2px 8px 0px rgba(15, 23, 42, 0.07)` | AI confidence pill |
| `0px −4px 16px 0px rgba(15, 23, 42, 0.25)` | Bottom drawer sheet (scanner result) |

### Shared chrome (mentioned once per screen from here on)

- **`status-bar`** — iOS chrome, present on every screen: `row` · alignSelf `stretch` · padding `0 20` (variant `EL-60141d05` uses `0 24`) · space-between · center · fill × **height 44**. Children: `TEXT "9:41"` (`600/14`, `#0F172A`; `#FFFFFF` on dark camera screens, `#F8FAFC` on dark theme screens) + `status-icons` (`row` · gap `6` · hug) containing `ios-signal` 17×11, `ios-wifi-signal` 15×11, `ios-battery-full` 25×12. Screens 14–20 wrap the three icons in 17×17 / 15×15 / 25×25 centered frames.
- **`home-indicator-container`** — iOS chrome, present at the bottom of every screen except `07`, `10`, `11`: `row` · padding `0 0 8` · center · fill × hug, containing a **134 × 5** rectangle, radius `100`, fill `#000000` (`EL-e7bd5351`; `#0F172A` variant `EL-997b04cc`; `#FFFFFF` variant `EL-39fa3238` on dark screens).

---

## Screens

### 01-splash
- **Frame** `01-splash` `#3:9` — **390 × 844**, `column` · justifyContent `space-between` · alignItems `stretch`, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:10` (44px) at top; home indicator inside `bottom-indicator-accent`.
- `FRAME` `logo-brand-block` `#3:16` — `column` · alignSelf `stretch` · padding `0 32` · alignItems `center` · gap `24` · fill × hug
  - `FRAME` `logo-wrapper` `#3:17` — **100 × 100** `column` · center/center · fill `#FFFFFF` · border `1px #E2E8F0` · radius `24` · shadow `0 8 16 rgba(15,23,42,0.03)`
    - `IMAGE-SVG` `logo-graphic` `#3:18` — **64 × 64** (app logo mark)
  - `FRAME` `Frame` `#3:22` — `column` · alignSelf `stretch` · alignItems `center` · gap `8` · fill × hug
    - `TEXT` `#3:23` — **"StockWise AI"** — 800 / **32** / LEFT · `#0F172A`
    - `TEXT` `#3:24` — **"Know what you have. Wherever you are."** — 500 / **14** / CENTER · `#64748B` · fill × hug
- `FRAME` `bottom-indicator-accent` `#3:25` — `column` · alignSelf `stretch` · alignItems `center` · gap `16` · fill × hug
  - `RECTANGLE` `Rectangle` `#3:26` — **120 × 4** · radius `2` · gradient **`linear-gradient(90deg, #2563EB 0%, #EC4899 100%)`**
  - `FRAME` `home-indicator` `#3:27` — `row` · padding `0 0 8` · hug
    - `RECTANGLE` `#3:28` — **134 × 5** · radius `100` · `#000000`

### 02-login
- **Frame** `02-login` `#3:30` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:31` (44px) · `home-indicator-container` `#3:74`.
- `FRAME` `login-content` `#3:37` — `column` · alignSelf `stretch` · padding `0 24` · alignItems `stretch` · gap `32` · fill × hug
  - `FRAME` `Frame` `#3:38` — `column` · alignSelf `stretch` · alignItems `center` · gap `12` · fill × hug
    - `FRAME` `mini-logo` `#3:39` — **48 × 48** `row` · center/center · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
      - `IMAGE-SVG` `Frame` `#3:40` — **32 × 32** (logo mark)
    - `FRAME` `Frame` `#3:43` — `column` · alignSelf `stretch` · alignItems `center` · gap `4` · fill × hug
      - `TEXT` `#3:44` — **"Welcome back"** — 800 / **24** · `#0F172A`
      - `TEXT` `#3:45` — **"Manage your inventory anywhere."** — 400 / **14** · `#64748B`
  - `FRAME` `Frame` `#3:46` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `16` · fill × hug
    - `FRAME` `Frame` `#3:47` — `column` · alignSelf `stretch` · gap `6` · fill × hug
      - `TEXT` `#3:48` — **"Email Address"** — 600 / **13** · `#0F172A`
      - `FRAME` `Frame` `#3:49` *(input)* — `row` · alignSelf `stretch` · padding `0 16` · alignItems `center` · gap `12` · fill × **height 48** · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
        - `IMAGE-SVG` `mail` `#3:684` — **18 × 18**
        - `TEXT` `#3:51` — **"admin@stockwise.com"** — 400 / **14** · `#0F172A` · fill × hug
    - `FRAME` `Frame` `#3:52` — `column` · alignSelf `stretch` · gap `6` · fill × hug
      - `TEXT` `#3:53` — **"Password"** — 600 / **13** · `#0F172A`
      - `FRAME` `Frame` `#3:54` *(input)* — same as `#3:49` (48px, `#FFFFFF`, `1px #E2E8F0`, radius 12, padding `0 16`, gap 12)
        - `IMAGE-SVG` `lock-keyhole` `#3:645` — **18 × 18**
        - `TEXT` `#3:56` — **"••••••••••••"** — 400 / **14** · `#64748B` · fill × hug
        - `IMAGE-SVG` `eye` `#3:561` — **18 × 18**
    - `FRAME` `Frame` `#3:58` — `row` · alignSelf `stretch` · space-between · alignItems `center` · fill × hug
      - `FRAME` `Frame` `#3:59` — `row` · alignItems `center` · gap `8` · hug
        - `FRAME` `Frame` `#3:60` *(toggle, ON)* — **36 × 20** `row` · padding `2` · justifyContent `flex-end` · alignItems `center` · fill `#2563EB` · radius `10`
          - `ELLIPSE` `Ellipse` `#3:61` — **16 × 16** · `#FFFFFF`
        - `TEXT` `#3:62` — **"Remember me"** — 500 / **13** · `#64748B`
      - `TEXT` `#3:63` — **"Forgot Password?"** — 600 / **13** · `#2563EB`
  - `FRAME` `Frame` `#3:64` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `16` · fill × hug
    - `FRAME` `Frame` `#3:65` *(primary button)* — `row` · fill × **height 48** · center/center · fill `#2563EB` · radius `12`
      - `TEXT` `#3:66` — **"Sign In"** — 600 / **15** · `#FFFFFF`
    - `FRAME` `Frame` `#3:67` — `row` · alignSelf `stretch` · alignItems `center` · gap `12` · fill × hug
      - `LINE` `#3:68` — fill width × height 0 · `1px #E2E8F0`
      - `TEXT` `#3:69` — **"OR"** — 600 / **12** · `#64748B`
      - `LINE` `#3:70` — fill width × height 0 · `1px #E2E8F0`
    - `FRAME` `Frame` `#3:71` *(biometric button)* — `row` · alignSelf `stretch` · center/center · gap `8` · fill × **height 48** · border `1px #E2E8F0` · radius `12` (transparent fill)
      - `IMAGE-SVG` `fingerprint` `#3:660` — **20 × 20**
      - `TEXT` `#3:73` — **"Sign In with Touch ID / Face ID"** — 600 / **14** · `#0F172A`

### 03-home
- **Frame** `03-home` `#3:77` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:79` inside the scroll area (44px) · `home-indicator-container` `#3:204` inside `bottom-nav`.
- `FRAME` `home-scroll-area` `#3:78` — `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug (transparent)
  - `FRAME` `dashboard-header` `#3:85` — `row` · alignSelf `stretch` · padding `16 20 12` · space-between · alignItems `center` · fill × hug
    - `FRAME` `Frame` `#3:86` — `column` · gap `4` · **fixed width 280** × hug
      - `TEXT` `#3:87` — **"Good morning, Admin"** — 800 / **20** · `#0F172A`
      - `TEXT` `#3:88` — **"Here's what's happening with your inventory."** — 400 / **12** · `#64748B` · fill × hug
      - `FRAME` `Frame` `#3:89` — `row` · padding `4 0 0` · alignItems `center` · gap `4` · hug
        - `ELLIPSE` `#3:90` — **6 × 6** · `#22C55E`
        - `TEXT` `#3:91` — **"Synced"** — 600 / **11** · `#22C55E`
    - `FRAME` `Frame` `#3:92` — `row` · alignItems `center` · gap `12` · hug
      - `FRAME` `notif-wrapper` `#3:93` — **40 × 40** `column` · center/center · fill `#FFFFFF` · border `1px #E2E8F0` · radius `20`
        - `IMAGE-SVG` `bell` `#3:636` — **20 × 20**
        - `FRAME` `badge` `#3:95` — **absolute (22, 2)** · **16 × 16** `row` · center/center · fill `#EF4444` · radius `8`
          - `TEXT` `#3:96` — **"3"** — 700 / **10** · `#FFFFFF`
      - `RECTANGLE` `user-avatar` `#3:97` — **40 × 40** · image (avatar) · border `1px #E2E8F0` · radius `20`
  - `FRAME` `stat-scroll-row` `#3:98` — `row` · alignSelf `stretch` · padding `8 20` · gap `12` · fill × hug (horizontally scrollable)
    - 4 × `FRAME` `stat-0…3` — `column` · padding `12` · gap `8` · **fixed width 100** × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
      - icon chip — **32 × 32** `row` · center/center · radius `8`, bg & icon per card
      - text column — `column` · gap `2` · fill × hug: label 600 / **11** `#64748B`; value 800 / **16** `#0F172A`
      - `stat-0`: chip `#EFF6FF`, icon **`package`** 16×16 — **"Total Items"** / **"1,248"**
      - `stat-1`: chip `#FEF3C7`, icon **`alert-triangle`** — **"Low Stock"** / **"24"**
      - `stat-2`: chip `#FEE2E2`, icon **`circle-alert`** — **"Out of Stock"** / **"8"**
      - `stat-3`: chip `#F3E8FF`, icon **`grid-3x3`** — **"Categories"** / **"18"**
  - `FRAME` `Frame` `#3:123` — `column` · alignSelf `stretch` · padding `12 20 8` · gap `12` · fill × hug
    - `TEXT` `#3:124` — **"Quick Actions"** — 700 / **14** · `#0F172A`
    - `FRAME` `Frame` `#3:125` — `row` · alignSelf `stretch` · space-between · alignItems `center` · fill × hug
      - 4 × `FRAME` `Frame` — `column` · alignItems `center` · gap `6` · **fixed width 76** × hug
        - icon chip — **52 × 52** `row` · center/center · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12` · icon **22 × 22**
        - label — fill × hug · 600 / **11** / CENTER · `#0F172A`
        - `Add Item` → icon **`plus`**; `Scan` → icon **`scan-barcode`**; `AI Recognize` → icon **`sparkles`**, chip overridden to fill `#FCE7F3` + border `1.5px #EC4899`; `Import` → icon **`file-spreadsheet`**
  - `FRAME` `Frame` `#3:142` — `column` · alignSelf `stretch` · padding `12 20` · alignItems `stretch` · gap `12` · fill × hug
    - `FRAME` `Frame` `#3:143` — `row` · space-between · alignItems `center` · fill × hug
      - `TEXT` `#3:144` — **"Stock Status Distribution"** — 700 / **14** · `#0F172A`
      - `TEXT` `#3:145` — **"View Report"** — 600 / **12** · `#2563EB`
    - `FRAME` `Frame` `#3:146` *(chart card)* — `row` · alignSelf `stretch` · padding `16` · alignItems `center` · gap `16` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16`
      - `FRAME` `donut-container` `#3:147` — **80 × 80** `column` · alignItems `stretch` (children absolute)
        - 3 × `ELLIPSE` `#3:148/149/150` — **80 × 80** · absolute (0,0) · fills `#22C55E`, `#F59E0B`, `#EF4444` (donut segments; arc data not present in the dump)
        - `FRAME` `inner-percentage` `#3:151` — absolute **(24.5, 26.5)** · `column` · center · hug
          - `TEXT` `#3:152` — **"82%"** — 800 / **14** · `#0F172A`
          - `TEXT` `#3:153` — **"Healthy"** — 400 / **8** · `#64748B`
      - `FRAME` `Frame` `#3:154` — `column` · fill × hug · gap `6`
        - 3 × legend row — `row` · alignItems `center` · gap `8` · hug: dot **8 × 8** + text 500 / **12** · `#64748B`
          - **`#22C55E`** → **"In Stock (1,216 items)"** · **`#F59E0B`** → **"Low Stock (24 items)"** · **`#EF4444`** → **"Out of Stock (8 items)"**
  - `FRAME` `Frame` `#3:164` — `column` · alignSelf `stretch` · padding `8 20 20` · gap `12` · fill × hug
    - `TEXT` `#3:165` — **"Recent Activity Items"** — 700 / **14** · `#0F172A`
    - `FRAME` `recent-scroll-row` `#3:166` — `row` · alignSelf `stretch` · gap `12` · fill × hug (horizontally scrollable)
      - 3 × `FRAME` `Frame` — `column` · padding `10` · gap `8` · **fixed width 140** × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
        - `RECTANGLE` photo — fill × **height 80** · image · radius `8`
        - text column — `column` · gap `4` · fill × hug: title 700 / **12** `#0F172A`; sub 400 / **11** `#64748B`
        - badge — `row` · padding `2 6` · hug · radius `4`
        - Card 1: **"Dell Latitude"** / **"12 units • IT Room"** / badge `#DCFCE7` + text **"In Stock"** 700/9 `#22C55E`
        - Card 2: **"USB Keyboard"** / **"3 units • Storage"** / badge `#FEF3C7` + text **"Low Stock"** 700/9 `#F59E0B`
        - Card 3: **"Projector"** / **"5 units • AV Room"** / badge `#DCFCE7` + **"In Stock"**
- `FRAME` `bottom-nav` `#3:188` — see [Bottom Navigation](#bottom-navigation) (active tab: **Home**)

### 04-inventory
- **Frame** `04-inventory` `#3:207` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:209` (44px) · `home-indicator-container` `#3:298` inside `bottom-nav`.
- `FRAME` `inventory-scroll-content` `#3:208` — `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug
  - `FRAME` `inventory-header` `#3:215` — `row` · alignSelf `stretch` · padding `16 20 12` · space-between · center · fill × hug
    - `TEXT` `#3:216` — **"Inventory"** — 800 / **24** · `#0F172A`
    - `FRAME` `Frame` `#3:217` — `row` · alignItems `center` · gap `12` · hug
      - `IMAGE-SVG` `file-search` `#3:627` — **22 × 22**
      - `IMAGE-SVG` `plus-circle` `#3:633` — **22 × 22**
  - `FRAME` `Frame` `#3:220` — `column` · alignSelf `stretch` · padding `0 20 12` · alignItems `stretch` · gap `12` · fill × hug
    - `FRAME` `Frame` `#3:221` — `row` · alignSelf `stretch` · alignItems `center` · gap `12` · fill × hug
      - `FRAME` `Frame` `#3:222` *(search input)* — `row` · padding `0 12` · alignItems `center` · gap `8` · fill × **height 40** · fill `#FFFFFF` · border `1px #E2E8F0` · radius `10`
        - `IMAGE-SVG` `search` `#3:690` — **16 × 16**
        - `TEXT` `#3:224` — **"Search items..."** — 400 / **13** · `#64748B` · fill × hug
      - `FRAME` `Frame` `#3:225` *(filter button)* — **40 × 40** `row` · center/center · fill `#FFFFFF` · border `1px #E2E8F0` · radius `10`
        - `IMAGE-SVG` `sliders-horizontal` `#3:648` — **18 × 18**
    - `FRAME` `Frame` `#3:227` — `row` · alignSelf `stretch` · space-between · center · fill × hug
      - `TEXT` `#3:228` — **"Showing 6 of 128 items"** — 600 / **12** · `#64748B`
      - `FRAME` `Frame` `#3:229` *(view toggle)* — `row` · padding `2` · gap `4` · hug · fill `#E2E8F0` · radius `6`
        - `FRAME` `Frame` `#3:230` *(active segment)* — **28 × 24** `row` · center/center · fill `#FFFFFF` · radius `4` → `IMAGE-SVG` **`layout-grid`** **14 × 14**
        - `FRAME` `Frame` `#3:232` *(inactive segment)* — **28 × 24** `row` · center/center · radius `4` (transparent) → `IMAGE-SVG` **`list`** **14 × 14**
  - `FRAME` `Frame` `#3:234` — `column` · alignSelf `stretch` · padding `0 20 80` · alignItems `stretch` · gap `12` · fill × hug
    - 3 × `FRAME` `Frame` — `row` · alignSelf `stretch` · gap `12` · fill × hug, each with 2 item cards
      - 6 × `FRAME` `Frame` *(item card)* — `column` · padding `10` · alignItems `stretch` · gap `8` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
        - `RECTANGLE` photo — fill × **height 100** · image · radius `8`
        - text column — `column` · gap `4` · fill × hug: title 700 / **13** `#0F172A`; sub 400 / **11** `#64748B`; badge `row · padding 2 6 · hug · radius 4`
        - 1: **"Dell Laptop"** / **"12 units • IT Room"** / **"In Stock"** (`#DCFCE7`, 700/9 `#22C55E`)
        - 2: **"USB Keyboard"** / **"3 units • Storage Room"** / **"Low Stock"** (`#FEF3C7`, 700/9 `#F59E0B`)
        - 3: **"Projector"** / **"5 units • AV Room"** / **"In Stock"**
        - 4: **"Office Chair"** / **"8 units • Main Office"** / **"In Stock"**
        - 5: **"Printer"** / **"0 units • IT Room"** / **"Out of Stock"** (`#FEE2E2`, 700/9 `#EF4444`)
        - 6: **"Monitor"** / **"15 units • IT Room"** / **"In Stock"**
- `FRAME` `Frame` `#3:280` *(FAB)* — **absolute (314, 698)** · **56 × 56** `row` · center/center · fill `#2563EB` · radius `28` · shadow `0 4 12 rgba(37,99,235,0.25)` → `IMAGE-SVG` **`plus`** **24 × 24**
- `FRAME` `bottom-nav` `#3:282` — see [Bottom Navigation](#bottom-navigation) (active tab: **Inventory**)

### 05-item-details
- **Frame** `05-item-details` `#3:301` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:303` (44px) · `home-indicator-container` `#3:411` inside `bottom-nav`.
- `FRAME` `details-scroll-content` `#3:302` — `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug
  - `FRAME` `top-action-bar` `#3:309` — `row` · alignSelf `stretch` · padding `12 20` · space-between · center · fill × hug
    - `FRAME` `Frame` `#3:310` — `row` · alignItems `center` · gap `6` · hug
      - `IMAGE-SVG` **`chevron-left`** `#3:621` — **20 × 20**
      - `TEXT` `#3:312` — **"Inventory"** — 600 / **14** · `#2563EB`
    - `FRAME` `Frame` `#3:313` — `row` · alignItems `center` · gap `16` · hug
      - `IMAGE-SVG` **`heart`** `#3:594` — **20 × 20**
      - `IMAGE-SVG` **`pen`** `#3:615` — **20 × 20**
  - `FRAME` `Frame` `#3:316` — `row` · alignSelf `stretch` · padding `0 20 16` · fill × hug
    - `RECTANGLE` `Rectangle` `#3:317` — fill × **height 200** · image (cover) · radius `16`
  - `FRAME` `Frame` `#3:318` — `column` · alignSelf `stretch` · padding `0 20 16` · gap `8` · fill × hug
    - `FRAME` `Frame` `#3:319` — `row` · space-between · center · fill × hug
      - `TEXT` `#3:320` — **"Dell Latitude Laptop"** — 800 / **22** · `#0F172A`
      - `FRAME` `Frame` `#3:321` *(badge)* — `row` · padding `4 8` · hug · fill `#DCFCE7` · radius `6`
        - `TEXT` `#3:322` — **"In Stock"** — 700 / **11** · `#22C55E`
    - `TEXT` `#3:323` — **"SKU: ITM-00482"** — 500 / **13** · `#64748B`
  - `FRAME` `Frame` `#3:324` — `column` · alignSelf `stretch` · padding `0 20 16` · alignItems `stretch` · gap `12` · fill × hug
    - `FRAME` `Frame` `#3:325` *(detail card)* — `column` · padding `16` · alignItems `stretch` · gap `12` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16`
      - 5 × `FRAME` `Frame` — `row` · space-between · center · fill × hug
        - left group — `row` · alignItems `center` · gap `10` · hug: `IMAGE-SVG` **18 × 18** + label 600 / **13** `#64748B`
        - right value — 600 / **13** · `#0F172A`
        - **`package`** → **"Quantity"** / **"12 units"**; **`map-pin`** → **"Location"** / **"IT Room"**; **`laptop`** → **"Category"** / **"Electronics"**; **`thumbs-up`** → **"Condition"** / **"Good"**; **`truck`** → **"Supplier"** / **"Dell Philippines"**
  - `FRAME` `Frame` `#3:351` — `column` · padding `0 20 16` · gap `8` · fill × hug
    - `TEXT` `#3:352` — **"Stock Level Status"** — 700 / **13** · `#0F172A`
    - `FRAME` `Frame` `#3:353` *(card)* — `column` · padding `16` · gap `12` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16`
      - `FRAME` `Frame` `#3:354` — `row` · space-between · center · fill × hug
        - `TEXT` `#3:355` — **"Current: 12 / 20"** — 400 / **12** · `#64748B`
        - `TEXT` `#3:356` — **"60% Capacity"** — 600 / **12** · `#2563EB`
      - `FRAME` `Frame` `#3:357` *(progress track)* — `row` · alignSelf `stretch` · alignItems `stretch` · fill × **height 8** · fill `#E2E8F0` · radius `4`
        - `RECTANGLE` `Rectangle` `#3:358` — **width 191** × fill height · fill `#2563EB`
      - `FRAME` `Frame` `#3:359` — `row` · space-between · fill × hug
        - `TEXT` `#3:360` — **"Min: 5"** — 400 / **11** · `#64748B`
        - `TEXT` `#3:361` — **"Max: 20"** — 400 / **11** · `#64748B`
  - `FRAME` `Frame` `#3:362` — `row` · alignSelf `stretch` · padding `0 20 16` · gap `12` · fill × hug
    - `FRAME` `Frame` `#3:363` *(Add Stock)* — `row` · center/center · gap `8` · fill × **height 44** · fill `#2563EB` · radius `10`
      - `IMAGE-SVG` **`plus-circle`** `#3:618` — **16 × 16**
      - `TEXT` `#3:365` — **"Add Stock"** — 600 / **13** · `#FFFFFF`
    - `FRAME` `Frame` `#3:366` *(Remove)* — `row` · center/center · gap `8` · fill × **height 44** · fill `#FFFFFF` · border `1px #E2E8F0` · radius `10`
      - `IMAGE-SVG` **`minus`** `#3:639` — **16 × 16**
      - `TEXT` `#3:368` — **"Remove"** — 600 / **13** · `#0F172A`
    - `FRAME` `Frame` `#3:369` *(arrow button)* — **44 × 44** `row` · center/center · fill `#FFFFFF` · border `1px #E2E8F0` · radius `10`
      - `IMAGE-SVG` **`arrow-right`** `#3:657` — **18 × 18**
  - `FRAME` `Frame` `#3:371` — `column` · padding `0 20 16` · gap `8` · fill × hug
    - `TEXT` `#3:372` — **"Photos"** — 700 / **13** · `#0F172A`
    - `FRAME` `Frame` `#3:373` — `row` · gap `10` · hug
      - 3 × `RECTANGLE` — **64 × 64** · image · radius `8`
      - `FRAME` `Frame` `#3:377` — **64 × 64** `row` · center/center · fill `#FFFFFF` · border `1px #E2E8F0` · radius `8` → `IMAGE-SVG` **`circle-x`** **18 × 18**
  - `FRAME` `Frame` `#3:379` — `column` · alignSelf `stretch` · padding `0 20 80` · gap `12` · fill × hug
    - `TEXT` `#3:380` — **"Activity Log"** — 700 / **13** · `#0F172A`
    - `FRAME` `Frame` `#3:381` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `12` · fill × hug
      - 2 × `FRAME` `Frame` — `row` · alignSelf `stretch` · gap `12` · fill × hug
        - rail — `column` · alignItems `center` · gap `4` · **fixed width 16** × hug: dot **8 × 8** (`#2563EB` on row 1, `#64748B` on row 2); row 1 also has `LINE` **0 × 32** · `2px #E2E8F0`
        - text — `column` · gap `2` · fill × hug: title 600 / **13** `#0F172A`; sub 400 / **11** `#64748B`
        - 1: **"Quantity updated to 12 units"** / **"Today • Admin User"**
        - 2: **"Location changed from Warehouse to IT Room"** / **"Yesterday • Admin User"**
- `FRAME` `bottom-nav` `#3:395` — see [Bottom Navigation](#bottom-navigation) (active tab: **Inventory**)

### 06-add-item
- **Frame** `06-add-item` `#3:414` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:416` (44px) · `home-indicator-container` `#3:483` inside `bottom-nav`.
- `FRAME` `add-item-content` `#3:415` — `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug
  - `FRAME` `add-header` `#3:422` — `row` · alignSelf `stretch` · padding `12 20 20` · alignItems `center` · gap `16` · fill × hug
    - `IMAGE-SVG` **`chevron-left`** `#3:630` — **20 × 20**
    - `TEXT` `#3:424` — **"Add Item"** — 800 / **20** · `#0F172A`
  - `FRAME` `Frame` `#3:425` — `column` · alignSelf `stretch` · padding `0 20 24` · gap `4` · fill × hug
    - `TEXT` `#3:426` — **"How would you like to add this item?"** — 700 / **16** · `#0F172A`
    - `TEXT` `#3:427` — **"Choose automated capture, AI parsing or manual entry."** — 400 / **13** · `#64748B`
  - `FRAME` `Frame` `#3:428` — `column` · alignSelf `stretch` · padding `0 20` · alignItems `stretch` · gap `16` · fill × hug
    - 4 × `FRAME` `select-card-0…3` — `row` · alignSelf `stretch` · padding `16` · alignItems `center` · gap `16` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16` · shadow `0 4 8 rgba(15,23,42,0.02)`
      - icon chip — **48 × 48** `row` · center/center · fill `#EFF6FF` · radius `12` → icon **22 × 22**
      - text — `column` · gap `2` · fill × hug
        - title row — `row` · alignItems `center` · gap `8` · hug: title 700 / **14** `#0F172A` [+ optional badge `row · padding 2 6 · radius 4`]
        - sub — 400 / **12** · `#64748B`
      - `IMAGE-SVG` **`chevron-right`** **16 × 16**
      - `select-card-0`: chip `#EFF6FF` · icon **`barcode`** · **"Scan Barcode"** / **"Scan an item's barcode"**
      - `select-card-1`: chip `#EFF6FF` · icon **`qr-code`** · **"Scan QR Code"** / **"Use an existing QR code"**
      - `select-card-2` *(AI — overridden)*: fill `#FFFFFF` · border **`1.5px #EC4899`** · shadow `0 4 8 rgba(236,72,153,0.06)` · radius `16`; chip fill `#FCE7F3`; icon **`scan-face`**; badge fill `#FCE7F3` radius `4` with text **"AI SMART"** 700/9 `#EC4899`; title **"AI Recognize"** / sub **"Identify an item using the camera"**
      - `select-card-3`: chip `#EFF6FF` · icon **`image`** · **"Upload Image"** / **"Recognize an item from a photo"**
  - `FRAME` `Frame` `#3:463` — `column` · alignSelf `stretch` · padding `24 20 80` · alignItems `stretch` · gap `12` · fill × hug
    - `FRAME` `Frame` `#3:464` *(outline button)* — `row` · alignSelf `stretch` · center/center · gap `8` · fill × **height 48** · fill `#FFFFFF` · border **`1.5px #2563EB`** · radius `12`
      - `IMAGE-SVG` **`file-pen`** `#3:726` — **16 × 16**
      - `TEXT` `#3:466` — **"Enter Manually"** — 700 / **14** · `#2563EB`
- `FRAME` `bottom-nav` `#3:467` — see [Bottom Navigation](#bottom-navigation) (active tab: **Home**)

### 07-ai-camera
- **Frame** `07-ai-camera` `#3:739` — **390 × 844**, background **`#0B0F19`** (full-bleed camera).
- iOS chrome: `status-bar` `#3:740` (44px, `"9:41"` in `#FFFFFF`). **No bottom-nav, no home indicator.**
- `FRAME` `camera-header` `#3:746` — `row` · alignSelf `stretch` · padding `0 20` · space-between · center · fill × **height 56**
  - `IMAGE-SVG` **`arrow-left`** `#3:1158` — **24 × 24**
  - `TEXT` `#3:748` — **"AI Recognize"** — 700 / **18** · `#FFFFFF`
  - `IMAGE-SVG` **`zap`** `#3:1161` — **24 × 24**
- `FRAME` `viewfinder-container` `#3:750` — `column` · alignSelf `stretch` · center/center · fill × **height 480** · fills: `rgba(11, 15, 25, 0.25)` scrim **+** background image (ref `9f6af86b654c582c4ac4634725e48c20d5298f85`, cover)
  - `FRAME` `scanning-bracket` `#3:751` — **260 × 260** `column` · center/center · border **`2px #2563EB`** · radius `24` (transparent fill)
    - `LINE` `Line` `#3:752` — **240 × 0** · **`3px #EC4899`** (laser line)
- `FRAME` `instruction-panel` `#3:753` — `column` · alignSelf `stretch` · padding `0 40` · gap `8` · fill × hug
  - `TEXT` `#3:754` — **"Point your camera at an item"** — 500 / **15** / CENTER · `#FFFFFF`
  - `TEXT` `#3:755` — **"StockWise AI will automatically identify & categorize"** — 400 / **12** / CENTER · `#94A3B8`
- `FRAME` `control-dock` `#3:756` — `row` · alignSelf `stretch` · padding `20 32 40` · space-between · center · fill × hug
  - `FRAME` `gallery-shortcut` `#3:757` — **52 × 52** `row` · center/center · fill `rgba(255,255,255,0.1)` · radius `26` → `IMAGE-SVG` **`image`** **24 × 24**
  - `FRAME` `capture-button` `#3:759` — **80 × 80** `row` · center/center · border **`4px #FFFFFF`** · radius `40` (transparent fill)
    - `FRAME` `Frame` `#3:760` — **62 × 62** `row` · fill **`linear-gradient(90deg, #2563EB 0%, #EC4899 100%)`** · radius `31`
  - `FRAME` `flash-toggle` `#3:761` — **52 × 52** `row` · center/center · fill `rgba(255,255,255,0.1)` · radius `26` → `IMAGE-SVG` **`zap-off`** **24 × 24**

### 08-ai-result
- **Frame** `08-ai-result` `#3:764` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:765` (44px) · `home-indicator-container` `#3:826` (bar `#0F172A`) inside `bottom-nav`.
- `FRAME` `header` `#3:771` — `row` · alignSelf `stretch` · padding `0 20` · space-between · center · fill × **height 56**
  - `IMAGE-SVG` **`arrow-left`** `#3:1179` — **24 × 24**
  - `FRAME` `Frame` `#3:773` — `row` · alignItems `center` · gap `6` · hug: `IMAGE-SVG` **`sparkles`** **18 × 18** + `TEXT` **"Detected Item"** 700 / **18** · `#0F172A`
  - `RECTANGLE` `Rectangle` `#3:776` — **24 × 24** · fill `rgba(0,0,0,0)` (spacer)
- `FRAME` `result-preview` `#3:777` — `column` · alignSelf `stretch` · padding `0 20` · alignItems `stretch` · gap `16` · fill × hug
  - `FRAME` `photo-card` `#3:778` — `row` · alignSelf `stretch` · alignItems `stretch` · fill × **height 180** · background image (ref `da4690a61fd616653badb6e0c04abe083b962160`, cover) · radius `16`
    - `FRAME` `confidence-badge` `#3:779` — **absolute (12, 12)** · `row` · padding `6 10` · alignItems `center` · gap `4` · hug · fill `#FFFFFF` · radius `99` · shadow `0 2 8 rgba(15,23,42,0.07)`
      - `IMAGE-SVG` **`sparkles`** `#3:1185` — **14 × 14**
      - `TEXT` `#3:781` — **"94% confidence"** — 700 / **12** · `#EC4899`
  - `FRAME` `Frame` `#3:782` — `column` · gap `4` · fill × hug
    - `TEXT` `#3:783` — **"Dell Latitude Laptop"** — 800 / **20** · `#0F172A`
    - `TEXT` `#3:784` — **"Hardware Inventory Item"** — 500 / **13** · `#94A3B8`
  - `FRAME` `ai-suggestion-card` `#3:785` — `column` · alignSelf `stretch` · padding `16` · gap `12` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16`
    - `TEXT` `#3:786` — **"AI Classification Suggestions"** — 700 / **13** / UPPER · `#94A3B8`
    - `FRAME` `Frame` `#3:787` — `column` · alignItems `stretch` · gap `10` · fill × hug
      - 4 × `FRAME` `Frame` — `row` · space-between · center · fill × hug: label 500 / **14** `#475569`; value 700 / **14** `#0F172A`
        - **"Category"** / **"Electronics"** · **"Brand"** / **"Dell"** · **"Type"** / **"Laptop"** · **"Color"** / **"Gray"**
  - `FRAME` `info-banner` `#3:800` — `row` · alignSelf `stretch` · padding `12` · gap `10` · fill × hug · fill `#FEF3C7` · border `0.5px #F59E0B` · radius `12`
    - `IMAGE-SVG` **`alert-circle`** `#3:1188` — **16 × 16**
    - `TEXT` `#3:802` — **"These suggestions need your confirmation before saving."** — 500 / **12** · `#1E293B` · fill × hug
- `FRAME` `action-buttons-group` `#3:803` — `column` · alignSelf `stretch` · padding `0 20 20` · alignItems `stretch` · gap `12` · fill × hug
  - `FRAME` `use-btn` `#3:804` — `row` · fill × **height 48** · center/center · fill `#2563EB` · radius `12` → `TEXT` **"Use Information"** 600 / **15** `#FFFFFF`
  - `FRAME` `edit-btn` `#3:806` — `row` · fill × **height 48** · center/center · border `1px #CBD5E1` · radius `12` (transparent) → `TEXT` **"Edit Details"** 600 / **15** `#0F172A`
  - `FRAME` `link-row` `#3:808` — `row` · alignSelf `stretch` · padding `4 0 0` · center · fill × hug → `TEXT` **"Try Again"** 600 / **14** / UNDERLINE · `#2563EB`
- `FRAME` `bottom-nav` `#3:810` — see [Bottom Navigation](#bottom-navigation) (active tab: **Inventory**; center button uses the **90°** gradient variant; tab order in dump: Home, Inventory, Activity, More, center)

### 09-upload-image
- **Frame** `09-upload-image` `#3:829` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:830` (44px) · `home-indicator-container` `#3:883` (bar `#0F172A`) inside `bottom-nav`.
- `FRAME` `header` `#3:836` — `row` · padding `0 20` · space-between · center · fill × **height 56**
  - `IMAGE-SVG` **`arrow-left`** **24 × 24**
  - `TEXT` `#3:838` — **"Recognize from Image"** — 700 / **18** · `#0F172A`
  - `RECTANGLE` `Rectangle` `#3:839` — **24 × 24** · `rgba(0,0,0,0)` (spacer)
- `FRAME` `main-intake-area` `#3:840` — `column` · alignSelf `stretch` · padding `0 20` · alignItems `stretch` · gap `20` · fill × hug
  - `FRAME` `dashed-upload-dropzone` `#3:841` — `column` · alignSelf `stretch` · padding `32` · center/center · gap `16` · fill × **height 180** · fill `#FFFFFF` · border **`1.5px #CBD5E1`, dashes `6,4`** · radius `16`
    - `FRAME` `icon-circle` `#3:842` — **48 × 48** `row` · center/center · fill `#EFF6FF` · radius `24` → `IMAGE-SVG` **`image`** **22 × 22**
    - `TEXT` `#3:844` — **"Take a photo or choose an image"** — 600 / **14** · `#0F172A`
    - `TEXT` `#3:845` — **"Supports PNG, JPG up to 10MB"** — 400 / **12** · `#94A3B8`
  - `FRAME` `Frame` `#3:846` — `row` · alignSelf `stretch` · gap `12` · fill × hug
    - `FRAME` `btn-take` `#3:847` — `row` · center/center · gap `8` · fill × **height 44** · fill `#2563EB` · radius `12` → `IMAGE-SVG` **`camera`** **16 × 16** + `TEXT` **"Take Photo"** 600 / **14** `#FFFFFF`
    - `FRAME` `btn-choose` `#3:850` — `row` · center/center · gap `8` · fill × **height 44** · border `1px #CBD5E1` · radius `12` (transparent) → `IMAGE-SVG` **`folder`** **16 × 16** + `TEXT` **"Gallery"** 600 / **14** `#0F172A`
  - `LINE` `Line` `#3:853` — fill × height 0 · `1px #E2E8F0`
  - `FRAME` `analyzer-preview-card` `#3:854` — `column` · alignSelf `stretch` · padding `16` · alignItems `stretch` · gap `16` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16`
    - `FRAME` `Frame` `#3:855` — `row` · alignSelf `stretch` · alignItems `center` · gap `12` · fill × hug
      - `RECTANGLE` `Rectangle` `#3:856` — **64 × 64** · image · radius `8`
      - `FRAME` `Frame` `#3:857` — `column` · gap `4` · fill × hug
        - `TEXT` `#3:858` — **"dell-latitude-photo_rev2.jpg"** — 700 / **14** · `#0F172A`
        - `TEXT` `#3:859` — **"4.2 MB • Uploaded just now"** — 400 / **12** · `#94A3B8`
    - `FRAME` `Frame` `#3:860` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `8` · fill × hug
      - `FRAME` `Frame` `#3:861` — `row` · space-between · center · fill × hug
        - `TEXT` `#3:862` — **"Analyzing image..."** — 600 / **12** · `#2563EB`
        - `TEXT` `#3:863` — **"72%"** — 700 / **12** · `#2563EB`
      - `IMAGE-SVG` `Frame` `#3:864` *(progress bar)* — fill × **height 8** · radius `4` (gradient baked into SVG)
- `FRAME` `bottom-nav` `#3:867` — see [Bottom Navigation](#bottom-navigation) (active tab: **Inventory**; 90° gradient center)

### 10-barcode-scanner
- **Frame** `10-barcode-scanner` `#3:886` — **390 × 844**, background **`#0B0F19`**.
- iOS chrome: `status-bar` `#3:887` (44px, `"9:41"` `#FFFFFF`). **No bottom-nav, no home indicator.**
- `FRAME` `viewfinder-underlay` `#3:893` — `column` · alignSelf `stretch` · space-between · alignItems `stretch` · **fill × fill** (fills the frame)
  - `FRAME` `camera-header` `#3:894` — `row` · padding `0 20` · space-between · center · fill × **height 56**
    - `IMAGE-SVG` **`arrow-left`** **24 × 24** · `TEXT` **"Scan Barcode"** 700 / **18** `#FFFFFF` · `RECTANGLE` 24×24 `rgba(0,0,0,0)` spacer
  - `FRAME` `viewfinder-scanner-zone` `#3:898` — `column` · alignSelf `stretch` · center/center · fill × **height 320** · background image (ref `fa139594ddf5a227ea8a43dfb1f44d96221324d5`, cover)
    - `FRAME` `horizontal-barcode-frame` `#3:899` — **280 × 100** `column` · center/center · border **`2px #2563EB`** · radius `12`
      - `LINE` `Line` `#3:900` — **260 × 0** · **`2px #EF4444`**
    - `TEXT` `#3:901` — **"Place the barcode inside the frame"** — 500 / **13** · `#FFFFFF`
  - `FRAME` `quick-tools` `#3:902` — `row` · alignSelf `stretch` · padding `0 40` · space-between · center · fill × hug
    - `FRAME` `Frame` `#3:903` — **44 × 44** `row` · center/center · fill `rgba(255,255,255,0.1)` · radius `22` → `IMAGE-SVG` **`zap`** **20 × 20**
    - `TEXT` `#3:905` — **"Enter Code"** — 600 / **14** / UNDERLINE · `#FFFFFF`
    - `FRAME` `Frame` `#3:906` — **44 × 44** `row` · center/center · fill `rgba(255,255,255,0.1)` · radius `22` → `IMAGE-SVG` **`image`** **20 × 20**
  - `FRAME` `bottom-drawer-sheet` `#3:908` — `column` · alignSelf `stretch` · padding `24` · gap `16` · fill × hug · fill `#FFFFFF` · radius **`24 24 0 0`** · shadow `0 −4 16 rgba(15,23,42,0.25)`
    - `FRAME` `Frame` `#3:909` — `row` · padding `0 0 4` · center · fill × hug → `RECTANGLE` **36 × 4** · `#CBD5E1` · radius `2` (grabber)
    - `FRAME` `Frame` `#3:911` — `row` · space-between · center · fill × hug
      - `FRAME` `Frame` `#3:912` — `row` · alignItems `center` · gap `8` · hug → `IMAGE-SVG` **`check-circle`** **18 × 18** + `TEXT` **"Item Found"** 700 / **16** `#0F172A`
      - `TEXT` `#3:915` — **"1 sec ago"** — 600 / **13** · `#94A3B8`
    - `FRAME` `Frame` `#3:916` — `row` · alignSelf `stretch` · alignItems `center` · gap `12` · fill × hug
      - `RECTANGLE` `Rectangle` `#3:917` — **64 × 64** · image · radius `12`
      - `FRAME` `Frame` `#3:918` — `column` · gap `4` · fill × hug
        - `TEXT` `#3:919` — **"Dell Laptop Latitude 5420"** — 800 / **15** · `#0F172A`
        - `TEXT` `#3:920` — **"SKU: ITM-00482"** — 400 / **13** · `#475569`
    - `FRAME` `Frame` `#3:921` — `row` · alignSelf `stretch` · gap `12` · fill × hug
      - 2 × stat box — `column` · padding `12` · gap `4` · fill × hug · fill `#F1F5F9` · radius `8`
        - label 600 / **11** / UPPER · `#94A3B8`; value 700 / **15** · `#0F172A`
        - **"Quantity"** / **"12 units"** · **"Location"** / **"IT Room"**
    - `FRAME` `Frame` `#3:928` — `row` · alignSelf `stretch` · padding `0 0 12` · gap `12` · fill × hug
      - `FRAME` `view-btn` `#3:929` — `row` · center/center · fill × **height 44** · fill `#2563EB` · radius `10` → `TEXT` **"View Item"** 600 / **14** `#FFFFFF`
      - `FRAME` `update-btn` `#3:931` — `row` · center/center · fill × **height 44** · border `1px #CBD5E1` · radius `10` (transparent) → `TEXT` **"Update Stock"** 600 / **14** `#0F172A`

### 11-qr-scanner
- **Frame** `11-qr-scanner` `#3:934` — **390 × 844**, background **`#0B0F19`**.
- iOS chrome: `status-bar` `#3:935` (44px, `"9:41"` `#FFFFFF`). **No bottom-nav, no home indicator.**
- `FRAME` `viewfinder-underlay` `#3:941` — `column` · space-between · fill × fill
  - `FRAME` `camera-header` `#3:942` — padding `0 20` · h **56** → **`arrow-left`** 24×24 · `TEXT` **"Scan QR Code"** 700 / **18** `#FFFFFF` · 24×24 transparent spacer
  - `FRAME` `viewfinder-scanner-zone` `#3:946` — `column` · center/center · fill × **height 320** · background image (ref `8005b50a794b79aa9e2c0aad0d11231df788460c`, cover)
    - `FRAME` `square-qr-frame` `#3:947` — **200 × 200** `column` · center/center · border **`3px #2563EB`** · radius `24` → `IMAGE-SVG` **`plus`** **24 × 24**
    - `TEXT` `#3:949` — **"Align QR code within the frame"** — 500 / **13** · `#FFFFFF`
  - `FRAME` `quick-tools` `#3:950` — padding `0 40` · space-between · fill × hug → `zap` 20×20 in 44×44 `rgba(255,255,255,0.1)` r22 · `TEXT` **"Enter Code"** 600/14 UNDERLINE `#FFFFFF` · `image` 20×20 in 44×44 r22
  - `FRAME` `bottom-drawer-sheet` `#3:956` — `column` · padding `24` · gap `16` · fill × hug · `#FFFFFF` · radius `24 24 0 0` · shadow `0 −4 16 rgba(15,23,42,0.25)`
    - grabber row: `RECTANGLE` **36 × 4** `#CBD5E1` radius `2`
    - `FRAME` `Frame` `#3:959` — `row` · space-between · center · fill × hug → `check-circle` 18×18 + `TEXT` **"Item Found"** 700 / **16** `#0F172A` (no timestamp on this screen)
    - `FRAME` `Frame` `#3:963` — `row` · gap `12` · fill × hug → `RECTANGLE` **64 × 64** image radius `12` + column gap 4: `TEXT` **"Ergonomic Office Chair"** 800 / **15** `#0F172A`, `TEXT` **"ID: QR-OCH-902"** 400 / **13** `#475569`
    - `FRAME` `Frame` `#3:968` — `row` · gap `12` · fill × hug → 2 stat boxes (`#F1F5F9`, radius 12 padding, `padding 12`, gap 4): **"In Stock"** / **"8 chairs"** and **"Location"** / **"Main Office"**
    - `FRAME` `Frame` `#3:975` — `row` · padding `0 0 12` · gap `12` · fill × hug → `FRAME` `view-btn` `#3:976` fill × **height 44** · fill `#2563EB` · radius `10` · `TEXT` **"View Item"** 600 / **14** `#FFFFFF` (no secondary button)

### 12-categories
- **Frame** `12-categories` `#3:979` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:980` (44px) · `home-indicator-container` `#3:1060` (bar `#0F172A`) inside `bottom-nav`.
- `FRAME` `header` `#3:986` — `row` · alignSelf `stretch` · padding `0 20` · space-between · center · fill × **height 56**
  - `TEXT` `#3:987` — **"Categories"** — 800 / **24** · `#0F172A`
  - `FRAME` `Frame` `#3:988` — `row` · alignItems `center` · gap `12` · hug
    - `IMAGE-SVG` **`search`** `#3:1296` — **22 × 22**
    - `IMAGE-SVG` **`plus-circle`** `#3:1299` — **22 × 22**
- `FRAME` `categories-scroll-content` `#3:991` — `column` · alignSelf `stretch` · padding `0 20` · alignItems `stretch` · gap `12` · fill × **height 580** (fixed; scroll region)
  - 4 × `FRAME` `Frame` — `row` · alignSelf `stretch` · gap `12` · fill × hug (two cards per row)
    - 8 × `FRAME` `category-*` — `column` · padding `16` · gap `12` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16`
      - icon chip — **40 × 40** `row` · center/center · radius `10` · bg per category → `IMAGE-SVG` **20 × 20**
      - text column — `column` · gap `2` · fill × hug: name 700 / **14** `#0F172A`; count 400 / **12** `#94A3B8`
      - 1 `category-Electronics` `#3:993` — chip `#EFF6FF` · **`laptop`** · **"Electronics"** / **"342 items"**
      - 2 `category-Office Equip.` `#3:999` — chip `#DCFCE7` · **`printer`** · **"Office Equip."** / **"186 items"**
      - 3 `category-Furniture` `#3:1006` — chip `#FEF3C7` · **`armchair`** · **"Furniture"** / **"124 items"**
      - 4 `category-Tools` `#3:1012` — chip `#F1F5F9` · **`wrench`** · **"Tools"** / **"98 items"**
      - 5 `category-Supplies` `#3:1019` — chip `#F5F3FF` · **`package`** · **"Supplies"** / **"267 items"**
      - 6 `category-Vehicles` `#3:1025` — chip `#F0FDFA` · **`car`** · **"Vehicles"** / **"45 items"**
      - 7 `category-School Equip.` `#3:1032` — chip `#FFF7ED` · **`graduation-cap`** · **"School Equip."** / **"56 items"**
      - 8 `category-Other Assets` `#3:1038` — chip `#F1F5F9` · **`box`** · **"Other Assets"** / **"41 items"**
- `FRAME` `bottom-nav` `#3:1044` — see [Bottom Navigation](#bottom-navigation) (active tab: **Inventory**; center uses the **90°** gradient variant; center-scan is appended last in the dump, out of flow)

### 13-locations
- **Frame** `13-locations` `#3:1063` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:1064` (44px) · `home-indicator-container` `#3:1146` (bar `#0F172A`) inside `bottom-nav`.
- `FRAME` `header` `#3:1070` — same 56px app bar as screen 12
  - `TEXT` `#3:1071` — **"Locations"** — 800 / **24** · `#0F172A`
  - `FRAME` `Frame` `#3:1072` — `row` · gap `12` · hug → **`search`** **22 × 22** · **`plus`** **22 × 22**
- `FRAME` `locations-scroll-content` `#3:1075` — `column` · padding `0 20` · gap `12` · fill × **height 580** (fixed; scroll region)
  - 6 × `FRAME` `location-*` — `row` · alignSelf `stretch` · padding `16` · alignItems `center` · gap `16` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16`
    - icon chip — **40 × 40** `row` · center/center · fill `#EFF6FF` · radius `10` → `IMAGE-SVG` **`map-pin`** **20 × 20**
    - text column — `column` · alignItems `stretch` · gap `4` · fill × hug
      - name — 700 / **15** · `#0F172A`
      - meta row — `row` · alignSelf `stretch` · alignItems `center` · gap `8` · fill × hug: count 400 / **12** `#94A3B8` [+ optional low-stock pill]
      - low-stock pill — `row` · alignItems `center` · gap `4` · hug: `ELLIPSE` **6 × 6** `#F59E0B` + text 600 / **12** `#F59E0B`
    - `IMAGE-SVG` **`chevron-right`** `#3:1359` et al — **16 × 16**
    - 1 `location-0` `#3:1076` — **"Main Office"** / **"156 items"**
    - 2 `location-1` `#3:1084` — **"Warehouse"** / **"389 items"** + pill **"12 low stock"**
    - 3 `location-2` `#3:1095` — **"IT Room"** / **"87 items"** + pill **"5 low stock"**
    - 4 `location-3` `#3:1106` — **"Storage Room"** / **"124 items"**
    - 5 `location-4` `#3:1114` — **"AV Room"** / **"34 items"**
    - 6 `location-5` `#3:1122` — **"Equipment Room"** / **"45 items"**
- `FRAME` `bottom-nav` `#3:1130` — see [Bottom Navigation](#bottom-navigation) (active tab: **Inventory**; **90°** gradient center; center-scan appended last)

### 14-notifications
- **Frame** `14-notifications` `#3:1421` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:1423` inside `scroll-area` (variant `EL-60141d05`, padding `0 24`, icons wrapped in 17/15/25 boxes) · `home-indicator-container` `#3:1498` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `scroll-area` `#3:1422` — `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug (transparent)
  - `FRAME` `screen-header` `#3:1432` — `row` · alignSelf `stretch` · padding `16 20 12` · space-between · center · fill × hug
    - `FRAME` `header-text` `#3:1433` — `column` · **fixed width 280** · gap `4`
      - `TEXT` `#3:1434` — **"Notifications"** — 800 / **24** · `#0F172A`
      - `TEXT` `#3:1435` — **"Stay updated with your inventory health"** — 400 / **13** · `#64748B`
  - `FRAME` `notifications-list` `#3:1436` — `column` · alignSelf `stretch` · padding `8 20 20` · alignItems `stretch` · gap `12` · fill × hug
    - 4 × `FRAME` `notif-card-*` — `row` · alignSelf `stretch` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
      - accent `RECTANGLE` — **fixed width 4** × fill height · color per card
      - `FRAME` `notif-content` — `column` · padding `12` · alignItems `stretch` · gap `8` · fill × hug
        - `FRAME` `notif-title-row` — `row` · space-between · center · fill × hug
          - `FRAME` `title-left` — `row` · alignItems `center` · gap `8` · hug: icon box **16 × 16** `column`·center → icon **16 × 16** + title 700 / **14** `#0F172A`
          - timestamp — 400 / **11** · `#94A3B8`
        - body — 400 / **13** · lineHeight `18px` · `#64748B` · fill × hug
      - 1 `notif-card-1` `#3:1437` — bar `#F59E0B` · icon **`alert-triangle`** · **"Low Stock Warning"** · **"10m ago"** · **"USB Keyboard in Storage Room is running low (3 units left)."**
      - 2 `notif-card-2` `#3:1447` — bar `#EF4444` · icon **`circle-alert`** · **"Out of Stock Alert"** · **"1h ago"** · **"Printer Ink in IT Room is completely out of stock."**
      - 3 `notif-card-3` `#3:1457` — bar `#22C55E` · icon **`refresh-cw`** · **"Database Synced"** · **"3h ago"** · **"12 pending offline changes synced successfully."**
      - 4 `notif-card-4` `#3:1467` — bar `#2563EB` · icon **`calendar`** · **"Maintenance Reminder"** · **"1d ago"** · **"Projector in AV Room is scheduled for quarterly filter cleanup."**
- `FRAME` `bottom-nav` `#3:1477` — see [Bottom Navigation](#bottom-navigation) (active tab: **More**; icons wrapped in 20×20 boxes)

### 15-offline-mode
- **Frame** `15-offline-mode` `#3:1501` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:1503` inside `scroll-area` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:1563` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `scroll-area` `#3:1502` — `column` · fill × hug
  - `FRAME` `offline-banner` `#3:1512` — `row` · alignSelf `stretch` · padding `10 20` · alignItems `center` · gap `8` · fill × hug · fill **`#F97316`**
    - icon box **16 × 16** → `IMAGE-SVG` **`cloud-off`** **16 × 16**
    - `TEXT` `#3:1515` — **"Offline Mode Active • StockWise will cache changes locally"** — 700 / **13** · `#FFFFFF`
  - `FRAME` `main-illustration` `#3:1516` — `column` · alignSelf `stretch` · padding `48 32 24` · alignItems `center` · gap `24` · fill × hug
    - `FRAME` `offline-circle` `#3:1517` — **110 × 110** `row` · center/center · fill `#FFEDD5` · radius `55`
      - `FRAME` `icon-cloud-off` `#3:1518` — **48 × 48** `column` · center/center → `IMAGE-SVG` **`cloud-off`** **48 × 48**
    - `FRAME` `offline-text` `#3:1520` — `column` · alignSelf `stretch` · alignItems `center` · gap `8` · fill × hug
      - `TEXT` `#3:1521` — **"You are Offline"** — 800 / **22** / CENTER · `#0F172A`
      - `TEXT` `#3:1522` — **"You can keep scanning and editing items. Changes will automatically sync when you reconnect."** — 400 / **14** · lineHeight `20px` / CENTER · `#64748B`
  - `FRAME` `offline-stats` `#3:1523` — `column` · alignSelf `stretch` · padding `0 20` · alignItems `stretch` · gap `12` · fill × hug
    - 2 × `FRAME` `stat-box` / `stat-box-2` — `row` · alignSelf `stretch` · padding `16` · space-between · center · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
      - left group — `row` · alignItems `center` · gap `12` · hug: icon box **18 × 18** + label 600 / **14** `#0F172A`
      - `stat-box` `#3:1524` — icon **`database`** · **"Pending Changes"**; right = pill `row · padding 4 10 · hug · fill #EFF6FF · radius 8` with **"12"** 700 / **14** `#2563EB`
      - `stat-box-2` `#3:1531` — icon **`clock`** · **"Last Sync"**; right = `TEXT` **"10:42 AM"** 600 / **14** `#64748B`
  - `FRAME` `actions-group` `#3:1537` — `column` · alignSelf `stretch` · padding `20` · alignItems `stretch` · gap `12` · fill × hug
    - `FRAME` `primary-btn` `#3:1538` — `row` · alignSelf `stretch` · padding `12 24` · center/center · gap `8` · fill × hug · fill `#2563EB` · radius `10` → `TEXT` **"View Pending Changes"** 600 / **15** `#FFFFFF`
    - `FRAME` `secondary-btn` `#3:1540` — same layout · border `1px #CBD5E1` · radius `10` (transparent) → `TEXT` **"Continue Offline"** 600 / **15** `#000000`
- `FRAME` `bottom-nav` `#3:1542` — see [Bottom Navigation](#bottom-navigation) (active tab: **More**; icons wrapped in 20×20 boxes)

### 16-sync-center
- **Frame** `16-sync-center` `#3:1566` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:1568` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:1648` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `scroll-area` `#3:1567` — `column` · fill × hug
  - `FRAME` `screen-header` `#3:1577` — 16/20/12 app bar · `header-text` (280 wide, gap 4): **"Sync Center"** 800 / **24** `#0F172A` + **"Manage your cloud connectivity"** 400 / **13** `#64748B`
  - `FRAME` `sync-status-hero` `#3:1581` — `column` · alignSelf `stretch` · padding `20` · alignItems `stretch` · gap `16` · fill × hug
    - `FRAME` `status-badge-container` `#3:1582` — `column` · alignSelf `stretch` · padding `16` · alignItems `center` · gap `8` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `16`
      - `FRAME` `green-ring` `#3:1583` — **64 × 64** `row` · center/center · fill `#DCFCE7` · radius `32`
        - `FRAME` `icon-checkmark` — **32 × 32** → `IMAGE-SVG` **`check`** **32 × 32**
      - `TEXT` `#3:1586` — **"All Systems Synced"** — 800 / **18** · `#0F172A`
      - `TEXT` `#3:1587` — **"Last sync: Today at 11:24 AM"** — 400 / **13** · `#64748B`
  - `FRAME` `stats-grid` `#3:1588` — `row` · alignSelf `stretch` · padding `0 20` · gap `12` · fill × hug
    - 3 × `FRAME` `stat-col` — `column` · padding `12` · alignItems `center` · gap `4` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
      - label — 600 / **11** · `#64748B`; value — 800 / **20**
      - **"Pending"** / **"0"** `#0F172A` · **"Successful"** / **"12"** `#22C55E` · **"Failed"** / **"0"** `#EF4444`
  - `FRAME` `sync-action` `#3:1598` — `row` · alignSelf `stretch` · padding `20` · fill × hug
    - `FRAME` `sync-now-btn` `#3:1599` — `row` · padding `12 24` · center/center · gap `8` · fill × hug · fill `#2563EB` · radius `10`
      - icon box **18 × 18** → **`refresh-cw`** **18 × 18** · `TEXT` **"Sync Now"** 600 / **15** `#FFFFFF`
  - `FRAME` `history-section` `#3:1603` — `column` · alignSelf `stretch` · padding `0 20 20` · gap `12` · fill × hug
    - `TEXT` `#3:1604` — **"Sync History"** — 700 / **14** · `#0F172A`
    - `FRAME` `history-list` `#3:1605` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `12` · fill × hug
      - 3 × `FRAME` `history-*` — `row` · alignSelf `stretch` · padding `12` · space-between · center · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `10`
        - left group — `row` · alignItems `center` · gap `12` · hug: `ELLIPSE` **8 × 8** + text column (`column` · gap `2` · hug): line1 600 / **13** `#0F172A`, line2 400 / **11** `#94A3B8`
        - status — 700 / **12** (right)
        - 1 `history-1` `#3:1606` — dot `#22C55E` · **"12 items Synced"** / **"Just now"** · **"Success"** `#22C55E`
        - 2 `history-2` `#3:1613` — dot `#22C55E` · **"5 items Synced"** / **"Yesterday, 4:15 PM"** · **"Success"** `#22C55E`
        - 3 `history-3` `#3:1620` — dot `#EF4444` · **"1 item Synced"** / **"Oct 24, 09:30 AM"** · **"Failed"** `#EF4444`
- `FRAME` `bottom-nav` `#3:1627` — see [Bottom Navigation](#bottom-navigation) (active tab: **More**; icons wrapped in 20×20 boxes)

### 17-activity
- **Frame** `17-activity` `#3:1651` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:1653` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:1743` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `scroll-area` `#3:1652` — `column` · fill × hug
  - `FRAME` `screen-header` `#3:1662` — 16/20/12 app bar · **"Activity Log"** 800 / **24** `#0F172A` + **"Real-time audit of inventory events"** 400 / **13** `#64748B`
  - `FRAME` `timeline-container` `#3:1666` — `column` · alignSelf `stretch` · padding `20` · alignItems `stretch` · fill × hug (gap `0`)
    - 4 × `FRAME` `timeline-row-*` — `row` · alignSelf `stretch` · gap `16` · fill × hug
      - `LINE` `Line` (rows 1–3 only) — **absolute (24, 48)** · **0 × 48** · `2px #E2E8F0` (connector to the next row)
      - `FRAME` `avatar-column` — `column` · hug × fill → `RECTANGLE` avatar **48 × 48** · image · border `1px #E2E8F0` · radius `24`
      - `FRAME` `activity-card` — `column` · padding `0 0 24` · alignItems `stretch` · gap `6` · fill × hug
        - `FRAME` `card-inner` — `column` · alignSelf `stretch` · padding `12` · gap `4` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
          - `FRAME` `card-header` — `row` · space-between · center · fill × hug: author 700 / **13** `#0F172A`; time 400 / **11** `#94A3B8`
          - action — 400 / **13** · `#000000` · fill × hug
          - `FRAME` `location-badge` — `row` · padding `2 6` · alignItems `center` · gap `4` · hug · fill `#F1F5F9` · radius `4`
            - icon box **10 × 10** → **`map-pin`** **10 × 10** · text 600 / **10** `#64748B`
        - 1 `timeline-row-1` `#3:1667` — avatar ref `e1d427ae…` · **"Admin (You)"** / **"2m ago"** · **"added Dell Laptop"** · badge **"IT Room"**
        - 2 `timeline-row-2` `#3:1681` — avatar ref `fa91edaf…` · **"Staff (Mike)"** / **"1h ago"** · **"updated USB Keyboard"** · badge **"Storage Room"**
        - 3 `timeline-row-3` `#3:1695` — avatar ref `f98872d3…` · **"Manager (Lisa)"** / **"Yesterday"** · **"moved Projector"** · badge **"AV Room"**
        - 4 `timeline-row-4` `#3:1709` — no `LINE` · avatar ref `e1d427ae…` · **"Admin (You)"** / **"Yesterday"** · **"scanned QR Office Chair"** · badge **"Main Office"**
- `FRAME` `bottom-nav` `#3:1722` — see [Bottom Navigation](#bottom-navigation) (active tab: **Activity**; More label reverts to `#64748B`; icons wrapped in 20×20 boxes)

### 18-reports
- **Frame** `18-reports` `#3:1746` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:1748` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:1846` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `scroll-area` `#3:1747` — `column` · fill × hug
  - `FRAME` `screen-header` `#3:1757` — 16/20/12 app bar · **"Reports"** 800 / **24** `#0F172A` + **"Generate & download inventory analytics"** 400 / **13** `#64748B`
  - `FRAME` `reports-list` `#3:1761` — `column` · alignSelf `stretch` · padding `8 20 20` · alignItems `stretch` · gap `12` · fill × hug
    - 7 × `FRAME` `report-row-*` — `row` · alignSelf `stretch` · padding `12` · alignItems `center` · gap `12` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
      - `FRAME` `icon-bg` — **40 × 40** `row` · center/center · radius `10` · bg per row → icon box **20 × 20** → `IMAGE-SVG` **20 × 20**
      - `FRAME` `report-text` — `column` · alignItems `stretch` · gap `2` · fill × hug: title 700 / **14** `#0F172A`; sub 400 / **11** `#64748B`
      - `IMAGE-SVG` **`chevron-right`** **16 × 16**
      - 0 `#3:1762` — chip `#EFF6FF` · **`pie-chart`** · **"Inventory Summary"** / **"Overview of valuation, quantities & categories"**
      - 1 `#3:1771` — chip `#F3E8FF` · **`arrow-up-right`** · **"Stock Movement"** / **"Track items checked-in, checked-out & moved"**
      - 2 `#3:1780` — chip `#FEF3C7` · **`alert-triangle`** · **"Low Stock Analysis"** / **"Detailed listing of items near minimum limits"**
      - 3 `#3:1789` — chip `#FEE2E2` · **`circle-alert`** · **"Out of Stock Log"** / **"Urgent view of depleted items requiring reorder"**
      - 4 `#3:1798` — chip `#FCE7F3` · **`grid-3x3`** · **"Category Report"** / **"Distribution and health of assets per category"**
      - 5 `#3:1807` — chip `#FFEDD5` · **`map-pin`** · **"Location Report"** / **"Asset allocations across various physical rooms"**
      - 6 `#3:1816` — chip `#DCFCE7` · **`users`** · **"User Activity Audit"** / **"Complete timeline breakdown per team member"**
- `FRAME` `bottom-nav` `#3:1825` — see [Bottom Navigation](#bottom-navigation) (active tab: **More**; icons wrapped in 20×20 boxes)

### 19-team
- **Frame** `19-team` `#3:1849` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:1851` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:1937` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `scroll-area` `#3:1850` — `column` · fill × hug
  - `FRAME` `screen-header` `#3:1860` — 16/20/12 app bar · **"Team Management"** 800 / **24** `#0F172A` + **"Manage members and access levels"** 400 / **13** `#64748B`
  - `FRAME` `team-list` `#3:1864` — `column` · alignSelf `stretch` · padding `8 20 80` · alignItems `stretch` · gap `12` · fill × hug
    - 5 × `FRAME` `member-card-*` — `row` · alignSelf `stretch` · padding `12` · alignItems `center` · gap `12` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
      - `FRAME` `profile-img-wrap` — **48 × 48** `row`
        - `RECTANGLE` avatar — **48 × 48** · image fill (or photo + `1px #E2E8F0` border, radius `24`) · radius `24`
        - `ELLIPSE` online dot (cards 0, 1, 3) — **absolute (36, 36)** · **12 × 12** · `#22C55E` · border `2px #FFFFFF`
      - `FRAME` `profile-details` — `column` · gap `2` · fill × hug
        - name — 700 / **15** · `#0F172A`
        - `FRAME` `role-badge` — `row` · padding `2 8` · hug · radius `6` → text 700 / **11**
      - `IMAGE-SVG` **`more-horizontal`** **20 × 20**
      - 0 `#3:1865` — **"Sarah Chen"** · badge fill `#EFF6FF` → **"Owner"** `#2563EB` · online
      - 1 `#3:1875` — **"Mike Johnson"** · badge `#F1F5F9` → **"Admin"** `#64748B` · online
      - 2 `#3:1885` — **"Lisa Park"** · badge `#F1F5F9` → **"Manager"** `#64748B` · no online dot
      - 3 `#3:1894` — **"Tom Wilson"** · badge `#F1F5F9` → **"Staff"** `#64748B` · photo `2aa1806e…` + border · online
      - 4 `#3:1904` — **"Anna Garcia"** · badge `#F1F5F9` → **"Viewer"** `#64748B` · photo `16f06a25…` + border · no online dot
- `FRAME` `fab-add-user` `#3:1913` — **absolute (314, 698)** · **56 × 56** `row` · center/center · fill `#2563EB` · radius `28` · shadow `0 4 12 rgba(37,99,235,0.25)` → `IMAGE-SVG` **`plus`** **24 × 24**
- `FRAME` `bottom-nav` `#3:1916` — see [Bottom Navigation](#bottom-navigation) (active tab: **More**; icons wrapped in 20×20 boxes)

### 20-settings
- **Frame** `20-settings` `#3:1940` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:1942` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:2050` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `scroll-area` `#3:1941` — `column` · fill × hug
  - `FRAME` `screen-header` `#3:1951` — 16/20/12 app bar · **"Settings"** 800 / **24** `#0F172A` + **"Tailor StockWise AI to your workflow"** 400 / **13** `#64748B`
  - `FRAME` `profile-summary` `#3:1955` — `row` · alignSelf `stretch` · padding `16` · alignItems `center` · gap `12` · fill × hug · fill `#FFFFFF` · `strokeWeight "1px 0px"` `#E2E8F0`
    - `RECTANGLE` avatar `#3:1956` — **54 × 54** · image · border `1px #E2E8F0` · radius `27`
    - `FRAME` `profile-text` `#3:1957` — `column` · gap `2` · fill × hug
      - `TEXT` `#3:1958` — **"System Administrator"** — 800 / **16** · `#0F172A`
      - `TEXT` `#3:1959` — **"admin@stockwise.ai • Owner"** — 400 / **12** · `#64748B`
  - `FRAME` `settings-groups` `#3:1960` — `column` · alignSelf `stretch` · padding `20` · alignItems `stretch` · gap `20` · fill × hug
    - 4 × `FRAME` `group-*` — `column` · alignSelf `stretch` · gap `8` · fill × hug
      - group label — 700 / **12** / UPPER · `#94A3B8`
      - `FRAME` `rows-card` — `column` · fill × hug · fill `#FFFFFF` · border `1px #E2E8F0` · radius `12`
        - 2 × settings row — `row` · alignSelf `stretch` · padding `14` · space-between · center · fill × hug; **first row only**: `strokeWeight "0px 0px 1px"` `#F1F5F9`
          - left group — `row` · alignItems `center` · gap `12` · hug: icon box **18 × 18** → icon **18 × 18** + label 600 / **14** `#0F172A`
          - `IMAGE-SVG` **`chevron-right`** **16 × 16**
      - group-0 `#3:1961` — **"Account Settings"** → **`user`** **"Profile Information"**; **`lock`** **"Password & Security"**
      - group-1 `#3:1978` — **"Inventory Configurations"** → **`map-pin`** **"Storage Rooms & Locations"**; **`sliders-horizontal`** **"Minimum Threshold Rules"**
      - group-2 `#3:1995` — **"Smart Features (AI)"** → **`sparkles`** **"AI Recognition Settings"**; **`brain`** **"Custom Model Tuning"**
      - group-3 `#3:2012` — **"System & Sync"** → **`refresh-cw`** **"Cloud Sync Center"**; **`database`** **"Offline Storage Allocation"**
- `FRAME` `bottom-nav` `#3:2029` — see [Bottom Navigation](#bottom-navigation) (active tab: **More**; icons wrapped in 20×20 boxes)

### 21-appearance
- **Frame** `21-appearance` `#3:2377` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:2379` (`EL-60141d05`, padding `0 24`, icons not wrapped) · `home-indicator-container` `#3:2449` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `screen-content` `#3:2378` — `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug
  - `FRAME` `header` `#3:2388` — `row` · alignSelf `stretch` · padding `16 20 12` · alignItems `center` · gap `12` · fill × hug
    - `IMAGE-SVG` **`chevron-left`** `#3:2389` — **24 × 24**
    - `TEXT` `#3:2391` — **"Appearance"** — 800 / **20** · `#0F172A`
  - `FRAME` `theme-container` `#3:2392` — `column` · alignSelf `stretch` · padding `12 20 20` · gap `16` · fill × hug
    - `TEXT` `#3:2393` — **"Select Theme"** — 700 / **14** / UPPER · `#64748B`
    - 3 × theme card — `row` · alignSelf `stretch` · padding `16` · space-between · center · fill × hug · fill `#FFFFFF` · radius `16`
      - `FRAME` `left-block` — `row` · alignItems `center` · gap `16` · hug
        - mini preview (see below) + `FRAME` `label-block` — `column` · gap `4` · hug: title 700 / **16** `#0F172A`; sub 400 / **12** `#64748B`
      - selection control: **`check-circle`** **24 × 24** (selected) or `ELLIPSE` **22 × 22** · border `2px #E2E8F0` (unselected radio)
    - 1 `theme-card-light` `#3:2394` *(selected — border `2px #2563EB`)*
      - `mini-light-preview` `#3:2396` — **48 × 60** `column` · padding `6` · gap `4` · fill `#F8FAFC` · border `1px #E2E8F0` · radius `8` → accent `RECTANGLE` **20 × 4** `#2563EB` radius `2` + 2 × `RECTANGLE` **36 × 12** `#FFFFFF` border `1px #E2E8F0` radius `4`
      - **"Light Mode"** / **"Crisp look for bright environments"**
    - 2 `theme-card-dark` `#3:2405` *(border `1px #E2E8F0`)*
      - `mini-dark-preview` `#3:2407` — same box · fill `#0B1120` · border `1px #334155` → accent **20 × 4** `#3B82F6` + 2 × **36 × 12** fill `#111827` border `1px #334155`
      - **"Dark Mode"** / **"Optimized for low light work"**
    - 3 `theme-card-system` `#3:2415` *(border `1px #E2E8F0`)*
      - `mini-split-preview` `#3:2417` — **48 × 60** `row` · border `1px #E2E8F0` · radius `8` (no fill)
        - `split-left` — **24 × 60** `column` · padding `6` · gap `4` · fill `#F8FAFC` → **10 × 4** `#2563EB` r2 + **16 × 12** `#FFFFFF` border r4
        - `split-right` — **24 × 60** `column` · padding `6` · gap `4` · fill `#0B1120` → **10 × 4** `#3B82F6` r2 + **16 × 12** `#111827` border `#334155` r4
      - **"System Default"** / **"Matches your OS appearance"**
- `FRAME` `bottom-nav` `#3:2428` — see [Bottom Navigation](#bottom-navigation) (active tab: **More**; labels use the 500/10 variant; icons not wrapped)

### 22-dark-home
- **Frame** `22-dark-home` `#3:2452` — **390 × 844**, background **`#0B1120`** (dark theme).
- iOS chrome: `status-bar` `#3:2454` (`EL-60141d05`, padding `0 24`, `"9:41"` in `#F8FAFC`) · `home-indicator-container` `#3:2565` (bar `#FFFFFF`) inside dark `bottom-nav`.
- `FRAME` `home-scroll-area` `#3:2453` — `column` · fill × hug
  - `FRAME` `dashboard-header` `#3:2463` — 16/20/12 app bar (space-between)
    - `FRAME` `Frame` `#3:2464` — `column` · **fixed width 280** · gap `4`
      - `TEXT` `#3:2465` — **"Good morning, Admin"** — 800 / **20** · `#F8FAFC`
      - `TEXT` `#3:2466` — **"Here's what's happening with your inventory."** — 400 / **14** · `#94A3B8`
      - `FRAME` `Frame` `#3:2467` — `row` · padding `4 0 0` · alignItems `center` · gap `4` · hug → `ELLIPSE` **6 × 6** `#22C55E` + `TEXT` **"Synced Dark"** 600 / **11** `#22C55E`
    - `FRAME` `Frame` `#3:2470` — `row` · alignItems `center` · gap `12` · hug
      - `FRAME` `notif-wrapper` `#3:2471` — **40 × 40** `column` · center/center · fill `#111827` · border `1px #334155` · radius `20`
        - `IMAGE-SVG` **`bell`** **20 × 20** · `FRAME` `badge` — **absolute (22, 2)** · **16 × 16** · fill `#EF4444` · radius `8` → **"3"** 700 / **10** `#FFFFFF`
      - `RECTANGLE` `user-avatar` `#3:2476` — **40 × 40** · image · border `1px #334155` · radius `20`
  - `FRAME` `stat-scroll-row` `#3:2477` — `row` · alignSelf `stretch` · padding `8 20` · gap `12` · fill × hug
    - 3 × `FRAME` `stat-*` — `column` · padding `12` · gap `8` · **fixed width 100** × hug · fill `#111827` · border `1px #334155` · radius `12`
      - icon chip — **32 × 32** `row` · center/center · radius `8` + icon **16 × 16**; label 600 / **11** `#94A3B8`; value 800 / **16** `#F8FAFC`
      - `stat-0` — chip `#1E3A8A` · **`package`** · **"Total Items"** / **"1,248"**
      - `stat-1` — chip `#78350F` · **`alert-triangle`** · **"Low Stock"** / **"24"**
      - `stat-2` — chip `#7F1D1D` · **`circle-alert`** · **"Out of Stock"** / **"8"**
  - `FRAME` `Frame` `#3:2499` *(Quick Actions)* — `column` · alignSelf `stretch` · padding `12 20 8` · gap `12` · fill × hug
    - `TEXT` `#3:2500` — **"Quick Actions"** — 700 / **14** · `#F8FAFC`
    - `FRAME` `Frame` `#3:2501` — `row` · space-between · center · fill × hug
      - 4 × `Frame` — `column` · alignItems `center` · gap `6` · **fixed width 76** × hug: chip **52 × 52** `row`·center/center fill `#111827` border `1px #334155` radius `12` → icon **22 × 22**; label 600 / **11** / CENTER `#F8FAFC`
      - **`plus`** **"Add Item"** · **`scan-barcode`** **"Scan"** · **`sparkles`** **"AI Recognize"** (chip overridden: fill `#4D1D3C`, border `1.5px #F472B6`) · **`file-spreadsheet`** **"Import"**
  - `FRAME` `Frame` `#3:2522` *(Stock Status)* — `column` · alignSelf `stretch` · padding `12 20` · gap `12` · fill × hug
    - `FRAME` `Frame` `#3:2523` — `row` · space-between · center · fill × hug → **"Stock Status Distribution"** 700 / **14** `#F8FAFC` + **"View Report"** 600 / **12** `#3B82F6`
    - `FRAME` `Frame` `#3:2526` *(chart card)* — `row` · padding `16` · center · gap `16` · fill × hug · fill `#111827` · border `1px #334155` · radius `16`
      - `donut-container` `#3:2527` — **80 × 80** `column` (children absolute)
        - 3 × `ELLIPSE` — **80 × 80** · absolute (0,0) · fills `#22C55E` / `#F59E0B` / `#EF4444` (arc data absent in dump)
        - `FRAME` `inner-percentage` — **absolute (24.5, 26.5)** · column · center · hug → **"82%"** 800 / **14** `#F8FAFC` + **"Healthy"** 400 / **8** `#94A3B8`
      - `FRAME` `Frame` `#3:2534` — `column` · gap `6` · fill × hug → 3 legend rows (`row` · gap `8` · hug): `ELLIPSE` **8 × 8** + text 500 / **12** `#94A3B8`
        - **"In Stock (1,216 items)"** · **"Low Stock (24 items)"** · **"Out of Stock (8 items)"**
- `FRAME` `bottom-nav` `#3:2544` — see [Bottom Navigation](#bottom-navigation) (dark variant; active tab: **Home** `#3B82F6`)

### 23-dark-inventory
- **Frame** `23-dark-inventory` `#3:2568` — **390 × 844**, background **`#0B1120`**.
- iOS chrome: `status-bar` `#3:2570` (`EL-60141d05`, padding `0 24`, `"9:41"` `#F8FAFC`) · `home-indicator-container` `#3:2641` (bar `#FFFFFF`) inside dark `bottom-nav`.
- `FRAME` `inventory-scroll-content` `#3:2569` — `column` · fill × hug
  - `FRAME` `inventory-header` `#3:2579` — 16/20/12 app bar
    - `TEXT` `#3:2580` — **"Inventory"** — 800 / **24** · `#F8FAFC`
    - `FRAME` `Frame` `#3:2581` — `row` · gap `12` · hug → **`file-search`** **22 × 22** · **`plus-circle`** **22 × 22**
  - `FRAME` `Frame` `#3:2586` — `column` · alignSelf `stretch` · padding `0 20 12` · alignItems `stretch` · gap `12` · fill × hug
    - `FRAME` `Frame` `#3:2587` — `row` · gap `12` · fill × hug
      - search input `#3:2588` — `row` · padding `0 12` · center · gap `8` · fill × **height 40** · fill `#111827` · border `1px #334155` · radius `10` → **`search`** **16 × 16** + **"Search items..."** 400 / **13** `#94A3B8`
      - filter button `#3:2592` — **40 × 40** `row` · center/center · fill `#111827` · border `1px #334155` · radius `10` → **`sliders-horizontal`** **18 × 18**
    - `FRAME` `Frame` `#3:2595` — `row` · space-between · center · fill × hug
      - `TEXT` `#3:2596` — **"Showing 2 of 128 items"** — 600 / **12** · `#94A3B8`
      - view toggle `#3:2597` — `row` · padding `2` · gap `4` · hug · fill `#334155` · radius `6`
        - active segment — **28 × 24** · fill `#111827` · radius `4` → **`layout-grid`** **14 × 14**
        - inactive segment — **28 × 24** · radius `4` (transparent) → **`list`** **14 × 14**
  - `FRAME` `Frame` `#3:2604` — `column` · alignSelf `stretch` · padding `0 20 80` · alignItems `stretch` · gap `12` · fill × hug
    - 1 × `Frame` `#3:2605` — `row` · gap `12` · fill × hug → 2 item cards
      - `FRAME` `Frame` — `column` · padding `10` · alignItems `stretch` · gap `8` · fill × hug · fill `#111827` · border `1px #334155` · radius `12`
        - `RECTANGLE` photo — fill × **height 100** · image · radius `8`
        - text column — `column` · gap `4` · fill × hug: title 700 / **13** `#F8FAFC`; sub 400 / **11** `#94A3B8`; badge `row · padding 2 6 · hug · radius 4` with text 700 / **9**
        - 1: **"Dell Laptop"** / **"12 units • IT Room"** / badge `#064E3B` + **"In Stock"** `#22C55E`
        - 2: **"USB Keyboard"** / **"3 units • Storage"** / badge `#78350F` + **"Low Stock"** `#F59E0B`
- `FRAME` `bottom-nav` `#3:2620` — see [Bottom Navigation](#bottom-navigation) (dark variant; active tab: **Inventory** `#3B82F6`)

### 24-empty-state
- **Frame** `24-empty-state` `#3:2644` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:2646` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:2694` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `screen-content` `#3:2645` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `24` · fill × hug
  - `FRAME` `header` `#3:2655` — `row` · alignSelf `stretch` · padding `16 20 0` · space-between · center · fill × hug
    - `TEXT` `#3:2656` — **"My Inventory"** — 800 / **24** · `#0F172A`
  - `FRAME` `center-container` `#3:2657` — `column` · alignSelf `stretch` · padding `40 24` · center/center · gap `24` · fill × hug
    - `FRAME` `dotted-box` `#3:2658` — **180 × 180** `column` · center/center · fill `#EFF6FF` · border **`1.5px #2563EB`, dashes `6,4`** · radius `24`
      - `IMAGE-SVG` **`package-outline`** `#3:2659` — **48 × 48**
    - `FRAME` `text-info` `#3:2661` — `column` · alignSelf `stretch` · alignItems `center` · gap `8` · fill × hug
      - `TEXT` `#3:2662` — **"No inventory yet"** — 800 / **18** / CENTER · `#0F172A`
      - `TEXT` `#3:2663` — **"Start building your inventory by scanning an item or adding one manually."** — 400 / **14** / CENTER · `#64748B`
    - `FRAME` `buttons-stack` `#3:2664` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `12` · fill × hug
      - `FRAME` `btn-scan` `#3:2665` — `row` · alignSelf `stretch` · padding `12` · center/center · gap `10` · fill × hug · fill `#2563EB` · radius `12`
        - `IMAGE-SVG` **`scan-icon`** **20 × 20** · `TEXT` **"Scan Item"** 700 / **14** `#FFFFFF`
      - `FRAME` `btn-manual` `#3:2669` — same layout · border `1.5px #2563EB` · radius `12` (transparent)
        - `IMAGE-SVG` **`plus-icon`** **16 × 16** · `TEXT` **"Add Manually"** 700 / **14** `#2563EB`
- `FRAME` `bottom-nav` `#3:2673` — see [Bottom Navigation](#bottom-navigation) (active tab: **Inventory**; labels use the 500/10 variant except the active one)

### 25-success
- **Frame** `25-success` `#3:2697` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:2699` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:2742` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `screen-content` `#3:2698` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `32` · fill × hug
  - `FRAME` `center-card` `#3:2708` — `column` · alignSelf `stretch` · padding `60 24 40` · center/center · gap `32` · fill × hug
    - `FRAME` `icon-ring` `#3:2709` — **100 × 100** `column` · center/center · fill `#DCFCE7` · radius `50`
      - `FRAME` `inner-ring` `#3:2710` — **72 × 72** `column` · center/center · fill `#22C55E` · radius `36`
        - `IMAGE-SVG` **`check`** `#3:2711` — **32 × 32**
    - `FRAME` `text-info` `#3:2713` — `column` · alignItems `center` · gap `8` · fill × hug
      - `TEXT` `#3:2714` — **"Item Added"** — 800 / **22** / CENTER · `#0F172A`
      - `TEXT` `#3:2715` — **"Dell Latitude Laptop has been added to your inventory."** — 400 / **14** / CENTER · `#64748B`
    - `FRAME` `buttons` `#3:2716` — `column` · alignSelf `stretch` · alignItems `stretch` · gap `12` · fill × hug
      - `FRAME` `btn-view` `#3:2717` — `row` · padding `12` · center/center · gap `10` · fill × hug · fill `#2563EB` · radius `12` → **"View Item"** 700 / **14** `#FFFFFF`
      - `FRAME` `btn-done` `#3:2719` — same layout · border `1.5px #E2E8F0` · radius `12` (transparent) → **"Done"** 700 / **14** `#0F172A`
- `FRAME` `bottom-nav` `#3:2721` — see [Bottom Navigation](#bottom-navigation) (active tab: **Home**; labels use the 500/10 variant except the active one)

### 26-error
- **Frame** `26-error` `#3:2745` — **390 × 844**, background **`#F8FAFC`**.
- iOS chrome: `status-bar` `#3:2747` (`EL-60141d05`, padding `0 24`) · `home-indicator-container` `#3:2790` (bar `#000000`) inside `bottom-nav`.
- `FRAME` `screen-content` `#3:2746` — same `column` · gap `32` shell as screen 25
  - `FRAME` `center-card` `#3:2756` — `column` · padding `60 24 40` · center/center · gap `32` · fill × hug
    - `FRAME` `icon-ring` `#3:2757` — **100 × 100** · fill `#FEE2E2` · radius `50`
      - `FRAME` `inner-ring` `#3:2758` — **72 × 72** · fill `#EF4444` · radius `36` → `IMAGE-SVG` **`alert`** **32 × 32**
    - `FRAME` `text-info` `#3:2761`
      - `TEXT` `#3:2762` — **"Item Not Recognized"** — 800 / **20** / CENTER · `#0F172A`
      - `TEXT` `#3:2763` — **"Try taking a clearer photo or enter the item manually."** — 400 / **14** / CENTER · `#64748B`
    - `FRAME` `buttons` `#3:2764` — `column` · gap `12` · fill × hug
      - `FRAME` `btn-retry` `#3:2765` — fill `#2563EB` · radius `12` → **"Try Again"** 700 / **14** `#FFFFFF`
      - `FRAME` `btn-manual` `#3:2767` — border `1.5px #E2E8F0` · radius `12` (transparent) → **"Enter Manually"** 700 / **14** `#0F172A`
- `FRAME` `bottom-nav` `#3:2769` — see [Bottom Navigation](#bottom-navigation) (active tab: **Home**; labels use the 500/10 variant except the active one)

---

## Bottom Navigation

Present on **every screen except** `01-splash`, `02-login`, `07-ai-camera`, `10-barcode-scanner`, `11-qr-scanner`. It is always the last child of the 390 × 844 screen frame (the frame's `space-between` pushes it to the bottom).

**Container** — `FRAME` `bottom-nav`: `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug
- Light (`EL-cd680fff`, all non-dark screens): fill **`#FFFFFF`** · `strokeWeight "1px 0px 0px"` → top border **`1px #E2E8F0`**
- Dark (`EL-8a7f4880`, screens `22`, `23`): fill **`#111827`** · top border **`1px #334155`**

**`tabs-row`** (`EL-ff038edf`) — `row` · alignSelf `stretch` · padding `0 12` · justifyContent `space-between` · alignItems `center` · fill × **height 64**

- **Tab item** (`EL-20c47dad`) — `column` · alignItems `center` · gap `4` · **fixed width 60** × hug
  - `IMAGE-SVG` icon **20 × 20**, Lucide: **`house`**, **`package-open`**, **`history`**, **`more-horizontal`**
    - Screens `14`–`20` wrap each icon in a **20 × 20** centered frame (`EL-d04ce10c`); all other screens place the SVG directly.
  - `TEXT` label — hug, `style_4429437a` (**600 / 10**) or `style_63aa6fa3` (**500 / 10**), no explicit width (inherits the 60px item)
- **Center Scan button** (`center-scan-container`) — **absolute at (x 167, y −18)** relative to `tabs-row` · **56 × 56** `column` · center/center · radius `28` · shadow **`0 4 12 rgba(236, 72, 153, 0.25)`**
  - Fill: **`linear-gradient(135deg, #2563EB → #EC4899)`** (`EL-f63602ed`) — used on `03`–`07`, `14`–`26`; **`linear-gradient(90deg, #2563EB → #EC4899)`** (`EL-ef21b7f1`) on `08`, `09`, `12`, `13`
  - `IMAGE-SVG` **`scan-face`** **24 × 24** (wrapped in a 24 × 24 frame `EL-f659d5ff` on screens `14`–`20`)
  - Because it is absolutely positioned, it is out of flow: in the dump it appears between `tab-inventory` and `tab-activity` on `03`–`07` & `14`–`26`, but is appended **last** on `08`, `09`, `12`, `13` — visual order is identical.
- **`home-indicator-container`** (`EL-8f4a4eb7`) — `row` · padding `0 0 8` · center · fill × hug (see [shared chrome](#shared-chrome-mentioned-once-per-screen-from-here-on))

**Label templates** (text is always `Home` / `Inventory` / `Activity` / `More`):

| Template | Text | Style | Fill |
|---|---|---|---|
| `EL-b46a7849` | Home | 600 / 10 | `#2563EB` (active) |
| `EL-e5f3798c` | Home | 600 / 10 | `#64748B` |
| `EL-c4f39f7f` | Home | 600 / 10 | `#94A3B8` (muted set) |
| `EL-5737c65f` | Home | 500 / 10 | `#64748B` |
| `EL-2d320f67` | Inventory | 600 / 10 | `#2563EB` (active) |
| `EL-81c9ac83` | Inventory | 600 / 10 | `#64748B` |
| `EL-66cbeaae` | Inventory | 500 / 10 | `#64748B` |
| `EL-9ede2518` | Activity | 600 / 10 | `#64748B` |
| `EL-b5a08251` | Activity | 600 / 10 | `#94A3B8` (muted set) |
| `EL-8c343ffd` | Activity | 500 / 10 | `#64748B` |
| `EL-fc2a1f4d` | More | 600 / 10 | `#64748B` |
| `EL-30be5916` | More | 600 / 10 | `#2563EB` (active) |
| `EL-4c287e61` | More | 600 / 10 | `#94A3B8` (muted set) |
| `EL-ae529b9e` | More | 500 / 10 | `#64748B` |
| `EL-be0c5dfd` | Activity | 500 / 10 | `#94A3B8` (dark inactive) |
| `EL-09d2e6dc` | More | 500 / 10 | `#94A3B8` (dark inactive) |
| *inline* `#3:1738` | Activity | 600 / 10 | `#2563EB` (active, screen 17) |
| *inline* `#3:2549` | Home | 600 / 10 | `#3B82F6` (dark active, screen 22) |
| *inline* `#3:2553` | Inventory | 500 / 10 | `#94A3B8` (dark inactive, screen 22) |
| *inline* `#3:2625` | Home | 500 / 10 | `#94A3B8` (dark inactive, screen 23) |
| *inline* `#3:2629` | Inventory | 600 / 10 | `#3B82F6` (dark active, screen 23) |

**Active tab per screen**

| Screens | Active tab | Inactive label colors |
|---|---|---|
| `03`, `06` | Home | `#64748B` |
| `04`, `05` | Inventory | `#64748B` |
| `08`, `09` | Inventory | `#94A3B8` (muted set) |
| `12`, `13` | Inventory | `#94A3B8` (muted set) |
| `14`, `15`, `16`, `18`, `19`, `20` | More | `#64748B` |
| `17` | Activity | `#64748B` |
| `21` | More | `#64748B` (500/10 labels) |
| `22` | Home (`#3B82F6`) | `#94A3B8` (dark) |
| `23` | Inventory (`#3B82F6`) | `#94A3B8` (dark) |
| `24` | Inventory | `#64748B` (500/10 labels) |
| `25`, `26` | Home | `#64748B` (500/10 labels) |

Icons are identical on every screen (`house`, `package-open`, `scan-face`, `history`, `more-horizontal`); icon color follows the tab state (baked into the exported SVG — no `fill_*` token is given for `IMAGE-SVG`).

---

## Component Inventory

Reusable patterns (template id where the whole component is one element):

**Cards & surfaces**
- **Stat card** `EL-0810ec1e` / `EL-b91e6c14` — `column` · padding `12` · gap `8` · **fixed width 100** × hug · `#FFFFFF` (dark: `#111827` + `1px #334155`) · border `1px #E2E8F0` · radius `12` → 32×32 icon chip (radius 8) + label 600/11 + value 800/16.
- **Inventory / list card** `EL-3f94e76d` / `EL-cdb46399` — `column` · padding `10` · alignItems `stretch` · gap `8` · fill × hug · surface + border · radius `12` → photo (fill × height 100, radius 8) + text column (gap 4: title 700/13, sub 400/11) + badge.
- **Mini recent card** `EL-f6b4118b` — same as above with **fixed width 140**, photo height 80, title 700/12.
- **Wide card** (`layout_d5aec931`) `EL-5df0c6da`, `EL-bca515e3` — `row` · padding `16` · alignItems `center` · gap `16` · fill × hug · surface + border · radius `16` (also carries `0 4 8 rgba(15,23,42,0.02)` on `06-add-item`).
- **Padded section card** `EL-fa96e2b7` — `column` · padding `16` · alignItems `stretch` · gap `12` · fill × hug · surface + border · radius `16`.
- **Generic card row** `EL-2e9144b9` — `row` · padding `12` · alignItems `center` · gap `12` · fill × hug · surface + border · radius `12` (reports, team members).

**Rows**
- **Settings row** `EL-4a1cebaf` (first, `borderBottom 1px #F1F5F9`) / `EL-678250f7` — `row` · padding `14` · space-between · center · fill × hug → left group (gap 12: 18×18 icon + label 600/14) + `chevron-right` 16×16.
- **History row** `EL-c36d013b` — `row` · padding `12` · space-between · center · surface + border · radius `10` → 8×8 dot + text column (600/13 over 400/11) + status 700/12.
- **Notification card** `EL-a132177e` — `row` · fill × hug · surface + border · radius `12` → 4px accent bar (fill height) + content column (padding 12, gap 8).
- **Timeline row** `EL-94a17615` — `row` · gap `16` · fill × hug → optional absolute `LINE` (0×48, 2px `#E2E8F0`) + 48×48 avatar + card column (`EL-266db8fc`, padding `0 0 24`, gap 6).
- **Location row** `EL-bca515e3` — wide card variant with 40×40 icon chip, name 700/15 and meta row (gap 8, optional low-stock pill).

**Buttons** (all `row` · center/center)
- Full-width fixed height: `layout_ab730573` (h 48), `layout_167fc1f4` (h 48, gap 8), `layout_15654257` / `layout_2e180bd7` (h 44, ±gap 8) — radius `10`–`12`, fill `#2563EB` or outline (`1px #CBD5E1`, `1.5px #2563EB`, `1.5px #E2E8F0`).
- Padded hug: `layout_43b89e4f` — padding `12 24` · gap `8` · radius `10`.
- Pill: `layout_e544f696` (`EL-21fb994d`, `EL-73e04d43`) — padding `12` · gap `10` · radius `12`.
- Link text: `style_9d3a82ea` (600/14, UNDERLINE).
- FAB `EL-7a7cb8eb` — absolute (314, 698) · 56×56 · `#2563EB` · radius `28` · shadow `0 4 12 rgba(37,99,235,0.25)`.

**Inputs, chips & badges**
- **Search input** `layout_8043525e` — `row` · padding `0 12` · gap `8` · fill × **height 40** · radius `10` → 16×16 icon + placeholder 400/13.
- **Icon chips** — `layout_8066c7f2` 32×32 (radius 8), `layout_dfbdbcec` 40×40 (radius 10), `layout_26a1f280` 48×48 (radius 12), `layout_fc432d2f` 52×52 (radius 12).
- **Tiny badge** `layout_3e71dd93` — `row` · padding `2 6` · hug · radius `4` · text 700/9.
- **Role / status badge** `layout_f13f55be` — `row` · padding `2 8` · hug · radius `6` · text 700/11.
- **Pill / dot labels** — `row` · gap `4` · hug (6×6 dot + 600/11–12 text).
- **Toggle** — 36×20 `row` · padding `2` · radius `10` + 16×16 `#FFFFFF` knob; **view toggle** `layout_144bdfbe` — padding `2` · gap `4` · radius `6` with 28×24 segments (radius 4).

**Headers & structure**
- **App bar** `EL-54481dae` — `row` · padding `0 20` · space-between · center · fill × **height 56** (title 800/24 + trailing 22×22 action icons).
- **Screen header** `EL-98219dd2` — `row` · padding `16 20 12` · space-between · center · fill × hug, with `header-text` `EL-7aa84be4` (`column` · **fixed width 280** · gap 4: title 800/24 over subtitle 400/13).
- **Scroll body** `EL-e9077466` = `layout_5c79c5b1` — `column` · alignSelf `stretch` · alignItems `stretch` · fill × hug (transparent; screen frame supplies the background).
- **Back header** (screen 21) — `row` · padding `16 20 12` · gap `12` · `chevron-left` 24×24 + title 800/20.
- **Bottom nav & center button** — see [Bottom Navigation](#bottom-navigation).
- **Donut chart** `EL-44b5b64a` — 80×80 container, three 80×80 absolute `ELLIPSE`s (`#22C55E`/`#F59E0B`/`#EF4444`), center label absolute (24.5, 26.5); **arc geometry is not present in the dump**.
- **Status banner** — full-width `row` · padding `10 20` · gap `8` (offline banner `#F97316`, AI info banner `#FEF3C7`).

**Icon inventory** — every `IMAGE-SVG` maps to a **Lucide** icon of the given size (color baked into the exported SVG; no `fill_*` token): `alert`, `alert-circle`, `alert-triangle`, `armchair`, `arrow-left`, `arrow-right`, `arrow-up-right`, `barcode`, `bell`, `box`, `brain`, `calendar`, `camera`, `car`, `check`, `check-circle`, `chevron-left`, `chevron-right`, `circle-alert`, `circle-x`, `clock`, `cloud-off`, `database`, `eye`, `file-pen`, `file-search`, `file-spreadsheet`, `fingerprint`, `folder`, `graduation-cap`, `grid-3x3`, `heart`, `history`, `house`, `image`, `layout-grid`, `list`, `lock`, `lock-keyhole`, `mail`, `map-pin`, `minus`, `more-horizontal`, `package`, `package-open`, `package-outline`, `pen`, `pie-chart`, `plus`, `plus-circle`, `plus-icon`, `printer`, `qr-code`, `refresh-cw`, `scan-barcode`, `scan-face`, `scan-icon`, `search`, `sliders-horizontal`, `sparkles`, `thumbs-up`, `truck`, `user`, `users`, `wrench`, `zap`, `zap-off` (plus non-Lucide: `ios-signal`, `ios-wifi-signal`, `ios-battery-full`, `logo-graphic`, and `Frame` for the logo/progress artwork).
