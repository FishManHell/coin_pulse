// Backfill parser for legacy WatchlistItem/PortfolioPosition rows that lack
// a `quote` field. New writes always carry quote explicitly, so the universe
// here is only the stables the app has ever surfaced via QuoteSelector.
const KNOWN_QUOTES = ["USDT", "USDC"] as const;

export const parseQuoteFromSymbol = (symbol: string, fallback = "USDT"): string => {
  for (const quote of KNOWN_QUOTES) {
    if (symbol.length > quote.length && symbol.endsWith(quote)) return quote;
  }
  return fallback;
};
