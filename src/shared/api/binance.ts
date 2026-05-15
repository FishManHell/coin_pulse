import type { Kline, TimeRange } from "@/shared/types";
import { BINANCE_BASE as BASE, CG_MARKETS } from "./endpoints";
import { tradingPairs } from "./binance-pairs";
import { buildStablecoinSet } from "./binance-stables";
import type { MiniTicker } from "./binance-types";

export { tradingPairs } from "./binance-pairs";

const MIN_PAIR_VOLUME = 500_000;

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
