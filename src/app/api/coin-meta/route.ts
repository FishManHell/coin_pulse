import { NextResponse } from "next/server";
import type { CoinMeta, CoinMetaResponse } from "@/shared/types";

export const revalidate = 86400;

const CG_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1";
const BINANCE_EXCHANGE = "https://data-api.binance.vision/api/v3/exchangeInfo";

type CGCoin = { symbol: string; name: string };
type ExSymbol = { symbol: string; status: string; baseAsset: string; quoteAsset: string };

export async function GET() {
  const [cgRes, exRes] = await Promise.all([
    fetch(CG_MARKETS),
    // exchangeInfo (~22MB) exceeds Next data cache 2MB per-item limit
    fetch(BINANCE_EXCHANGE, { cache: "no-store" }),
  ]);

  if (!cgRes.ok || !exRes.ok) {
    return NextResponse.json<CoinMetaResponse>({ names: {}, pairs: [] }, { status: 502 });
  }

  const cgCoins: CGCoin[] = await cgRes.json();
  const exData: { symbols: ExSymbol[] } = await exRes.json();

  const names: Record<string, string> = {};
  for (const { symbol, name } of cgCoins) names[symbol.toUpperCase()] = name;

  const tradingUsdtBases = new Set<string>();
  for (const s of exData.symbols) {
    if (s.status === "TRADING" && s.quoteAsset === "USDT") tradingUsdtBases.add(s.baseAsset);
  }

  const pairs: CoinMeta[] = cgCoins
    .filter((c) => tradingUsdtBases.has(c.symbol.toUpperCase()))
    .map((c) => ({ symbol: `${c.symbol.toUpperCase()}USDT`, name: c.name }));

  return NextResponse.json<CoinMetaResponse>({ names, pairs });
}
