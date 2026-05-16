import { formatPrice, formatVolume } from "@/shared/lib/utils";
import type { CoinTicker } from "@/entities/coin/types";
import type { StatRowProps } from "./StatRow";

export const getStatRows = (ticker: CoinTicker): StatRowProps[] => {
  const isUp = ticker.priceChangePercent >= 0;
  return [
    { label: "24h High", value: `$${formatPrice(ticker.high24h)}`, valueClass: "text-price-up" },
    { label: "24h Low", value: `$${formatPrice(ticker.low24h)}`, valueClass: "text-price-down" },
    { label: "24h Volume", value: formatVolume(ticker.volume * ticker.price) },
    {
      label: "Price change",
      value: `${isUp ? "+" : ""}${formatPrice(ticker.priceChange)}`,
      valueClass: isUp ? "text-price-up" : "text-price-down",
    },
  ];
};
