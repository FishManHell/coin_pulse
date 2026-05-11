// data-api.binance.vision is Binance's public CDN mirror for market data —
// avoids geo-blocks that hit api.binance.com from US-based serverless regions.
export const BINANCE_BASE = "https://data-api.binance.vision/api/v3";

export const CG_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1";
