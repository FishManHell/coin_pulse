# Testing Reference — CoinPulse

## Stack

- **Vitest 4** — modern, native ESM + TS, fast esbuild transform.
- **Default env: `node`.** Pure-logic suites need nothing else.
- **DOM tests opt in per file** with the header `// @vitest-environment jsdom`. (jsdom + `@testing-library/react` aren't installed yet — added when first component test arrives.)
- Path alias `@/*` resolved natively via Vitest 4's `resolve.tsconfigPaths` (no plugin needed).

## Scripts

- `npm test` — single-run, CI-friendly (`vitest run`).
- `npm run test:watch` — watch mode for local TDD (`vitest`).

## Test File Location

**Co-located**, alongside the source file:

```
src/shared/lib/utils.ts
src/shared/lib/utils.test.ts          ← here, not in __tests__/

src/entities/portfolio/serializers.ts
src/entities/portfolio/serializers.test.ts
```

This keeps tests visible next to the code they exercise; the include glob `src/**/*.{test,spec}.{ts,tsx}` picks them up. Don't introduce `__tests__/` directories — the FSD layout stays flat per slice.

## Current Coverage — Tier 1 (pure logic)

Established 2026-05-18, 64 tests across 11 files. Coverage focuses on units that ship with no side effects and would fail silently in production:

| Layer | Module | What's tested |
|---|---|---|
| shared/api/binance | `stream-parse.ts` | `parseTicker`, `buildStreamUrl` — wire-format → domain |
| shared/api/binance | `stables.ts` | Stable detection via USDT pair price window |
| shared/lib | `symbol.ts` | `stripQuote`, `swapQuote` |
| shared/lib | `parse-quote.ts` | `parseQuoteFromSymbol` — DB backfill logic |
| shared/lib | `utils.ts` | `formatPrice`/`formatPercent`/`formatVolume` — boundary cases |
| shared/lib | `api-response.ts` | `apiError` + `ERRORS` shorthands |
| shared/lib | `validate.ts` | `requireString` accept/reject paths |
| entities/watchlist | `serializers.ts` | Mongoose Lean → DTO; quote backfill |
| entities/portfolio | `serializers.ts` | Mongoose Lean → DTO; numeric preservation |
| widgets/portfolio-table | `group-positions.ts` | P&L aggregation: totals, weighted avg, sort order |
| widgets/coin-details-panel | `get-stat-rows.ts` | Stat row generation, color tagging |

## Coverage Planned — Future Tiers

- **Tier 2** — Zustand stores: `usePricesStore.updatePrice` merge, watchlist/portfolio setters. Cheap to write.
- **Tier 3** — React hooks: `useFormState`, `useStaleAfter`, `useCoinFilter`, `usePriceFlash`. Needs jsdom + `@testing-library/react` (`renderHook`).
- **Tier 4** — Forms: `AddPositionForm` (pair selection + validation), `ChangePasswordForm`, `EditProfileForm`. Needs jsdom + RTL + `user-event`.
- **Tier 5** — Smart containers: `LivePriceCard`, `PositionRow`, `LiveSummaryCards`. Same DOM deps as Tier 4.
- **Tier 6** — API routes: integration with `mongodb-memory-server`, `getServerSession` mocked. Highest infra cost — deferred until business logic shifts make regressions likely.

## What NOT to Test

- Pure presentational primitives (`PriceCard`, `Button`, `SearchInput`, `SkeletonCard`, `EmptyState`) — no behavior beyond rendering props.
- Sidebar/Header layout — composition is the value, easier to verify by eye.
- `styles.ts` files (Tailwind class strings) — not behavior.
- `chart-theme.ts` and other static config — trivial.
- Binance WebSocket internals (`price-stream.ts` singleton) — assert against `usePricesStore` instead when needed.
- NextAuth internals — third-party.

## Shared Fixtures

Reusable test data lives in `src/test/fixtures/` (a parallel tooling dir, not an FSD layer). Import via `@/test/fixtures`:

```ts
import { makeCoinTicker, makePortfolioPosition, makeWatchlistItemLean } from "@/test/fixtures";

const ticker = makeCoinTicker({ price: 70_000 }); // override only what the test needs
```

Current factories:
- `makeCoinTicker(overrides?)` — `CoinTicker` (default `BTCUSDT` @ $67k)
- `makePortfolioPosition(overrides?)` / `makePortfolioPositionLean(overrides?)` — DTO + Mongoose Lean shape (new `ObjectId` per call)
- `makeWatchlistItem(overrides?)` / `makeWatchlistItemLean(overrides?)` — same pattern for watchlist

Rule of thumb: a factory belongs in `src/test/fixtures/` when **3+ test files** (current or planned) construct the same shape. One-off shapes (e.g. Binance wire events `BinanceTickerEvent`, `MiniTicker`) stay inline.

## Conventions

- **Explicit imports** from `vitest` (`import { describe, it, expect } from "vitest"`). No globals.
- **Use shared fixture factories** from `@/test/fixtures` when available; create new inline factories only for shapes that don't qualify for sharing.
- **Test the contract, not the wiring**: `expect(result).toEqual(...)` against the public output, not internal state.
- **Document known quirks** in the test name or comment when the unit's behavior is unexpected (e.g. `formatPrice(-543)` falling into the 8-decimal branch because `>=` is not abs-aware). Future refactors then break the test loudly.
- **Mock module-level singletons** (e.g. `./pairs`) with `vi.mock` to keep the test universe deterministic against snapshot regeneration.
- **One focused assertion per test** when possible; group related assertions only when they exercise the same code path.

## Running One File

```
npm test -- stream-parse        # filename substring
npm test -- src/shared/lib      # path prefix
```
