export type CoinTicker = {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  high24h: number;
  low24h: number;
  iconUrl?: string;
};

export type KlineInterval = "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";

export type Kline = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type WatchlistItem = {
  id: string;
  symbol: string;
  name: string;
  addedAt: string;
};

export type PortfolioPosition = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type PriceDirection = "up" | "down" | "neutral";

export type TimeRange = "1H" | "24H" | "1W" | "1M" | "1Y";

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};
