export interface CoinTicker {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  iconUrl?: string;
}

export interface Kline {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeRange = "1H" | "24H" | "1W" | "1M" | "1Y";

export interface CoinMeta {
  symbol: string;
  name: string;
}

export interface CoinMetaResponse {
  names: Record<string, string>;
  pairs: CoinMeta[];
}
