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
entities/      — coin/components/{price-card, selected-symbol-stream},
                 watchlist/{api.ts, components/{watchlist-initializer, watchlist-provider}},
                 portfolio/api.ts,
                 user/{lib/auth, components/RoleBadge}
shared/        — ui — only generic primitives (Button, SearchInput, Select, Skeleton,
                      CoinIcon, WatchlistStarButton, ThemeToggle, LabeledField,
                      GoogleIcon, Input); no domain-coupled or app-shell components
                 lib (utils, db, parse-quote, api-fetch, coin-icon, coin-gradient, symbol,
                      use-coin-filter, use-dismiss)
                 types
                 hooks (usePriceStream, useTheme, useQuoteCurrencies, useCoinMeta,
                      useFormState, useFloatingRect, useStaleAfter)
                 config (routes — internal route constants)
                 store, api
models/        — Mongoose schemas (server-only): User, WatchlistItem, PortfolioPosition
scripts/       — Prebuild snapshots (Binance trading pairs)
```

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
  → shared/api/price-stream (ref-counted singleton, auto-reconnect)
  → Zustand prices slice → components read prices

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
- TradingView chart colors updated via `chart.applyOptions()` on theme change — never recreate the chart

## Binance WebSocket

- Combined streams: `wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker`
- Single symbol ticker fields: `s`=symbol, `c`=price, `P`=% change, `p`=change, `v`=volume, `h`=high, `l`=low
- Connection lives in `shared/api/price-stream.ts` as a module-level singleton.
  Ref-counted subscriptions coalesce mount/unmount cycles via `queueMicrotask` —
  StrictMode doesn't churn the socket. Reconnect on unexpected drops: `onclose`
  resets activeSymbols and schedules a single delayed reconcile after 5s.
- Pure parsing helpers (`parseTicker`, `buildStreamUrl`) live in
  `shared/api/binance-stream-parse.ts`; the state machine stays in price-stream.ts.

## Binance Trading Pairs — Build-Time Snapshot

The `symbol → quoteAsset` map is snapshotted at build time into
`shared/api/binance-pairs.generated.json` by `scripts/generate-binance-pairs.mjs`
(runs as `prebuild` in `package.json`). `shared/api/binance-pairs.ts` imports it as a
module-level Map (re-exported by `binance.ts` for compatibility). Never fetch
`/api/v3/exchangeInfo` at runtime — its ~22MB response exceeds Next 16's data
cache 2MB per-item limit and `cache: "no-store"` is ignored by Turbopack, so
each call would re-download the full payload.

## shared/api Module Layout

The Binance integration is split by concern, not by function-per-file:

- `binance.ts` — public REST fetchers: `fetchQuoteCurrencies`, `fetchTopSymbols`,
  `fetchKlines`. `fetchTopSymbols` runs a single-pass loop (precomputed base +
  parsed volume; sort uses cached numbers) and degrades gracefully when
  CoinGecko returns non-OK (skips the crypto allowlist filter instead of
  returning empty).
- `binance-pairs.ts` — `tradingPairs` Map from the build-time snapshot.
- `binance-stables.ts` — `buildStablecoinSet(tickers)` helper (USD-stablecoin
  detection by ≈$1 USDT price). Shared by both top-coins and quote-currencies
  fetchers.
- `binance-types.ts` — on-the-wire shapes for both REST (`MiniTicker`,
  `BinanceKline` tuple) and WS (`BinanceTickerEvent`, `BinanceStreamEnvelope`).
- `binance-client.ts` — `symbolExists` (REST `ticker/price` probe).
- `binance-stream-parse.ts` — pure WS helpers (parseTicker, buildStreamUrl).
- `price-stream.ts` — singleton WS state machine (lifecycle + ref-count +
  reconcile + subscribe + auto-reconnect).
- `endpoints.ts` — base URLs (`BINANCE_BASE`, `CG_MARKETS`).

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
