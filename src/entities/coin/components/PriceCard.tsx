"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { cn, formatPrice, formatPercent } from "@/shared/lib/utils";
import { useAppStore } from "@/shared/store";
import { useAddToWatchlist } from "@/features/add-to-watchlist";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { Button } from "@/shared/ui/button";
import type { CoinTicker } from "@/shared/types";

const COIN_ICONS: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  BNB: "B",
  SOL: "◎",
  XRP: "✕",
  ADA: "₳",
  DOGE: "Ð",
  AVAX: "A",
  DOT: "●",
  MATIC: "M",
};

type Props = {
  ticker: CoinTicker;
  onClick?: () => void;
  selected?: boolean;
};

export const PriceCard = ({ ticker, onClick, selected }: Readonly<Props>) => {
  const isUp = ticker.priceChangePercent >= 0;
  const prevPriceRef = useRef(ticker.price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const coinNames = useAppStore((s) => s.coinNames);
  const base = ticker.symbol.slice(0, -selectedQuote.length);
  const displayName = coinNames[base] ?? base;
  const watchlist = useAppStore((s) => s.watchlist);
  const isWatched = watchlist.some((w) => w.symbol === ticker.symbol);
  const { add } = useAddToWatchlist();
  const { remove } = useRemoveFromWatchlist();

  useEffect(() => {
    if (ticker.price === prevPriceRef.current) return;
    const dir = ticker.price > prevPriceRef.current ? "up" : "down";
    setFlash(dir);
    prevPriceRef.current = ticker.price;
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [ticker.price]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "w-full cursor-pointer text-left bg-surface border rounded-2xl p-5 transition-all duration-200",
        "hover:bg-surface-hover hover:scale-[1.01]",
        selected
          ? "border-accent-indigo shadow-[0_0_0_1px_#4F46E5]"
          : "border-border-base",
        flash === "up" && "flash-up",
        flash === "down" && "flash-down"
      )}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
            {COIN_ICONS[base] ?? base[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary leading-none mb-0.5">
              {displayName}
            </p>
            <p className="text-xs text-text-muted">
              {base}/{selectedQuote}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* % badge */}
          <span className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
            isUp ? "text-price-up bg-price-up/10" : "text-price-down bg-price-down/10"
          )}>
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {formatPercent(ticker.priceChangePercent)}
          </span>

          {/* Star */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              isWatched ? remove(ticker.symbol) : add(ticker.symbol, displayName);
            }}
            className={cn(
              "rounded-lg hover:bg-transparent",
              isWatched ? "text-accent-cyan" : "text-text-muted hover:text-accent-cyan"
            )}
          >
            <Star size={14} fill={isWatched ? "currentColor" : "none"} />
          </Button>
        </div>
      </div>

      {/* Price */}
      <p className="text-2xl font-bold text-text-primary">
        ${formatPrice(ticker.price)}
      </p>
      <p
        className={cn(
          "text-xs mt-1",
          isUp ? "text-price-up" : "text-price-down"
        )}
      >
        {isUp ? "+" : ""}
        {formatPrice(Math.abs(ticker.priceChange))} today
      </p>
    </div>
  );
};
