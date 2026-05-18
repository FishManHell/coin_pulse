import type { CoinTicker } from "@/entities/coin";

export const makeCoinTicker = (overrides: Partial<CoinTicker> = {}): CoinTicker => ({
  symbol: "BTCUSDT",
  price: 67000,
  priceChange: 1234.56,
  priceChangePercent: 1.87,
  volume: 12345.6789,
  high24h: 68000,
  low24h: 66500,
  ...overrides,
});
