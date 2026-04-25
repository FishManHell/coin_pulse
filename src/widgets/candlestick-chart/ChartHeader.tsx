import { TrendingUp, TrendingDown } from "lucide-react";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import type { CoinTicker } from "@/shared/types";

interface ChartHeaderProps {
  base: string;
  quote: string;
  ticker?: CoinTicker;
}

export const ChartHeader = ({ base, quote, ticker }: ChartHeaderProps) => {
  const isUp = (ticker?.priceChangePercent ?? 0) >= 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-semibold text-text-primary">{base}/{quote}</span>
        {ticker && (
          <span className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg",
            isUp ? "text-price-up bg-price-up/10" : "text-price-down bg-price-down/10"
          )}>
            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {formatPercent(ticker.priceChangePercent)}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-text-primary">
        {ticker ? `$${formatPrice(ticker.price)}` : "—"}
      </p>
    </div>
  );
};
