---
name: coin-pulse
description: >
  Build a crypto dashboard with real-time prices, candlestick charts, watchlist,
  and portfolio tracker. Stack: Next.js 16 App Router, TypeScript, Tailwind CSS v4,
  TradingView Lightweight Charts v5, Binance WebSocket API, Zustand, TanStack Query,
  sonner toasts, MongoDB Atlas, NextAuth v4, role-based access control.
  Feature-Sliced Design architecture.
  Use this skill when working on CoinPulse — creating pages, components, API routes,
  WebSocket integration, authentication, charts, watchlist, portfolio, or admin features.
---

# CoinPulse

A crypto dashboard where users track real-time prices, monitor a watchlist,
and manage their portfolio. Prices stream live from Binance WebSocket API.
Role-based access: superadmin / admin / developer / user.

## Stack

| Layer      | Technology                                          |
|-----------|------------------------------------------------------|
| Framework | Next.js 16 (App Router, Turbopack)                   |
| Language  | TypeScript (strict)                                  |
| Styling   | Tailwind CSS v4 (CSS variables, no config file)      |
| Charts    | TradingView Lightweight Charts v5                    |
| Real-time | Binance WebSocket API (native WebSocket, no socket.io)|
| State     | Zustand (client state) + TanStack Query (server cache)|
| Toasts    | sonner                                               |
| Auth      | NextAuth v4 — JWT, Credentials + Google OAuth        |
| Database  | MongoDB Atlas + Mongoose                             |
| Tests     | Vitest 4 (node env by default; jsdom opt-in per file) |
| Deploy    | Vercel — https://coin-pulse-kappa.vercel.app         |

## Architecture — Feature-Sliced Design (FSD)

Layers import strictly downward — never upward:

```
app → widgets → features → entities → shared
```

```
app/           — Next.js routing, layouts, API routes
                 _providers/ — SessionProvider, QueryProvider (app-shell, opted out of routing)
widgets/       — Sidebar, Header, CandlestickChart, MarketOverview,
                 WatchlistTable, PortfolioTable, CoinDetailsPanel, AdminUsersTable
features/      — add-to-watchlist, remove-from-watchlist,
                 add-to-portfolio, remove-from-portfolio, search-coin,
                 select-quote, filter-watchlist-by-quote, coin-combobox,
                 edit-profile, change-password, admin-manage-users
entities/      — coin/{ui/{price-card, selected-symbol-stream}, types},
                 watchlist/{api.ts, model/watchlist-item, ui/{watchlist-initializer,
                            watchlist-provider}, types, serializers, index},
                 portfolio/{api.ts, model/portfolio-position, types, serializers, index},
                 user/{lib/{auth, require-user, require-api-user}, model/user,
                       ui/current-user-role-badge, types}
shared/        — ui — only generic primitives (Button, SearchInput, Select, Skeleton,
                      CoinIcon, WatchlistStarButton, ThemeToggle, LabeledField,
                      GoogleIcon, Input); no domain-coupled or app-shell components
                 lib (utils, db, parse-quote, api-fetch, api-response, validate,
                      coin-icon, coin-gradient, symbol)
                 types (roles, coin-asset, next-auth.d.ts — no barrel)
                 hooks (useTheme, useQuoteCurrencies, useCoinMeta,
                      useFormState, useFloatingRect, useResizeObserver, useStaleAfter,
                      useCoinFilter, useDismiss)
                 config (routes — internal route constants)
                 store, api
scripts/       — Prebuild snapshots (Binance trading pairs)
```

Mongoose schemas live in `entities/<name>/model/` (server-only). The
top-level `src/models/` directory has been retired.

Cross-feature imports are forbidden. If two features need shared logic, move it to entities/ or shared/.

## Database — MongoDB Atlas

**users** — name, email, password (null for Google), image, role, createdAt

**watchlistItems** — userId ref, symbol, name, quote (optional, backfilled on read), addedAt. Unique index on (userId, symbol).

**portfolioPositions** — userId ref, symbol, name, quote (optional, backfilled on read), quantity, buyPrice, createdAt

`quote` is `optional` in the schema so pre-migration documents (no quote field) keep loading. API GET handlers backfill via `parseQuoteFromSymbol(symbol)` from `shared/lib/parse-quote.ts`. Portfolio POST validates `tradingPairs.get(symbol) === quote` before insert.

## Roles

Defined as `const` object in `shared/types/roles.ts`:

```typescript
export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  DEVELOPER: "developer",
  USER: "user",
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
```

Permission matrix lives in `ROLE_PERMISSIONS` — always use it, never hardcode role checks.

## Connection Map

```
Binance WS (wss://stream.binance.com:9443/stream?streams=...)
  → entities/coin/api/price-stream (ref-counted singleton, auto-reconnect)
  → usePricesStore → components read prices

Server data (GET) → TanStack Query cache (useCoinMeta, useTopCoins, useChartData,
                    useQuoteCurrencies) → components
Mutations (POST/PATCH/DELETE) → entities/<X>/api.ts function → useMutation
                                → onSuccess: Zustand write + toast.success
                                → onError: toast.error with server message

Next.js client → /api/watchlist, /api/portfolio, /api/profile → MongoDB Atlas
Next.js client → /api/admin/users → MongoDB Atlas (admin+ only)
Next.js client → /api/coin-meta?quote=X, /api/quote-currencies, /api/top-coins?quote=X
                 → in-memory tradingPairs Map + Binance ticker REST
NextAuth → /api/auth/[...nextauth] → MongoDB Atlas (users)
NextAuth → Google OAuth
```

## Environment Variables

```
MONGODB_URI            — MongoDB Atlas connection string (coinpulse database)
NEXTAUTH_SECRET        — 32+ char secret, signs JWT tokens
NEXTAUTH_URL           — app base URL (https://coin-pulse-kappa.vercel.app in prod)
GOOGLE_CLIENT_ID       — Google Cloud Console
GOOGLE_CLIENT_SECRET   — Google Cloud Console
```

## Auth

- JWT strategy — token lives 7 days
- Two providers: Credentials (email + bcrypt, 10 rounds) and Google OAuth
- JWT callback always uses `.lean()` when querying MongoDB to avoid schema cache issues
- Role stored in JWT token and exposed via session
- `hasPassword: boolean` token field — UI uses it to gate the change-password form and the edit-profile form (Google-only users get read-only profile + a "managed by Google" notice instead of the change-password form)
- JWT callback handles `trigger: "update"` so `useSession().update({ name, email })` live-refreshes the sidebar pill without a relogin
- Session type extended in `shared/types/next-auth.d.ts`

## Theme

- Light (default) and Dark — CSS variables in `:root` and `.dark` class
- Powered by `next-themes` — `ThemeProvider` in root layout with `attribute="class"`, `defaultTheme="light"`. No vanilla `<script>` injection, no Zustand theme slice
- `useTheme` in `shared/hooks/useTheme.ts` is a thin wrapper around `next-themes` `useTheme` — exposes `{ theme, toggle }`
- `ThemeToggle` uses a `mounted` guard to avoid hydration mismatch
- TradingView chart colors updated via `chart.applyOptions()` on theme change — never recreate the chart. The chart-options builders live in `widgets/candlestick-chart/chart-theme.ts`

## Binance WebSocket

- Combined streams: `wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker`
- Single symbol ticker fields: `s`=symbol, `c`=price, `P`=% change, `p`=change, `v`=volume, `h`=high, `l`=low
- Connection lives in `entities/coin/api/price-stream.ts` as a module-level
  singleton (writes into `usePricesStore`). Ref-counted subscriptions coalesce
  mount/unmount cycles via `queueMicrotask` — StrictMode doesn't churn the
  socket. Reconnect on unexpected drops: `onclose` resets activeSymbols and
  schedules a single delayed reconcile after 5s.
- React adapter `usePriceStream(symbols)` is the public hook (re-exported from
  `@/entities/coin`). Widgets and the dashboard stream use it; nothing in
  `shared/` knows about the singleton anymore.
- Pure parsing helpers (`parseTicker`, `buildStreamUrl`) stay in
  `shared/api/binance/stream-parse.ts` — they only touch Binance event shapes
  and `CoinTicker` types (type-only crossing), so they're framework-free.

## Binance Trading Pairs — Build-Time Snapshot

The `symbol → quoteAsset` map is snapshotted at build time into
`shared/api/binance/pairs.generated.json` by `scripts/generate-binance-pairs.mjs`
(runs as `prebuild` in `package.json`). `shared/api/binance/pairs.ts` imports it as a
module-level Map (re-exported by `binance/index.ts` for compatibility). Never fetch
`/api/v3/exchangeInfo` at runtime — its ~22MB response exceeds Next 16's data
cache 2MB per-item limit and `cache: "no-store"` is ignored by Turbopack, so
each call would re-download the full payload.

## shared/api Module Layout

The Binance integration is grouped under `shared/api/binance/` (public surface
stays `@/shared/api/binance` — the folder's `index.ts` is the REST entry).
Mixed base URLs sit at the parent `shared/api/endpoints.ts`:

- `binance/index.ts` — public REST fetchers: `fetchQuoteCurrencies`,
  `fetchTopSymbols`, `fetchKlines`. `fetchTopSymbols` runs a single-pass loop
  (precomputed base + parsed volume; sort uses cached numbers) and degrades
  gracefully when CoinGecko returns non-OK (skips the crypto allowlist filter
  instead of returning empty).
- `binance/pairs.ts` — `tradingPairs` Map from the build-time snapshot
  (`binance/pairs.generated.json`).
- `binance/stables.ts` — `buildStablecoinSet(tickers)` helper (USD-stablecoin
  detection by ≈$1 USDT price). Shared by both top-coins and quote-currencies
  fetchers.
- `binance/types.ts` — on-the-wire shapes for both REST (`MiniTicker`,
  `BinanceKline` tuple) and WS (`BinanceTickerEvent`, `BinanceStreamEnvelope`).
- `binance/client.ts` — `symbolExists` (REST `ticker/price` probe).
- `binance/stream-parse.ts` — pure WS helpers (parseTicker, buildStreamUrl).
- `binance/price-stream.ts` — singleton WS state machine (lifecycle + ref-count
  + reconcile + subscribe + auto-reconnect).
- `endpoints.ts` — base URLs (`BINANCE_BASE`, `CG_MARKETS`) at `shared/api/`
  root, not under `binance/`, because `CG_MARKETS` is CoinGecko.

## Zustand Stores — Per-Entity Split

State is sharded across four small stores; there is no combined `useAppStore`:

- `usePricesStore` at `entities/coin/model/store.ts` — `prices: Record<string, CoinTicker>` + `updatePrice`.
- `useWatchlistStore` at `entities/watchlist/model/store.ts` — `items: WatchlistItem[]` + `setItems`. Public via barrel.
- `usePortfolioStore` at `entities/portfolio/model/store.ts` — `positions: PortfolioPosition[]` + `setPositions`. Public via barrel.
- `useSelectionStore` at `shared/store/selection-store.ts` — `selectedSymbol` + `selectedQuote` + setters. Pure UI selection, no entity coupling. Re-exported from `shared/store`.

Consumers that need state from multiple domains subscribe to each store separately (Zustand selectors are per-store). Each store has its own `devtools` instance (`coinpulse/prices`, `coinpulse/watchlist`, `coinpulse/portfolio`, `coinpulse/selection`).

## Zustand Subscription Discipline

Live ticks fan out through many components — the wrong selector turns one WS message into 30+ re-renders. Rules:

- **Never subscribe to `s.prices` whole.** Always per-key (`usePricesStore((s) => s.prices[symbol])`) so Zustand's Object.is check skips re-renders for unrelated symbols. The price-card cascade was eliminated by extracting `LivePriceCard` wrappers that each subscribe to their own ticker.
- **Never subscribe to `s.items` whole** in `useWatchlistStore` when you only need a boolean. Use `useWatchlistStore((s) => s.items.some((w) => w.symbol === ticker.symbol))` — selector still runs per state change but returns the same boolean, so no re-render.
- **For derived totals across many symbols** (e.g. portfolio P&L), use `useShallow` with the relevant subset: `usePricesStore(useShallow((s) => Object.fromEntries(symbols.map((sym) => [sym, s.prices[sym]?.price]))))`. Re-renders only when one of *your* symbols ticks AND its price actually changed.
- **For "any tick happened" gates**, use a boolean selector like `usePricesStore((s) => Object.keys(s.prices).length > 0)` — flips false→true once on the first tick and stays put, so it doesn't drive re-renders past mount.
- **Split smart containers by data dependency.** `SummaryCards` is a thin wrapper that composes `InvestedCard` (no subscription — derives from portfolio only) and `LiveSummaryCards` (smart, `useShallow` to held-symbol prices). Invested never blinks; Current/P&L blink only on relevant ticks.
- **Mutation hooks read store via `<store>.getState()` inside `onSuccess`** so they don't subscribe — `useAddToWatchlist`/`useRemoveFromWatchlist` consumers don't re-render on every watchlist change elsewhere.

## Imperative-Library Wrappers — `useCandlestickChart`

The TradingView chart is wrapped via a dedicated hook (`widgets/candlestick-chart/use-candlestick-chart.ts`) that owns all imperative state: chart instance, series controller, theme + data + live-tick effects, container resize via `useResizeObserver`. The component itself is a thin `<div ref>` consumer:

```tsx
export const ChartCanvas = (props) => {
  const containerRef = useCandlestickChart(props);
  return <div ref={containerRef} className="w-full" />;
};
```

Series swap on `chartType` change is internal — `chart.removeSeries(old) + addSeries(new)` — **do not** force-remount via `key={chartType}` on the parent. The series controller (`chart-series.ts`) returns `{ setData, updateLive, destroy }` per type; the per-case branches own their `ISeriesApi<"…">` so the consumer never casts. Theme changes flow through `applyOptions` only.

This pattern is the template for any imperative-library wrapper that needs many lifecycle effects: bundle them in a custom hook so the component stays a pure props→JSX contract.

## REST Snapshot for Non-Streamed Symbols

`features/search-coin/use-search-tickers-snapshot.ts` fires a single `/ticker/24hr?symbols=[…]` batch when the dropdown opens, writes the parsed tickers into the Zustand `prices` slice via `updatePrice`, and caches per symbol-list with `staleTime: 30s` (TanStack Query). Long-tail coins that the WS subscriptions don't cover get a price preview without churning the WebSocket. The same pattern applies anywhere a UI needs a momentary snapshot of prices it doesn't otherwise stream.

## CoinIcon Fallback Chain

`shared/lib/coin-icon.ts` exposes a CDN chain — `atomiclabs/cryptocurrency-icons` first (crisp SVGs, ~500 popular coins), then `assets.coincap.io` (PNG, long-tail), then the gradient + first-letter fallback already built into `CoinIcon`. The component tracks `cdnIdx` state, increments on `onError`, and shows the gradient once the chain exhausts. Add a new CDN by appending to `CDN_BUILDERS`.

## References

- `references/design.md` — color palette, layout zones, typography, cards, charts, animations
- `references/frontend.md` — FSD rules, component conventions, real-time pattern, design tokens
- `references/backend.md` — API routes, auth config, DB singleton, error handling
- `references/testing.md` — what to test, test structure, mocking strategy

## External Docs

- FSD: https://feature-sliced.design/docs/get-started/overview
- Next.js: https://nextjs.org/docs
- TradingView Charts v5: https://tradingview.github.io/lightweight-charts/
- Binance WS API: https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams
- NextAuth: https://next-auth.js.org
- Mongoose: https://mongoosejs.com
- Zustand: https://zustand.docs.pmnd.rs
- Tailwind CSS v4: https://tailwindcss.com/docs
