import { tradingPairs } from "./binance-pairs";
import type { MiniTicker } from "./binance-types";

const STABLE_PRICE_MIN = 0.99;
const STABLE_PRICE_MAX = 1.01;

// Detect USD stablecoins by price: if a quote asset has a USDT pair priced ≈ $1,
// treat it as a stablecoin. USDT itself is the hardcoded reference.
export const buildStablecoinSet = (tickers: MiniTicker[]): Set<string> => {
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
