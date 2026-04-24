---
name: coin-pulse
description: >
  Build a crypto dashboard with real-time prices, candlestick charts, watchlist,
  and portfolio tracker. Stack: Next.js 16 App Router, TypeScript, Tailwind CSS v4,
  TradingView Lightweight Charts v5, Binance WebSocket API, Zustand,
  MongoDB Atlas, NextAuth v4, role-based access control. Feature-Sliced Design architecture.
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
| State     | Zustand                                              |
| Auth      | NextAuth v4 — JWT, Credentials + Google OAuth        |
| Database  | MongoDB Atlas + Mongoose                             |
| Deploy    | Vercel — https://coin-pulse-kappa.vercel.app         |

## Architecture — Feature-Sliced Design (FSD)

Layers import strictly downward — never upward:

```
app → widgets → features → entities → shared
```

```
app/           — Next.js routing, layouts, providers, API routes
widgets/       — Sidebar, Header, CandlestickChart, MarketOverview,
                 WatchlistTable, PortfolioTable, CoinDetailsPanel, AdminUsersTable
features/      — add-to-watchlist, remove-from-watchlist,
                 add-to-portfolio, remove-from-portfolio, search-coin
entities/      — coin/PriceCard, user/auth-config
shared/        — ui, lib (utils, db), types, hooks (useWebSocket, useTheme), store, api
models/        — Mongoose schemas (server-only): User, WatchlistItem, PortfolioPosition
```

Cross-feature imports are forbidden. If two features need shared logic, move it to entities/ or shared/.

## Database — MongoDB Atlas

**users** — name, email, password (null for Google), image, role, createdAt

**watchlistItems** — userId ref, symbol, name, addedAt

**portfolioPositions** — userId ref, symbol, name, quantity, buyPrice, createdAt

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
  → useWebSocket hook → Zustand store → components read prices

Next.js client → /api/watchlist, /api/portfolio, /api/profile → MongoDB Atlas
Next.js client → /api/admin/users → MongoDB Atlas (admin+ only)
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
- Session type extended in `shared/types/next-auth.d.ts`

## Theme

- Dark (default) and Light — CSS variables in `:root` and `.light` class
- Theme stored in Zustand store (not local state!) so all components react to changes
- `useTheme` hook reads/writes from Zustand + applies class to `<html>`
- TradingView chart colors updated via `chart.applyOptions()` on theme change

## Binance WebSocket

- Combined streams: `wss://stream.binance.com:9443/stream?streams=btcusdt@ticker/ethusdt@ticker`
- Single symbol ticker fields: `s`=symbol, `c`=price, `P`=% change, `p`=change, `v`=volume, `h`=high, `l`=low
- Hook uses `cancelled` flag to handle React StrictMode double-invoke without console errors

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
