"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { searchCoins, type CoinMeta } from "@/shared/api/coins-list";
import { formatPrice, cn } from "@/shared/lib/utils";

type Props = { className?: string; autoFocus?: boolean };

export const SearchCoin = ({ className, autoFocus }: Props) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const prices = useAppStore((s) => s.prices);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  const results = searchCoins(query);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSelect = (coin: CoinMeta) => {
    setSelectedSymbol(coin.symbol);
    router.push("/dashboard");
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-44 lg:w-52", className)}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search coins…"
        className={cn(
          "w-full bg-bg border border-border-base rounded-xl pl-9 pr-4 py-2 text-sm",
          "text-text-primary placeholder:text-text-muted outline-none",
          "focus:border-accent-indigo transition-colors"
        )}
      />

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-72 bg-surface border border-border-base rounded-2xl shadow-xl overflow-hidden z-50">
          {results.map((coin) => {
            const ticker = prices[coin.symbol];
            const isUp = (ticker?.priceChangePercent ?? 0) >= 0;

            return (
              <button
                key={coin.symbol}
                onMouseDown={() => handleSelect(coin)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors text-left border-b border-border-base last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {coin.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{coin.name}</p>
                    <p className="text-xs text-text-muted">
                      {coin.symbol.replace("USDT", "")}/USDT
                    </p>
                  </div>
                </div>

                {ticker && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">
                      ${formatPrice(ticker.price)}
                    </p>
                    <p className={cn(
                      "flex items-center justify-end gap-0.5 text-xs",
                      isUp ? "text-price-up" : "text-price-down"
                    )}>
                      {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {isUp ? "+" : ""}{ticker.priceChangePercent.toFixed(2)}%
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {open && query.length > 0 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-surface border border-border-base rounded-2xl px-4 py-3 z-50">
          <p className="text-sm text-text-muted">No coins found for "{query}"</p>
        </div>
      )}
    </div>
  );
};
