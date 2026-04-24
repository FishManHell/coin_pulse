# Design Reference — CoinPulse

## Visual Style

Dark premium crypto dashboard. Dense data layout — not a landing page.
No glassmorphism. Depth is created through slightly different dark shades between background and cards.

## Color Palette

### Base (dark theme)
- Background: `#0D0D14` — very deep dark blue-black
- Surface (cards): `#13131F` — slightly lighter, creates depth
- Border: `#1E1E30` — subtle card borders
- Surface hover: `#1A1A2E`

### Accent — Indigo → Cyan gradient
- Indigo: `#4F46E5`
- Cyan: `#00D4FF`
- Gradient: `linear-gradient(135deg, #4F46E5, #00D4FF)`
- Used on: primary buttons, active nav items, logo, highlights

### Price change colors
- Positive (price up): `#10B981` — emerald green
- Negative (price down): `#EF4444` — red
- Neutral: `#6B7280` — gray

### Text
- Primary: `#F1F5F9`
- Secondary: `#94A3B8`
- Muted: `#475569`

### Light theme
- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Border: `#E2E8F0`
- Text primary: `#0F172A`
- Text secondary: `#475569`
- Accent stays the same: Indigo → Cyan gradient
- Price colors stay the same: green / red

## Layout

Three-zone layout:
```
[Sidebar 240px] [Main content flex-1] [Right panel 320px optional]
```

- **Sidebar** — fixed left, logo + nav links (icon + label), user section at bottom
- **Main content** — scrollable, page content
- **Right panel** — contextual (e.g. Buy/Sell, coin details) — hidden on mobile

On mobile: sidebar collapses to hamburger, right panel moves below main content.

## Typography

- Font: Inter
- Large price numbers: `text-3xl font-bold` or `text-4xl font-bold`
- Section titles: `text-lg font-semibold`
- Labels / secondary: `text-sm text-secondary`
- Percentage badges: `text-xs font-medium`

## Cards

- Background: Surface color (`#13131F`)
- Border: `1px solid` border color (`#1E1E30`)
- Radius: `rounded-2xl` (16px)
- Padding: `p-5` or `p-6`
- No heavy shadows — subtle `shadow-sm` only

### Coin card structure
Each coin card shows: icon, name, symbol, current price, % change badge, mini sparkline chart at the bottom.

## Badges — Price Change

- Green badge for positive: green text + very subtle green bg tint
- Red badge for negative: red text + very subtle red bg tint
- Include arrow icon: ↑ or ↓

## Buttons

- Primary: Indigo → Cyan gradient background, white text, `rounded-xl`
- Secondary: transparent with border, `rounded-xl`
- Ghost: no border, subtle hover bg

## Charts

- TradingView Lightweight Charts for candlestick and line charts
- Chart background matches surface color
- Grid lines: very subtle, `#1E1E30`
- Candlestick: green for bullish (`#10B981`), red for bearish (`#EF4444`)
- Line chart: Cyan (`#00D4FF`) with subtle area fill below

## Time Selectors

Pill-style tab group: `1H | 24H | 1W | 1M | 1Y`
Active tab: gradient accent background. Inactive: ghost style.

## Navigation (Sidebar)

- Active item: accent gradient left border + subtle bg tint
- Inactive: muted text, hover shows subtle bg
- Icons: 20px, consistent set (Lucide recommended)
- Bottom section: Settings, user avatar + name

## Animations

- Price flash on update: briefly highlight cell green or red, fade out in 600ms
- Hover on cards: subtle `scale-[1.01]` + slightly lighter bg
- Transitions: `transition-all duration-200` everywhere
