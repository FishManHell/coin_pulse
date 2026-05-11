import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import type { CoinMeta, CoinMetaResponse } from "@/shared/types";
import { BINANCE_BASE, CG_MARKETS } from "@/shared/api/endpoints";

// ticker/price (~135KB) lists every currently-traded symbol;
// exchangeInfo (~22MB) blows past Next data cache's 2MB per-item limit.
const BINANCE_TICKERS = `${BINANCE_BASE}/ticker/price`;

interface CGCoin {
  symbol: string;
  name: string;
}
interface Ticker {
  symbol: string;
  price: string;
}

const loadCoinMeta = unstable_cache(
  async (quote: string): Promise<CoinMetaResponse | null> => {
    const [cgRes, tickerRes] = await Promise.all([
      fetch(CG_MARKETS, { cache: "no-store" }),
      fetch(BINANCE_TICKERS, { cache: "no-store" }),
    ]);

    if (!cgRes.ok || !tickerRes.ok) return null;

    const cgCoins: CGCoin[] = await cgRes.json();
    const tickers: Ticker[] = await tickerRes.json();

    const names: Record<string, string> = {};
    for (const { symbol, name } of cgCoins) names[symbol.toUpperCase()] = name;

    const tradingBases = new Set<string>();
    for (const { symbol } of tickers) {
      if (symbol.endsWith(quote)) tradingBases.add(symbol.slice(0, -quote.length));
    }

    const pairs: CoinMeta[] = cgCoins
      .filter((c) => tradingBases.has(c.symbol.toUpperCase()))
      .map((c) => ({ symbol: `${c.symbol.toUpperCase()}${quote}`, name: c.name }));

    return { names, pairs };
  },
  ["coin-meta-v2"],
  { revalidate: 86400 },
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const quote = (searchParams.get("quote") ?? "USDT").toUpperCase();

  const data = await loadCoinMeta(quote);
  if (!data) {
    return NextResponse.json<CoinMetaResponse>({ names: {}, pairs: [] }, { status: 502 });
  }
  return NextResponse.json<CoinMetaResponse>(data);
}
