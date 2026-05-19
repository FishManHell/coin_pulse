import { formatPrice, formatVolume } from "@/shared/lib/utils";
import type { CoinTicker } from "@/entities/coin";

export type StatLabelKey = "high24h" | "low24h" | "volume24h" | "priceChange";

export interface StatRowData {
  labelKey: StatLabelKey;
  value: string;
  valueClass?: string;
}

export const getStatRows = (ticker: CoinTicker): StatRowData[] => {
  const isUp = ticker.priceChangePercent >= 0;
  return [
    { labelKey: "high24h", value: `$${formatPrice(ticker.high24h)}`, valueClass: "text-price-up" },
    { labelKey: "low24h", value: `$${formatPrice(ticker.low24h)}`, valueClass: "text-price-down" },
    { labelKey: "volume24h", value: formatVolume(ticker.volume * ticker.price) },
    {
      labelKey: "priceChange",
      value: `${isUp ? "+" : ""}${formatPrice(ticker.priceChange)}`,
      valueClass: isUp ? "text-price-up" : "text-price-down",
    },
  ];
};
