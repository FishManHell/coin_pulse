# Frontend Reference — CoinPulse

## FSD Import Rules

- Within the same slice: relative paths (`../types`, `./lib/utils`)
- Between layers: absolute paths with `@/` (`@/entities/coin/ui/price-card`, `@/shared/ui/button`)
- Never import upward — entity must not import from feature, feature must not import from widget
- Entity slice layout follows FSD: `ui/` (React surface), `model/` (Mongoose schemas / Zustand pieces), `lib/` (server-only helpers), `api.ts`, `types.ts`, `serializers.ts`, `index.ts`

## Component Conventions

- Arrow functions for all components
- Pages/layouts: `export default` at the bottom
- Feature/entity components: named export at the bottom
- Props: define clean interface, apply `Readonly<>` in function parameters
- Server Components by default — add `"use client"` only for hooks, events, browser APIs
- Split server/client when possible: server fetches data, passes to client component

## TypeScript Rules

- Domain types live in `entities/<entity>/types.ts` (CoinTicker/Kline/CoinMeta/TimeRange in `entities/coin/types`, AdminUser in `entities/user/types`, etc.). Truly cross-cutting types — `roles`, `coin-asset` base DTOs, `next-auth.d.ts` — live in `shared/types/`. Never put types inside component files
- `import type` for type-only imports
- Role types: use `USER_ROLES` const object and derive `UserRole` type — never use string literals
- Session user: `session.user` is typed via `shared/types/next-auth.d.ts` augmentation — no casting needed

## Zustand Stores — Per-Entity Split

State is sharded across four small stores; there is no combined `useAppStore`:

| Store | Location | Holds |
|---|---|---|
| `usePricesStore` | `entities/coin/model/store.ts` | `prices: Record<symbol, CoinTicker>` + `updatePrice` |
| `useWatchlistStore` | `entities/watchlist/model/store.ts` (barrel) | `items: WatchlistItem[]` + `setItems` |
| `usePortfolioStore` | `entities/portfolio/model/store.ts` (barrel) | `positions: PortfolioPosition[]` + `setPositions` |
| `useSelectionStore` | `shared/store/selection-store.ts` (barrel `@/shared/store`) | `selectedSymbol`, `selectedQuote` + setters |

Consumers reading from multiple domains subscribe to each store separately (Zustand selectors are per-store, no cross-store derivation). Each store carries its own `devtools` instance for easy isolation in DevTools.

This split keeps the FSD layering pure — no `shared → entities` type crossings — at the cost of a slightly more verbose import block in widgets that mix domains.

## Zustand Subscription Discipline

Streaming ticks (5–10 Hz) fan out across many components — a wrong selector turns one WS message into 30+ re-renders. Rules established from a measured perf round:

**Never subscribe to whole collections on the live path.** Always per-key or per-boolean. Zustand uses `Object.is` between renders, so a selector returning the same primitive skips re-render entirely.

| Pattern | Wrong | Right |
|---|---|---|
| Price for one symbol | `usePricesStore((s) => s.prices)` | `usePricesStore((s) => s.prices[symbol])` |
| Is this watched? | `useWatchlistStore((s) => s.items)` then `.some(...)` outside | `useWatchlistStore((s) => s.items.some((w) => w.symbol === symbol))` (boolean) |
| Has any tick arrived? | `usePricesStore((s) => s.prices)` | `usePricesStore((s) => Object.keys(s.prices).length > 0)` (boolean, flips once) |
| Totals across N symbols | `usePricesStore((s) => s.prices)` then `.reduce(...)` outside | `usePricesStore(useShallow((s) => Object.fromEntries(symbols.map((sym) => [sym, s.prices[sym]?.price]))))` |

**Lift smart subscriptions into a dedicated child.** Don't subscribe at the parent and pass derived values down — the parent re-renders on every tick and cascades through its entire subtree (no `React.memo` in this codebase). Instead, extract a small "live" container that owns the subscription, and let the parent stay subscription-free.

```
PortfolioTable (subscribes to portfolio + hasAnyPrice boolean — quiet on ticks)
├── SummaryCards (layout-only wrapper)
│   ├── InvestedCard (derives from portfolio only — never blinks on ticks)
│   └── LiveSummaryCards (useShallow per-symbol prices — blinks on relevant ticks only)
├── TableHeader (quiet)
├── AddPositionForm (quiet — was the worst offender before the split)
└── PositionRow × N (each subscribes per-symbol — blinks individually)
```

`MarketOverview` follows the same shape: it doesn't read `prices` at all; each `LivePriceCard` wrapper subscribes to its own `prices[symbol]` + `selectedSymbol === symbol` boolean.

**Mutation hooks must not subscribe.** All four — `useAddToWatchlist`, `useRemoveFromWatchlist`, `useAddToPortfolio`, `useRemoveFromPortfolio` — read the current collection via `useWatchlistStore.getState().items` / `usePortfolioStore.getState().positions` inside `onSuccess`, not via subscription. That removes a cascading subscription from every consumer (LivePriceCard, CoinHeader, PositionRow, etc.) — they only re-render on their own state change, not on every unrelated mutation elsewhere. The trade-off: the closure captures the snapshot at success-time, not enqueue-time — which is what we want for de-duplication.

**Disable mutating buttons while in flight.** `WatchlistStarButton` takes `disabled` and forwards to the Button — wired from `adding || removing` loading flags. Locally imperceptible (mutations finish in ~50ms), but on slow networks it prevents spam-clicks from firing duplicate add/remove requests.

## Real-Time Data Pattern

Binance WS connection is a **module-level singleton** in `entities/coin/api/price-stream.ts`
(it writes directly into `usePricesStore`, so the singleton lives in the same entity slice).
The `subscribe(symbols)` API is ref-counted: many components can subscribe to overlapping
symbol sets — internally it coalesces into one WS via `queueMicrotask` reconcile. The
`usePriceStream(symbols)` hook in `entities/coin/api/use-price-stream.ts` is a thin React
adapter around it; consumers import it via the entity barrel `@/entities/coin`.
Components read prices from `usePricesStore` — never connect to WS directly.

```
Binance WS → entities/coin/api/price-stream singleton → usePricesStore → component reads state
```

Recovery: unexpected drops route through `onclose` (which fires after `onerror` per
the WS spec) — it clears `activeSymbols` and schedules a single reconnect after 5s.
The intentional-close path nulls handlers first, so it doesn't re-trigger reconnect.
Don't add SSR guards inside the module — the public `subscribe()` already early-returns
when `window` is undefined.

Pure helpers (`parseTicker`, `buildStreamUrl`) live in `shared/api/binance/stream-parse.ts` —
the state machine in `binance/price-stream.ts` only orchestrates I/O.

Price change: flash green if up, red if down — animate via `flash-up` / `flash-down` CSS classes.

## Theme System

Theme is owned by **`next-themes`** — `ThemeProvider` lives in `app/layout.tsx` with `attribute="class"` and `defaultTheme="light"`. The library writes the `.dark` class onto `<html>`; no Zustand theme slice, no vanilla `<script>` bootstrap.

`shared/hooks/useTheme.ts` is a thin wrapper that exposes `{ theme, toggle }`:

```typescript
const { theme, toggle } = useTheme(); // theme: "light" | "dark"
```

Internally it reads `resolvedTheme` from `next-themes` and falls back to `"light"`. Any client component that needs the theme value before paint should use the `mounted` guard pattern (set `mounted=true` in `useEffect`, render a neutral fallback until then) — see `ThemeToggle` — to avoid hydration mismatch.

TradingView chart: update via `chart.applyOptions()` when theme changes — don't recreate the chart.

## Data-Fetch Pattern — TanStack Query

All server data goes through TanStack Query. `QueryProvider` lives in `app/_providers/`
with global defaults: `staleTime: 30_000`, `refetchOnWindowFocus: false`, `retry: 1`.
Per-hook overrides for stable reference data (e.g. `useCoinMeta` sets `staleTime: 30min`
matching the 24h server `unstable_cache`).

| Hook | Returns | Endpoint |
|---|---|---|
| `useCoinMeta(quote)` | `{ names, pairs }` | `/api/coin-meta?quote=X` |
| `useTopCoins(initial)` | `{ symbols, fetching, timedOut }` | `/api/top-coins?quote=…` |
| `useChartData()` | `{ klines, loading, range, setRange, chartType, setChartType }` | Binance `/klines` direct |
| `useQuoteCurrencies()` | `string[]` (fallback `["USDT"]`) | `/api/quote-currencies` |

**Single source of truth**: server data lives in the Query cache only, never duplicated
into Zustand. `usePricesStore` holds streaming prices; `useSelectionStore` holds
`selectedSymbol`/`selectedQuote` (genuine client state). Coin names and tradeable
pairs are read via `useCoinMeta` everywhere they're needed. Multiple consumers
(PriceCard ×N, combobox, filter) share one fetch via the `["coin-meta", quote]` queryKey.

## Mutation + Toast Pattern

All mutations use `useMutation` + `sonner` toasts. The wire call lives in an
entity/feature API file that **throws on `!res.ok`** with the server-provided
error message:

```ts
// entities/portfolio/api.ts
export const createPortfolioPosition = async (input) => {
  const res = await apiFetch("/api/portfolio", { method: "POST", … });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? "Failed to add position");
  return body;
};
```

The hook stays pure orchestration:

```ts
const mutation = useMutation({
  mutationFn: createPortfolioPosition,
  onSuccess: (position, input) => { setPositions([position, ...]); toast.success(`${input.name} added`); },
  onError: (err) => { toast.error("Couldn't add position", { description: err.message }); },
});
```

`isPending` becomes the loading flag; no manual `useState(loading)` + try/finally.
Mutual-exclusion within a hook (e.g. admin role/delete) derives `loadingId` from
each mutation's `variables` while `isPending`.

## Entity API Layer (FSD)

Domain-scoped REST calls live in `entities/<entity>/api.ts` (`createPortfolioPosition`,
`deletePortfolioPosition`, `createWatchlistItem`, `deleteWatchlistItem`).
Feature-scoped calls live in `features/<feature>/api.ts` (admin actions). Functions
return parsed bodies on success, throw `Error(serverMessage)` on `!ok`. Consumer
hooks (in `features/`) compose these via `useMutation` + toasts — no inline `fetch`
inside `mutationFn`.

## Quote-Aware Form Independence

`AddPositionForm` (in `features/add-to-portfolio`) is fully decoupled from the global `selectedQuote` in both directions:
- It defaults to a hardcoded `"USDT"` on every mount — never reads `useSelectionStore.getState().selectedQuote`.
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

Wrapping pattern: all imperative state lives in `widgets/candlestick-chart/use-candlestick-chart.ts` (chart instance, series controller, theme/data/live-tick effects, `useResizeObserver`). The component is a thin `<div ref>` consumer.

Series swap on `chartType` change happens internally via `chart.removeSeries(old) + addSeries(new)` from `chart-series.ts` — the controller returns `{ setData, updateLive, destroy }` per type so the consumer never casts `ISeriesApi<"…">`. **Do not** force-remount with `key={chartType}` on the parent — the swap is in-place. Theme changes flow through `applyOptions()`; never recreate the chart.

## Sidebar Responsive Pattern

Three breakpoints, two surfaces:

- `< md` — fixed sidebar hidden; mobile renders a **burger-triggered drawer** (`<Sheet>` over Radix Dialog). Trigger lives in the header (`MobileNavTrigger`), state in `useMobileNavStore` (Zustand), drawer auto-closes on `usePathname` change.
- `md` — icon rail (`md:w-16`), `justify-center`, labels hidden.
- `lg` — expanded (`lg:w-60`), `justify-start`, labels visible.

Both surfaces render the same `SidebarContent` component with `variant: "rail" | "drawer"` so logo/nav-link/profile-card/logout-button stay single-implementation; per-variant Tailwind chains live in `widgets/sidebar/styles.ts` as `styles.rail` / `styles.drawer`.

`main` content margin: `md:ml-16 lg:ml-60` (no margin under `md` since sidebar is off-screen).

## Header Search — Mobile Pattern

- Mobile: icon button → click → title hides, full-width input appears with X to close
- Desktop (`md+`): `SearchCoin` component always visible with dropdown
- The header search picks a coin and routes to `/dashboard` (`setSelectedSymbol + router.push`). Pages where that navigation is contextual noise (e.g. `/watchlist`) pass `showSearch={false}` to `<Header>` to hide it.

## Coin Avatars — `<CoinIcon base="BTC" />`

`shared/ui/coin-icon.tsx` is the single source of truth for coin avatars (used by `PriceCard`, `WatchlistRow`, `PositionRow`, `MarketOverview`, `CoinDetailsPanel`, etc.). It renders a deterministic gradient circle immediately and crossfades the real SVG/PNG on top once it loads.

- **CDN chain** in `shared/lib/coin-icon.ts` as `CDN_BUILDERS`: atomiclabs/cryptocurrency-icons first (crisp SVGs, top ~500 coins), then assets.coincap.io (PNG, long-tail). Component tracks `cdnIdx`, `advanceCdn` (functional updater) bumps it on `onError`. Add another CDN by appending to `CDN_BUILDERS`.
- **Placeholder gradient** is deterministic per base via a small string-hash → palette lookup in `shared/lib/coin-gradient.ts` (`getCoinGradient(base)`). Same base always picks the same gradient so the avatar feels stable across renders. **Gradient must include direction** (`bg-gradient-to-br`) — `from-X to-Y` alone paints nothing.
- **Letter fallback (`base[0]`) shows ONLY when the CDN chain is exhausted** — during loading the user sees the plain gradient circle, never a letter that gets covered by the icon a moment later.
- **SSR/hydration race fix**: `<img onLoad>` does not fire if the browser finishes the request before React hydrates. The component reads `imgRef.current.complete` / `naturalWidth` inside a `useEffect([cdnIdx])` to either `setLoaded(true)` or `advanceCdn()`. Do not remove this effect — without it SSR'd icons stick at opacity-0. See [[feedback_img_hydration_race]].
- **No `loading="lazy"`** — these icons are tiny and in-viewport; deferring hurts more than it helps on iOS Safari.

Never re-introduce hardcoded `COIN_ICONS` or `COIN_COLORS` maps. New coins are discovered dynamically, so any static table immediately falls behind.

## Watchlist Toggle — `<WatchlistStarButton />`

`shared/ui/watchlist-star-button.tsx` is the unified star-toggle for adding/removing a symbol from the watchlist. Both the dashboard `PriceCard` and the watchlist table reuse it — do not re-implement the toggle inline in a feature. It is a **pure presentational button**: `{ isWatched, onToggle, disabled, size?, stopPropagation? }` — no store reads, no mutation logic. The caller owns `isWatched` (per-symbol boolean selector), `onToggle` (closure that calls the matching feature hook), and `disabled` (loading flag from the mutation). That keeps `shared/ui` free of domain coupling.

## PriceCard Decomposition

`entities/coin/ui/price-card/` is split into small components rather than one monolith:

```
index.tsx              — composition + early-return for "no ticker yet"
PriceCardHeader.tsx    — avatar + base/quote + name
PriceBody.tsx          — large price number + flash class
PriceChangeBadge.tsx   — 24h % badge (color + arrow)
use-price-flash.ts     — hook: returns "flash-up"/"flash-down"/"" based on last tick
styles.ts              — Tailwind class strings
```

`PriceCard` is presentational and **never imports features** (FSD: entity ↛ feature). It receives `{ ticker, selected, onClick, isWatched, onToggleWatch, toggling }` as props. The smart wrapper that owns the per-symbol subscription AND the watchlist-feature wiring lives one layer up: `widgets/market-overview/LivePriceCard.tsx` calls `useAddToWatchlist`/`useRemoveFromWatchlist`, computes `isWatched` from a per-symbol boolean selector, builds `onToggleWatch`, and passes everything down. The parent `MarketOverview` itself holds zero `prices`-related subscriptions.

The same shape (header / body / change / styles + a per-concern hook) is the default when a card-shaped widget grows past ~80 lines — see `CoinDetailsPanel` (`CoinHeader`, `PriceBlock`, `StatRow`, `get-stat-rows.ts`) for the same template. Combobox/dropdown variant: `coin-combobox` and `search-coin` follow the same split (`index.tsx` + `Dropdown.tsx` + per-row component + `styles.ts`); each row subscribes to its own `prices[symbol]`, never to the global `prices` map.

## SearchCoin REST Snapshot — Non-Streamed Symbols

The dashboard WS only streams prices for the active sets (top-N, watchlist, portfolio, selected). Search results frequently fall outside that set — long-tail coins would render without prices.

`features/search-coin/use-search-tickers-snapshot.ts` fires a single batched `/ticker/24hr?symbols=[…]` REST call (Binance `data-api.binance.vision`) when the dropdown opens, parses the response into our `CoinTicker` shape, and writes each row into the Zustand `prices` slice via `updatePrice`. Cached per symbol-list with `staleTime: 30s` via TanStack Query. The snapshots stay in `prices` for the rest of the session — harmless, and they get overwritten naturally if WS later picks them up.

Move the `useCoinFilter` subscription into the dropdown too — the parent `SearchCoin` then has zero subscriptions on the live path (just local `query`/`open` state + stable `setSelectedSymbol`), and quote switches don't re-render the closed search input.

## Loading State Pattern — Streaming Tables

For rows that depend on streaming prices (Binance WS), split each row into two siblings: the real row and a skeleton row (e.g. `PositionRow` + `PositionRowSkeleton`, `WatchlistRow` + `WatchlistRowSkeleton`). The real row does an early return when its ticker is missing — keeping its main render path free of loading branches:

```tsx
const ticker = usePricesStore((s) => s.prices[item.symbol]);
if (!ticker && initialLoad) return <PositionRowSkeleton group={group} />;
```

Both components must share the same grid columns/styles, otherwise layout jumps when the row swaps in. The skeleton renders ticker-independent fields (avatar, name) immediately and uses `<Skeleton className="w-N h-4" />` for streaming columns.

`initialLoad` is computed from a boolean selector — `usePricesStore((s) => Object.keys(s.prices).length > 0)` — that flips false→true once on the first tick and stays. The parent table never re-renders on subsequent ticks because the boolean is stable; only the per-symbol row subscriptions fire. Adding a new entry in steady state does **not** flash skeletons over previously-loaded rows or summary cards.

## Form State Pattern — `useFormState<T>`

Forms that follow the recurring `values + loading + feedback` shape compose `useFormState<T>` from `shared/hooks`. Generic is `<T extends object>` — accepts any interface (interfaces don't satisfy `Record<string, unknown>` because they don't auto-extend index signatures).

```ts
const { values, setValues, setField, loading, setLoading, feedback, setFeedback } =
  useFormState({ name: "", email: "" });
```

It is a **state-shape primitive only** — no submit/validate/onSuccess options. Domain submit logic stays inline in each feature hook (`useEditProfile`, `useChangePassword`). Do not promote `useFormState` to a configurator (`usePatchForm({validate, buildBody, onSuccess, ...})`) — past attempt was rejected for raising cognitive cost without payoff.

`feedback: { message: string; kind: "success" | "error" } | null` replaces fragile `msg.includes("updated")` substring color inference — choose the kind explicitly when setting feedback.

## Init Form State From Server — Anti-Pattern Warning

When a form needs initial values from the session/user, **pass them as props from the server component**. Never bootstrap inside the client hook with `useEffect` + `useRef` once `useSession()` hydrates — that's the React anti-pattern *You Might Not Need an Effect* (extra render, brief flash of empty inputs, confusing ref flag).

```tsx
// ProfilePage (server) — already has session
<EditProfileForm initial={{ name: session.user.name ?? "", email: session.user.email ?? "" }} />

// useEditProfile(initial) — first-render values are correct:
const { values, setField, ... } = useFormState(initial);
```

`useSession()` may still live inside the hook for `update()` after a successful PATCH — that's a different concern (sync session cache after mutation).

## React Effects — Senior Discipline

`useEffect` is for syncing with **external systems** only (DOM, WebSocket, chart lib,
browser APIs). For state that depends on props/state, prefer:
- **Derived in render** — compute on the fly, no state at all
- **Adjusting state on prop change** — canonical React pattern with prev-state slots
  (see `coin-icon.tsx` resetting load state on `base` change, `coin-combobox` syncing
  query to selectedShort on dropdown close)
- **`useSyncExternalStore`** — for "is this client?" guards (`theme-toggle.tsx`)

Never use `useEffect` to fetch — that's TanStack Query's job. The `react-hooks/
set-state-in-effect` ESLint rule is `warn` (not error) — evaluate per case rather
than blindly silencing.

## shared/ui — Generic Primitives Only

`shared/ui/` holds **reusable UI primitives** with no domain knowledge: Button, Input,
SearchInput, Select, Sheet, ConfirmDialog, Skeleton, CoinIcon, WatchlistStarButton,
DeleteIconButton, ThemeToggle, LabeledField, GoogleIcon. As soon as a component reads
from a domain slice (e.g. `selectedSymbol`, `watchlist`) or wraps an app-shell concern
(next-auth, TanStack Query), it belongs elsewhere:

- Domain-coupled components → `entities/<entity>/ui/`
  (selected-symbol-stream, watchlist-initializer, watchlist-provider, price-card,
  current-user-role-badge)
- App-shell providers → `app/_providers/` (session-provider, query-provider).
  Underscore prefix opts the directory out of Next App Router routing.

### Folder layout convention

- **Single-file primitive** → flat: `shared/ui/button.tsx`, `shared/ui/coin-icon.tsx`.
- **Primitive with paired styles** → folder with `index.tsx` + `styles.ts` (FSD-style),
  so the pair never dangles as two siblings among unrelated files. Examples:
  `shared/ui/sheet/`, `shared/ui/confirm-dialog/`. Import stays `@/shared/ui/sheet`
  (resolves to `index.tsx`) — callsites don't change when a primitive grows from flat
  to folder.

## Internal Routes — `ROUTES` Const

All app routes live in `shared/config/routes.ts` as a `const`-asserted object. Never inline route literals — `import { ROUTES } from "@/shared/config/routes"` and use `ROUTES.dashboard`, `ROUTES.login`, etc. for `router.push`, `redirect`, `Link href`, `signOut callbackUrl`, NextAuth `pages`. API paths (`/api/*`) stay inline — they're a different domain.

## Symbol Helpers — `shared/lib/symbol.ts`

`stripQuote(symbol, quote)` / `swapQuote(symbol, oldQuote, newQuote)`. Use them anywhere `symbol.endsWith(quote) ? symbol.slice(0, -quote.length) : symbol` would appear (currently: `add-to-portfolio`, `coin-combobox`, `search-coin`, `select-quote`).

## Domain SearchInput vs shadcn Input

Two input flavors deliberately, both rendering on the same color tokens (shadcn aliases mapped to project-native variables in `globals.css` `@theme inline`). Visual style differs:

| Pattern | Component | Used by | Style |
|---|---|---|---|
| Form input | `shared/ui/input.tsx` (shadcn `Input`) | login, register, change-password, edit-profile | Transparent, `focus-visible:ring` |
| Search/filter | `shared/ui/search-input.tsx` (`SearchInput`) | `search-coin`, `coin-combobox` | Solid `bg-surface`, `focus:border-accent-indigo`, built-in left icon |

`SearchInput` is `forwardRef` + spreads `ComponentProps<"input">`. Override fill via `className="bg-bg"`, override icon via the `icon` prop. Don't reach for shadcn `Input` for domain UI — its tokens read as a form field, not a search.

## `useFloatingRect` — Portal-Positioned UI

For dropdowns/popovers rendered via `createPortal`, position relative to a referenced element via `shared/hooks/useFloatingRect(ref, active)`. Re-measures on `scroll` (capture phase) and `resize` while active. Use `rect` as a render gate (`{open && rect && <Dropdown rect={rect} />}`) so the portal never renders before position is known. Inside portal-rendered children, **don't add `typeof document === "undefined"` SSR guards** when the parent already gates on client-only state — the guard becomes dead code.

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
