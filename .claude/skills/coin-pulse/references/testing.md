# Testing Reference — CoinPulse

## Stack

- Jest + React Testing Library — component and unit tests
- jest-environment-jsdom — browser environment simulation
- msw (Mock Service Worker) — mock API routes in tests
- mongodb-memory-server — in-memory MongoDB for API route tests

## What to Test

**shared/lib and entities** — pure functions, formatters, Zustand store logic, utility helpers.
These have no side effects and are easiest to cover.

**features** — user interactions: does addToWatchlist call the correct endpoint?
Does the Zustand store update after a successful response?

**widgets** — render tests: does the component display the correct data?
Does it respond to prop changes correctly?

**API routes** — integration tests using in-memory MongoDB.
Full flow: request → session check → validation → DB write → response shape.

## What NOT to Test

- Binance WebSocket connection directly — mock the Zustand store instead
- NextAuth internals — it is a library, not our code
- Tailwind class names — not behavior

## Test File Location

Tests live next to the file they test, inside a `__tests__/` folder within the same FSD slice:

```
shared/lib/__tests__/formatPrice.test.ts
entities/coin/__tests__/PriceCard.test.tsx
features/addToWatchlist/__tests__/addToWatchlist.test.ts
widgets/WatchlistTable/__tests__/WatchlistTable.test.tsx
app/api/watchlist/__tests__/route.test.ts
```

## Rules

- Test behavior, not implementation — assert what the user sees or what the API returns
- One focused assertion per test when possible
- Descriptive test names: `"should show red color when price decreases"`
- Never make real network calls — mock Binance WS, Google OAuth, and external APIs
- API tests use mongodb-memory-server — never connect to Atlas in tests
- Mock session with `getServerSession` return value — do not run real auth in tests
- Keep test data minimal — only what the specific case needs

## External Docs

- Jest: https://jestjs.io/docs/getting-started
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro
- msw: https://mswjs.io/docs
- mongodb-memory-server: https://github.com/typegoose/mongodb-memory-server
