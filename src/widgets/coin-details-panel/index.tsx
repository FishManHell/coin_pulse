"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Star, StarOff } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { useAddToWatchlist } from "@/features/add-to-watchlist";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { formatPrice, formatPercent, formatVolume, cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

const COIN_COLORS: Record<string, string> = {
  BTC:  "from-orange-500 to-yellow-400",
  ETH:  "from-blue-500 to-indigo-400",
  BNB:  "from-yellow-500 to-amber-400",
  SOL:  "from-purple-500 to-violet-400",
  XRP:  "from-sky-500 to-cyan-400",
  ADA:  "from-blue-600 to-blue-400",
  DOGE: "from-yellow-400 to-amber-300",
  AVAX: "from-red-500 to-rose-400",
};

type StatRowProps = { label: string; value: string; valueClass?: string };

const StatRow = ({ label, value, valueClass }: StatRowProps) => (
  <div className="flex items-center justify-between py-3 border-b border-border-base last:border-0">
    <span className="text-xs text-text-muted">{label}</span>
    <span className={cn("text-sm font-medium text-text-primary", valueClass)}>{value}</span>
  </div>
);

export const CoinDetailsPanel = () => {
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const selectedQuote  = useAppStore((s) => s.selectedQuote);
  const coinNames      = useAppStore((s) => s.coinNames);
  const prices         = useAppStore((s) => s.prices);
  const watchlist      = useAppStore((s) => s.watchlist);

  const ticker = prices[selectedSymbol];
  const { add }    = useAddToWatchlist();
  const { remove } = useRemoveFromWatchlist();

  const base        = selectedSymbol.slice(0, -selectedQuote.length);
  const displayName = coinNames[base] ?? base;
  const isWatched   = watchlist.some((w) => w.symbol === selectedSymbol);
  const isUp        = (ticker?.priceChangePercent ?? 0) >= 0;
  const gradientClass = COIN_COLORS[base] ?? "from-accent-indigo to-accent-cyan";

  const prevPriceRef = useRef(ticker?.price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (!ticker?.price || ticker.price === prevPriceRef.current) return;
    setFlash(ticker.price > (prevPriceRef.current ?? 0) ? "up" : "down");
    prevPriceRef.current = ticker.price;
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [ticker?.price]);

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 border-l border-border-base bg-surface overflow-y-auto">
      {/* Coin header */}
      <div className="p-5 border-b border-border-base">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shrink-0", gradientClass)}>
              {base[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{displayName}</p>
              <p className="text-xs text-text-muted">{base}/{selectedQuote}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => isWatched ? remove(selectedSymbol) : add(selectedSymbol, displayName)}
            className={cn(
              "rounded-lg hover:bg-transparent",
              isWatched
                ? "text-accent-cyan"
                : "text-text-muted hover:text-accent-cyan"
            )}
          >
            {isWatched ? <Star size={15} fill="currentColor" /> : <StarOff size={15} />}
          </Button>
        </div>

        {/* Price */}
        <div className={cn("transition-colors rounded-lg", flash === "up" && "flash-up", flash === "down" && "flash-down")}>
          <p className="text-3xl font-bold text-text-primary">
            {ticker ? `$${formatPrice(ticker.price)}` : "—"}
          </p>
          {ticker && (
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg",
                isUp ? "text-price-up bg-price-up/10" : "text-price-down bg-price-down/10"
              )}>
                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {formatPercent(ticker.priceChangePercent)}
              </span>
              <span className={cn("text-xs", isUp ? "text-price-up" : "text-price-down")}>
                {isUp ? "+" : ""}{formatPrice(Math.abs(ticker.priceChange))} today
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-5">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
          Market stats
        </p>
        <div>
          <StatRow label="24h High"    value={ticker ? `$${formatPrice(ticker.high24h)}` : "—"} valueClass="text-price-up" />
          <StatRow label="24h Low"     value={ticker ? `$${formatPrice(ticker.low24h)}`  : "—"} valueClass="text-price-down" />
          <StatRow label="24h Volume"  value={ticker ? formatVolume(ticker.volume * ticker.price) : "—"} />
          <StatRow label="Price change" value={ticker ? `${isUp ? "+" : ""}${formatPrice(ticker.priceChange)}` : "—"} valueClass={isUp ? "text-price-up" : "text-price-down"} />
        </div>
      </div>

      <div className="px-5 pb-5 mt-auto">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-price-up animate-pulse" />
          Live data · Binance
        </div>
      </div>
    </aside>
  );
};
