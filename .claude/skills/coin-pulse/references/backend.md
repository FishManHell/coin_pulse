# Backend Reference — CoinPulse

## API Routes Structure

```
app/api/
  auth/[...nextauth]/route.ts     — NextAuth handler (credentials + Google)
  auth/register/route.ts          — POST register new user
  watchlist/
    route.ts                      — GET list, POST add coin (upsert)
    [symbol]/route.ts             — DELETE remove coin
  portfolio/
    route.ts                      — GET list, POST add position
    [id]/route.ts                 — DELETE remove position
  admin/
    users/route.ts                — GET all users (admin+)
    users/[id]/route.ts           — PATCH update user, DELETE remove user
  profile/route.ts                — PATCH own profile + password change
```

## Auth — NextAuth v4 Config

- Strategy: JWT, token lives 7 days
- Credentials provider: email + password verified against bcrypt hash (10 rounds)
- Google provider: OAuth, no password stored
- Same email from both providers → linked to one User document
- Config lives in `entities/user/lib/auth-config.ts`

### JWT Callback — Critical Notes

Always use `.lean()` when querying MongoDB in jwt callback — without it Mongoose may
strip fields like `role` if the model was cached with an older schema:

```typescript
const dbUser = await User.findOne({ email: user.email }).lean();
```

Fallback: if token exists but has no role (old token), fetch role from DB automatically:

```typescript
if (!token.role && token.id) {
  const dbUser = await User.findById(token.id).select("role").lean();
  if (dbUser) token.role = dbUser.role;
}
```

Session types extended in `shared/types/next-auth.d.ts`.

## Mongoose DB Singleton

Lives in `shared/lib/db.ts`. Checks connection state before connecting.
MONGODB_URI check happens inside `connectDB()`, NOT at module level —
otherwise Next.js build fails when collecting page data without env vars.

```typescript
const connectDB = async () => {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");
  if (cached.conn) return cached.conn;
  // ...
};
```

## Mongoose Models

Models live in `models/` (server-only). Use `mongoose.models.X ?? mongoose.model(...)` pattern.

- `User` — name, email, password (nullable), image, role (enum from USER_ROLES), createdAt
- `WatchlistItem` — userId (ref User), symbol, name, addedAt. Unique index on (userId, symbol).
- `PortfolioPosition` — userId (ref User), symbol, name, quantity, buyPrice, createdAt

## Role-Based Protection Pattern

```typescript
const session = await getServerSession(authOptions);
const role = session?.user?.role;

if (!role || !ROLE_PERMISSIONS.canAccessSettings(role)) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

Always use `ROLE_PERMISSIONS` from `shared/types/roles.ts` — never hardcode role strings.

## Protected Route Pattern (general)

1. `getServerSession(authOptions)` — returns null if not logged in
2. Return 401 if no session
3. Connect to DB with `connectDB()`
4. Validate request body
5. Perform DB operation scoped by `session.user.id`
6. Return `NextResponse.json(data, { status })`

## Error Handling

Always return consistent error shape: `{ error: string }` with correct HTTP status.

| Status | When |
|--------|------|
| 200    | Success (GET, PUT, DELETE) |
| 201    | Created (POST) |
| 400    | Missing or invalid request body |
| 401    | No session |
| 403    | Insufficient role |
| 404    | Resource not found |
| 500    | Unexpected server error |

## Security Rules

- Passwords: bcrypt, 10 rounds — never store plaintext
- All secrets in `.env.local` — never in source code
- Always scope DB queries by `userId` — users must never access each other's data
- Admin routes: double-check role on both list and mutation endpoints
- superadmin cannot be deleted by admin — check `canChangeRole` before mutating

## Binance Trading Pairs — Build-Time Snapshot

Trading-pair metadata (`symbol → quoteAsset` map) is snapshotted to
`shared/api/binance-pairs.generated.json` at build time by
`scripts/generate-binance-pairs.mjs`, run as `prebuild` in `package.json`.
`shared/api/binance.ts` imports the JSON and exposes a module-level Map.

**Never fetch `/api/v3/exchangeInfo` at runtime.** The response is ~22MB and
exceeds Next 16's data cache 2MB per-item limit; `cache: "no-store"` is
ignored by Turbopack data cache, so every `/api/top-coins` and
`/api/quote-currencies` hit would re-download the full payload (visible as
slow page transitions).

The script overwrites the JSON on every successful run and falls back to
keeping the existing snapshot on transient fetch failures, so deploys don't
break on Binance outages. Snapshot is committed to the repo (so `yarn dev`
on a fresh clone works without network access).

To force-refresh locally: `node scripts/generate-binance-pairs.mjs`.

## Binance WebSocket API

Public stream, no authentication required.
Base URL: `wss://stream.binance.com:9443`

- Combined stream (use this): `/stream?streams=btcusdt@ticker/ethusdt@ticker`
- Single stream: `/ws/btcusdt@ticker`
- Combined stream response: `{ stream: "btcusdt@ticker", data: { s, c, P, p, v, h, l } }`

Kline (candlestick) REST: `GET https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=168`
Max limit per request: 1000 candles.

## External Docs

- NextAuth: https://next-auth.js.org
- Mongoose: https://mongoosejs.com
- Binance WS: https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams
- Binance REST Klines: https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
