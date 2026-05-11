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

Binance WebSocket connection lives in `shared/hooks/usePriceStream.ts`.
It feeds data into Zustand store. Components read from the store only — never connect to WebSocket directly.

```
Binance WS → usePriceStream hook → Zustand store → component reads state
```

WebSocket URL format for combined streams:
```
wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker
```

Price change: flash green if up, red if down — animate via `flash-up` / `flash-down` CSS classes.
Use `cancelled` flag in useEffect cleanup to handle React StrictMode double-invoke.

## Theme System

Theme is owned by **`next-themes`** — `ThemeProvider` lives in `app/layout.tsx` with `attribute="class"` and `defaultTheme="light"`. The library writes the `.dark` class onto `<html>`; no Zustand theme slice, no vanilla `<script>` bootstrap.

`shared/hooks/useTheme.ts` is a thin wrapper that exposes `{ theme, toggle }`:

```typescript
const { theme, toggle } = useTheme(); // theme: "light" | "dark"
```

Internally it reads `resolvedTheme` from `next-themes` and falls back to `"light"`. Any client component that needs the theme value before paint should use the `mounted` guard pattern (set `mounted=true` in `useEffect`, render a neutral fallback until then) — see `ThemeToggle` — to avoid hydration mismatch.

TradingView chart: update via `chart.applyOptions()` when theme changes — don't recreate the chart.

## Data-Fetch Hooks Pattern

Per-endpoint data needs to go through tiny shared hooks in `shared/hooks/`:

- `useQuoteCurrencies()` → `string[]`. Fetches `/api/quote-currencies` with a `cancelled` flag and a defensive `Array.isArray && length` check before replacing the default `["USDT"]`.
- `usePairsForQuote(quote)` → `CoinMeta[]`. Fetches `/api/coin-meta?quote=X`, resets pairs on quote change, has cancellation cleanup.

Consumers (`QuoteSelector`, `usePositionForm`, …) read these hooks and stay free of fetch boilerplate. Don't reach for SWR / React Query for two GETs; the in-house pattern stays cheap.

## Quote-Aware Form Independence

`AddPositionForm` (in `features/add-to-portfolio`) is fully decoupled from the global `selectedQuote` in both directions:
- It defaults to a hardcoded `"USDT"` on every mount — never reads `useAppStore.getState().selectedQuote`.
- Its quote select writes to local `useState` only — never propagates back to the global store.

The dashboard header `QuoteSelector` and the form's own pair select represent two different bounded contexts ("what market am I exploring" vs "what pair did I trade in") that happen to share the same string type. Do not re-bridge them.

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
const series = chart.addSeries(CandlestickSeries, { upColor: "#10B981" /* ...other options */ });

// v4 (wrong — method removed)
// chart.addCandlestickSeries({ ... })
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
- The header search picks a coin and routes to `/dashboard` (`setSelectedSymbol + router.push`). Pages where that navigation is contextual noise (e.g. `/watchlist`) pass `showSearch={false}` to `<Header>` to hide it.

## Coin Avatars — `<CoinIcon base="BTC" />`

`shared/ui/coin-icon.tsx` is the single source of truth for coin avatars (used by `PriceCard`, `WatchlistRow`, `PositionRow`, `MarketOverview`, `CoinDetailsPanel`, etc.). It renders a gradient placeholder with the first letter immediately, then crossfades the real SVG on top once it loads:

- Real SVG comes from the **cryptocurrency-icons CDN** (`https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530b/svg/color/<base>.svg`) — see `shared/lib/coin-icon.ts` for the URL helper.
- Placeholder gradient is deterministic per base via a small string-hash → palette lookup in `shared/lib/coin-gradient.ts` (`getCoinGradient(base)`). Same base always picks the same gradient so the avatar feels stable across renders.
- On `onError` the `<img>` is unmounted and only the gradient stays — never falls through to a broken icon.

Never re-introduce hardcoded `COIN_ICONS` or `COIN_COLORS` maps. New coins are discovered dynamically, so any static table immediately falls behind.

## Watchlist Toggle — `<WatchlistStarButton />`

`shared/ui/watchlist-star-button.tsx` is the unified star-toggle for adding/removing a symbol from the watchlist. Both the dashboard `PriceCard` and the watchlist table reuse it — do not re-implement the toggle inline in a feature. It reads watchlist state from the store, owns its own optimistic update, and wires through the `add-to-watchlist` / `remove-from-watchlist` features.

## PriceCard Decomposition

`entities/coin/components/price-card/` is split into small components rather than one monolith:

```
index.tsx              — composition + early-return for "no ticker yet"
PriceCardHeader.tsx    — avatar + base/quote + name
PriceBody.tsx          — large price number + flash class
PriceChangeBadge.tsx   — 24h % badge (color + arrow)
use-price-flash.ts     — hook: returns "flash-up"/"flash-down"/"" based on last tick
styles.ts              — Tailwind class strings
```

The same shape (header / body / change / styles + a per-concern hook) is the default when a card-shaped widget grows past ~80 lines — see `CoinDetailsPanel` (`CoinHeader`, `PriceBlock`, `StatRow`, `get-stat-rows.ts`) for the same template.

## Loading State Pattern — Streaming Tables

For rows that depend on streaming prices (Binance WS), split each row into two siblings: the real row and a skeleton row (e.g. `PositionRow` + `PositionRowSkeleton`, `WatchlistRow` + `WatchlistRowSkeleton`). The real row does an early return when its ticker is missing — keeping its main render path free of loading branches:

```tsx
const ticker = useAppStore((s) => s.prices[item.symbol]);
if (!ticker && initialLoad) return <PositionRowSkeleton group={group} />;
```

Both components must share the same grid columns/styles, otherwise layout jumps when the row swaps in. The skeleton renders ticker-independent fields (avatar, name) immediately and uses `<Skeleton className="w-N h-4" />` for streaming columns.

`initialLoad` is computed once at the table level (`Object.keys(prices).length === 0` while there are positions/items) — it latches `false` after the first ticker arrives, so adding a new entry in steady state does **not** flash skeletons over previously-loaded rows or summary cards.

## Form State Pattern — `useFormState<T>`

Forms that follow the recurring `values + loading + feedback` shape compose `useFormState<T>` from `shared/hooks`:

```ts
const { values, setValues, setField, loading, setLoading, feedback, setFeedback } =
  useFormState({ name: "", email: "" });
```

It is a **state-shape primitive only** — no submit/validate/onSuccess options. Domain submit logic stays inline in each feature hook (`useEditProfile`, `useChangePassword`). Do not promote `useFormState` to a configurator (`usePatchForm({validate, buildBody, onSuccess, ...})`) — past attempt was rejected for raising cognitive cost without payoff.

`feedback: { message: string; kind: "success" | "error" } | null` replaces fragile `msg.includes("updated")` substring color inference — choose the kind explicitly when setting feedback.

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
