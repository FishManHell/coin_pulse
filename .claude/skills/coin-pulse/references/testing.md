# Testing Reference — CoinPulse

## Stack

- **Vitest 4** — modern, native ESM + TS, fast esbuild transform.
- **Default env: `node`.** Pure-logic suites need nothing else.
- **DOM tests opt in per file** with the header `// @vitest-environment jsdom`. `jsdom` + `@testing-library/react` + `@testing-library/dom` are installed for `renderHook`-style tests.
- Path alias `@/*` resolved natively via Vitest 4's `resolve.tsconfigPaths` (no plugin needed).
- Build gate: `vitest run` chains after the binance-pairs generator in the `prebuild` script, so Vercel and CI fail on red tests. The `prebuild` step explicitly sets `NODE_ENV=test` for the vitest invocation — otherwise React 19's production bundle is loaded inside the worker and `React.act` becomes undefined, breaking RTL.

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

## Testing Strategy: pure-extract pattern

When asked to add tests for a component, form, hook, or API route, the **first** move is: look at what's inside, find the actual business logic (derivations, math, validation, permission predicates), and **extract it into a pure function**. Then write unit tests against the pure function. Skip RTL/user-event/QueryClient/`mongodb-memory-server` setup unless the value is clearly there.

Why: this scales better than mocking the integration surface. Smaller infra, faster tests, regression-proof for business logic, and production code gets cleaner as React-glue and business-logic separate.

Examples from this codebase:
- Form (`AddPositionForm`) → `deriveEffectiveSymbol` (pure) tested; RTL+user-event skipped.
- Smart container (`PositionRow` / `LiveSummaryCards`) → `computePositionPnl` / `computePortfolioPnl` (pure) tested; the surrounding view + 4-store subscription is left for the eye.
- API route (`portfolio POST`) → `parsePortfolioPayload` (pure) tested; `mongodb-memory-server` skipped — the route's DB call is glue.
- RBAC → `ROLE_PERMISSIONS` predicates tested directly (already pure). Security-critical regressions catch in unit, not in `admin/users/[id]` integration.

Rules of thumb:
- If the extraction target is 1-2 lines (e.g. `!symbol || !name`), it's below abstraction threshold — skip the test entirely.
- If after extracting, the remaining glue is trivial, **don't** also test the glue. Visible UI bugs surface in dev; silent logic bugs don't. Tests defend against silent.
- For security-critical predicates (RBAC, auth gates), test even small ones — silent regressions = privilege escalation.

## Current Coverage — 125 tests across 22 files

By tier (the labels are loose — what matters is the pattern, not the number):

| Tier | Layer | Modules tested |
|---|---|---|
| 1 | shared/api/binance | `stream-parse.ts` (parseTicker, buildStreamUrl), `stables.ts` |
| 1 | shared/lib | `symbol.ts`, `parse-quote.ts`, `utils.ts`, `api-response.ts`, `validate.ts` |
| 1 | entities (serializers) | `portfolio/serializers.ts`, `watchlist/serializers.ts` |
| 1 | widgets | `portfolio-table/group-positions.ts`, `coin-details-panel/get-stat-rows.ts` |
| 2 | entities (stores) | `coin/model/store.ts` (`usePricesStore`), `watchlist/model/store.ts`, `portfolio/model/store.ts` |
| 2 | shared/store | `selection-store.ts` |
| 3 | shared/hooks | `useStaleAfter.ts` |
| 3 | entities/coin/ui | `use-price-flash.ts` |
| 4 | features/add-to-portfolio | `derive-effective-symbol.ts` (extracted from `usePositionForm`) |
| 5 | widgets/portfolio-table | `compute-position-pnl.ts`, `compute-portfolio-pnl.ts` (extracted from `PositionRow`, `LiveSummaryCards`) |
| 6 | entities/portfolio | `parse-payload.ts` (extracted from `portfolio POST`) |
| 6 | shared/types | `roles.ts` (`ROLE_PERMISSIONS` predicates, `isValidRole`) |

Hook tests use `renderHook` from `@testing-library/react` with fake timers (`vi.useFakeTimers()`).

## What NOT to Test (explicit skips)

- Pure presentational primitives (`PriceCard`, `Button`, `SearchInput`, `SkeletonCard`, `EmptyState`) — no behavior beyond rendering props.
- Sidebar/Header layout — composition is the value, easier to verify by eye.
- `styles.ts` files (Tailwind class strings) — not behavior.
- `chart-theme.ts` and other static config — trivial.
- Binance WebSocket internals (`price-stream.ts` singleton) — assert against `usePricesStore` instead when needed.
- NextAuth internals — third-party.
- `useFormState` — thin `useState` wrapper, no logic worth testing.
- `useCoinFilter` — trivial `includes`/`slice` over an in-memory list; bugs visible on first UI use.
- `LivePriceCard` — 4-store + 2-hook mock surface for ~2 lines of glue (net negative).
- `ChangePasswordForm`, `EditProfileForm` — fetch-POST glue; if regressions hide here, they hide at the e2e level, not unit.
- `coin-meta` route — external API integration (Binance + CoinGecko + `unstable_cache`); not a unit-test target.
- `profile PATCH` cascade and `auth/register` password rule — marginal, regressions visible through the auth/profile UI.
- DB-touching paths in routes (`PortfolioPosition.create`, `User.findById`, etc.) — covered transitively by serializer + validator tests; not running `mongodb-memory-server` for a solo Vercel project.

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

Rule of thumb: a factory belongs in `src/test/fixtures/` when **3+ test files** (current or planned) construct the same shape. One-off shapes (e.g. Binance wire events `BinanceTickerEvent`, `MiniTicker`, or `GroupedPosition` used in `compute-*-pnl.test.ts`) stay inline.

## Conventions

- **Explicit imports** from `vitest` (`import { describe, it, expect } from "vitest"`). No globals.
- **Use shared fixture factories** from `@/test/fixtures` when available; create new inline factories only for shapes that don't qualify for sharing.
- **Test the contract, not the wiring**: `expect(result).toEqual(...)` against the public output, not internal state.
- **Document known quirks** in the test name or comment when the unit's behavior is unexpected (e.g. `formatPrice(-543)` falling into the 8-decimal branch because `>=` is not abs-aware). Future refactors then break the test loudly.
- **Mock module-level singletons** (e.g. `./pairs`) with `vi.mock` to keep the test universe deterministic against snapshot regeneration.
- **One focused assertion per test** when possible; group related assertions only when they exercise the same code path (or when the test name describes a rule, e.g. `"allows superadmin and admin only"` with 4 inline asserts).
- **Prefer plain `it()` blocks over `it.each` for ≤4 trivial cases** — semantic test names beat parameterization for small matrices.

## Running One File

```
npm test -- stream-parse        # filename substring
npm test -- src/shared/lib      # path prefix
```
