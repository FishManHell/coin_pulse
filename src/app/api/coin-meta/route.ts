import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import type { CoinMeta, CoinMetaResponse } from "@/shared/types";

const CG_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1";
// ticker/price (~135KB) lists every currently-traded symbol;
// exchangeInfo (~22MB) blows past Next data cache's 2MB per-item limit.
const BINANCE_TICKERS = "https://data-api.binance.vision/api/v3/ticker/price";

type CGCoin = { symbol: string; name: string };
type Ticker = { symbol: string; price: string };

const loadCoinMeta = unstable_cache(
  async (): Promise<CoinMetaResponse | null> => {
    const [cgRes, tickerRes] = await Promise.all([
      fetch(CG_MARKETS, { cache: "no-store" }),
      fetch(BINANCE_TICKERS, { cache: "no-store" }),
    ]);

    if (!cgRes.ok || !tickerRes.ok) return null;

    const cgCoins: CGCoin[] = await cgRes.json();
    const tickers: Ticker[] = await tickerRes.json();

    const names: Record<string, string> = {};
    for (const { symbol, name } of cgCoins) names[symbol.toUpperCase()] = name;

    const tradingUsdtBases = new Set<string>();
    for (const { symbol } of tickers) {
      if (symbol.endsWith("USDT")) tradingUsdtBases.add(symbol.slice(0, -4));
    }

    const pairs: CoinMeta[] = cgCoins
      .filter((c) => tradingUsdtBases.has(c.symbol.toUpperCase()))
      .map((c) => ({ symbol: `${c.symbol.toUpperCase()}USDT`, name: c.name }));

    return { names, pairs };
  },
  ["coin-meta-v1"],
  { revalidate: 86400 },
);

export async function GET() {
  const data = await loadCoinMeta();
  if (!data) {
    return NextResponse.json<CoinMetaResponse>({ names: {}, pairs: [] }, { status: 502 });
  }
  return NextResponse.json<CoinMetaResponse>(data);
}
