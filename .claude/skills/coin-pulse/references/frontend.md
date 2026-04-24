# Frontend Reference — CoinPulse

## FSD Import Rules

- Within the same slice: relative paths (`../types`, `./lib/utils`)
- Between layers: absolute paths with `@/` (`@/entities/coin/components/PriceCard`, `@/shared/ui/button`)
- Never import upward — entity must not import from feature, feature must not import from widget

## Component Conventions

- Arrow functions for all components
- Pages/layouts: `export default` at the bottom
- Feature/entity components: named export at the bottom
- Props: define clean interface, apply `Readonly<>` in function parameters
- Server Components by default — add `"use client"` only for hooks, events, browser APIs
- Split server/client when possible: server fetches data, passes to client component

## TypeScript Rules

- All types in slice-level `types.ts` or `shared/types/` — never inside components
- `import type` for type-only imports
- Role types: use `USER_ROLES` const object and derive `UserRole` type — never use string literals
- Session user: `session.user` is typed via `shared/types/next-auth.d.ts` augmentation — no casting needed

## Real-Time Data Pattern

Binance WebSocket connection lives in `shared/hooks/useWebSocket.ts`.
It feeds data into Zustand store. Components read from the store only — never connect to WebSocket directly.

```
Binance WS → useWebSocket hook → Zustand store → component reads state
```

WebSocket URL format for combined streams:
```
wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker
```

Price change: flash green if up, red if down — animate via `flash-up` / `flash-down` CSS classes.
Use `cancelled` flag in useEffect cleanup to handle React StrictMode double-invoke.

## Theme System

Theme lives in **Zustand store** (not local useState) so all components react to one change:

```typescript
const theme = useAppStore((s) => s.theme);      // read
const setTheme = useAppStore((s) => s.setTheme); // write
```

`useTheme` hook wraps store + applies `.light` / `.dark` class to `<html>`.
TradingView chart: update via `chart.applyOptions()` when theme changes — don't recreate the chart.

## Tailwind v4 Notes

- No `tailwind.config.js` — all config in `globals.css` via `@theme` directive
- Custom colors defined as `--color-*` CSS variables → become Tailwind utilities automatically
- `@custom-variant dark (&:is(.dark *))` — enables `dark:` utilities via `.dark` class
- Never hardcode hex colors in JSX — always use CSS variable-based classes
- `cn()` from `shared/lib/utils` for conditional class merging (clsx + tailwind-merge)

## Chart — TradingView Lightweight Charts v5

v5 API changed from v4 — use the new API:

```typescript
// v5 (correct)
import { CandlestickSeries, LineSeries, AreaSeries, BarSeries } from "lightweight-charts";
const series = chart.addSeries(CandlestickSeries, { upColor: "#10B981", ... });

// v4 (wrong — method removed)
chart.addCandlestickSeries(...)
```

When chart type changes: use `key={chartType}` on the canvas component to force remount.
Theme changes: call `chart.applyOptions()` — never recreate the chart.

## Sidebar Responsive Pattern

- `w-16` on mobile (collapsed, icons only) → `lg:w-60` expanded
- All nav items: `justify-center lg:justify-start` to center icons when collapsed
- Text labels: `hidden lg:block`
- `main` content: `ml-16 lg:ml-60` matches sidebar width

## Header Search — Mobile Pattern

- Mobile: icon button → click → title hides, full-width input appears with X to close
- Desktop (`md+`): `SearchCoin` component always visible with dropdown

## Styling Rules

- Tailwind only — no inline styles, no CSS modules
- Group classes in `cn()` by concern: layout → appearance → state → interaction
- All colors through CSS variables — theming breaks with hardcoded values
- Never nest `<button>` inside `<button>` — use `<div role="button" tabIndex={0}>` for the outer

## Responsive

- Mobile-first approach
- Sidebar collapses to icon-only at `< lg` (1024px)
- Right panel (CoinDetailsPanel) hidden below `xl` (1280px)
- `h-16 shrink-0` on header — prevents flex from collapsing it on small screens

## External Docs

- TradingView Charts v5: https://tradingview.github.io/lightweight-charts/
- Zustand: https://zustand.docs.pmnd.rs
- Tailwind CSS v4: https://tailwindcss.com/docs
