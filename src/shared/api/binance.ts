import type { Kline, TimeRange } from "@/shared/types";
import binancePairs from "./binance-pairs.generated.json";

// data-api.binance.vision is the public CDN mirror for market data —
// avoids geo-blocks that hit api.binance.com from US-based serverless regions.
const BASE = "https://data-api.binance.vision/api/v3";

const CG_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1";

const MIN_PAIR_VOLUME = 500_000;
const STABLE_PRICE_MIN = 0.99;
const STABLE_PRICE_MAX = 1.01;

type MiniTicker = { symbol: string; lastPrice: string; quoteVolume: string };

// Reference data snapshotted at build time by scripts/generate-binance-pairs.mjs.
// Avoids fetching the 22MB exchangeInfo response at runtime (exceeds Next data
// cache 2MB per-item limit and would re-download on every revalidation).
const tradingPairs = new Map<string, string>(binancePairs as [string, string][]);

// Detect USD stablecoins by price: if a quote asset has a USDT pair priced ≈ $1,
// treat it as a stablecoin. USDT itself is the hardcoded reference.
const buildStablecoinSet = (tickers: MiniTicker[]): Set<string> => {
  const stables = new Set<string>(["USDT"]);

  const usdtPriceMap = new Map<string, number>();
  for (const { symbol, lastPrice } of tickers) {
    if (symbol.endsWith("USDT")) {
      usdtPriceMap.set(symbol.slice(0, -4), parseFloat(lastPrice));
    }
  }

  const quoteAssets = new Set(tradingPairs.values());
  for (const quote of quoteAssets) {
    if (quote === "USDT") continue;
    const price = usdtPriceMap.get(quote);
    if (price !== undefined && price >= STABLE_PRICE_MIN && price <= STABLE_PRICE_MAX) {
      stables.add(quote);
    }
  }

  return stables;
};

export const fetchQuoteCurrencies = async (limit = 2): Promise<string[]> => {
  const tickersRes = await fetch(`${BASE}/ticker/24hr?type=MINI`, {
    next: { revalidate: 3600 },
  });
  if (!tickersRes.ok) throw new Error(`Binance ticker error: ${tickersRes.status}`);

  const tickers: MiniTicker[] = await tickersRes.json();
  const stables = buildStablecoinSet(tickers);

  const volumeByQuote = new Map<string, number>();
  for (const { symbol, quoteVolume } of tickers) {
    const quote = tradingPairs.get(symbol);
    if (quote && stables.has(quote)) {
      volumeByQuote.set(quote, (volumeByQuote.get(quote) ?? 0) + parseFloat(quoteVolume));
    }
  }

  return [...volumeByQuote.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([quote]) => quote);
};

export const fetchTopSymbols = async (limit = 6, quote = "USDT"): Promise<string[]> => {
  const [tickersRes, cgRes] = await Promise.all([
    fetch(`${BASE}/ticker/24hr?type=MINI`, { next: { revalidate: 60 } }),
    fetch(CG_MARKETS, { next: { revalidate: 86400 } }),
  ]);
  if (!tickersRes.ok) throw new Error(`Binance ticker error: ${tickersRes.status}`);

  const tickers: MiniTicker[] = await tickersRes.json();
  const stables = buildStablecoinSet(tickers);
  const cgCoins: { symbol: string }[] = cgRes.ok ? await cgRes.json() : [];
  const cryptoSet = new Set(cgCoins.map((c) => c.symbol.toUpperCase()));

  return tickers
    .filter(
      (t) =>
        t.symbol.endsWith(quote) &&
        !stables.has(t.symbol.slice(0, -quote.length)) &&
        cryptoSet.has(t.symbol.slice(0, -quote.length)) &&
        parseFloat(t.quoteVolume) >= MIN_PAIR_VOLUME
    )
    .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
    .slice(0, limit)
    .map((t) => t.symbol);
};

const RANGE_CONFIG: Record<TimeRange, { interval: string; limit: number }> = {
  "1H":  { interval: "1m",  limit: 60  },
  "24H": { interval: "5m",  limit: 288 },
  "1W":  { interval: "1h",  limit: 168 },
  "1M":  { interval: "4h",  limit: 180 },
  "1Y":  { interval: "1d",  limit: 365 },
};

export const fetchKlines = async (symbol: string, range: TimeRange): Promise<Kline[]> => {
  const { interval, limit } = RANGE_CONFIG[range];
  const res = await fetch(
    `${BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    { next: { revalidate: 0 } }
  );
  if (!res.ok) throw new Error(`Binance klines error: ${res.status}`);

  const raw: number[][] = await res.json();
  return raw.map((k) => ({
    time:   Math.floor(k[0] / 1000),
    open:   parseFloat(k[1] as unknown as string),
    high:   parseFloat(k[2] as unknown as string),
    low:    parseFloat(k[3] as unknown as string),
    close:  parseFloat(k[4] as unknown as string),
    volume: parseFloat(k[5] as unknown as string),
  }));
};
