"use client";

import { useEffect } from "react";
import { Trash2, TrendingUp, TrendingDown, Star } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { useRemoveFromWatchlist } from "@/features/remove-from-watchlist";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import type { WatchlistItem } from "@/shared/types";

type Props = {
  initialItems: WatchlistItem[];
};

export const WatchlistTable = ({ initialItems }: Readonly<Props>) => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);
  const prices = useAppStore((s) => s.prices);
  const { remove, loading } = useRemoveFromWatchlist();

  // seed store from server data on first render
  useEffect(() => {
    setWatchlist(initialItems);
  }, []);

  const symbols = watchlist.map((w) => w.symbol);
  useWebSocket(symbols);

  if (watchlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Star size={40} className="text-text-muted mb-4" />
        <p className="text-text-primary font-medium mb-1">Watchlist is empty</p>
        <p className="text-text-muted text-sm">
          Go to Dashboard and click ★ on any coin to add it here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border-base rounded-2xl overflow-hidden">
      {/* Table head */}
      <div className="grid grid-cols-[1fr_140px_140px_120px_52px] px-5 py-3 border-b border-border-base">
        {["Asset", "Price", "24h Change", "Volume", ""].map((h) => (
          <span key={h} className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {watchlist.map((item) => {
        const ticker = prices[item.symbol];
        const isUp = (ticker?.priceChangePercent ?? 0) >= 0;

        return (
          <div
            key={item.symbol}
            className="grid grid-cols-[1fr_140px_140px_120px_52px] items-center px-5 py-4 border-b border-border-base last:border-0 hover:bg-surface-hover transition-colors"
          >
            {/* Asset */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
                {item.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{item.name}</p>
                <p className="text-xs text-text-muted">
                  {item.symbol.replace("USDT", "")}/USDT
                </p>
              </div>
            </div>

            {/* Price */}
            <span className="text-sm font-medium text-text-primary">
              {ticker ? `$${formatPrice(ticker.price)}` : "—"}
            </span>

            {/* 24h change */}
            <span
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                ticker
                  ? isUp ? "text-price-up" : "text-price-down"
                  : "text-text-muted"
              )}
            >
              {ticker ? (
                <>
                  {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {formatPercent(ticker.priceChangePercent)}
                </>
              ) : "—"}
            </span>

            {/* Volume */}
            <span className="text-sm text-text-secondary">
              {ticker
                ? `$${(ticker.volume * ticker.price / 1_000_000).toFixed(1)}M`
                : "—"}
            </span>

            {/* Remove */}
            <button
              onClick={() => remove(item.symbol)}
              disabled={loading}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-price-down hover:bg-price-down/10 transition-all disabled:opacity-40"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
