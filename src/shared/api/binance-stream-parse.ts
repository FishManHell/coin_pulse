import type { CoinTicker } from "@/shared/types";
import type { BinanceTickerEvent } from "./binance-types";

const BINANCE_WS_BASE = "wss://stream.binance.com:9443";

export const parseTicker = (event: BinanceTickerEvent): CoinTicker => ({
  symbol: event.s,
  price: parseFloat(event.c),
  priceChange: parseFloat(event.p),
  priceChangePercent: parseFloat(event.P),
  volume: parseFloat(event.v),
  high24h: parseFloat(event.h),
  low24h: parseFloat(event.l),
});

export const buildStreamUrl = (symbols: string[]): string => {
  const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
  return `${BINANCE_WS_BASE}/stream?streams=${streams}`;
};
