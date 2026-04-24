import type { Kline, TimeRange } from "@/shared/types";

const BASE = "https://api.binance.com/api/v3";

const RANGE_CONFIG: Record<TimeRange, { interval: string; limit: number }> = {
  "1H":  { interval: "1m",  limit: 60  },
  "24H": { interval: "5m",  limit: 288 },
  "1W":  { interval: "1h",  limit: 168 },
  "1M":  { interval: "4h",  limit: 180 },
  "1Y":  { interval: "1d",  limit: 365 },
};

export const fetchKlines = async (
  symbol: string,
  range: TimeRange
): Promise<Kline[]> => {
  const { interval, limit } = RANGE_CONFIG[range];
  const url = `${BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error(`Binance klines error: ${res.status}`);

  const raw: number[][] = await res.json();

  return raw.map((k) => ({
    time: Math.floor(k[0] / 1000),
    open: parseFloat(k[1] as unknown as string),
    high: parseFloat(k[2] as unknown as string),
    low: parseFloat(k[3] as unknown as string),
    close: parseFloat(k[4] as unknown as string),
    volume: parseFloat(k[5] as unknown as string),
  }));
};
