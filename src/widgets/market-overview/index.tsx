"use client";

import { useAppStore } from "@/shared/store";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { PriceCard } from "@/entities/coin/components/PriceCard";

const SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
];

export const MarketOverview = () => {
  useWebSocket(SYMBOLS);

  const prices = useAppStore((s) => s.prices);
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const setSelectedSymbol = useAppStore((s) => s.setSelectedSymbol);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
            Live prices
          </p>
          <h2 className="text-lg font-semibold text-text-primary">
            Top Assets
          </h2>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-price-up">
          <span className="w-1.5 h-1.5 rounded-full bg-price-up animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {SYMBOLS.map((symbol) => {
          const ticker = prices[symbol];
          if (!ticker) {
            return (
              <div
                key={symbol}
                className="bg-surface border border-border-base rounded-2xl p-5 animate-pulse"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-full bg-surface-hover" />
                  <div className="space-y-1.5">
                    <div className="w-16 h-3 bg-surface-hover rounded" />
                    <div className="w-10 h-2.5 bg-surface-hover rounded" />
                  </div>
                </div>
                <div className="w-28 h-7 bg-surface-hover rounded mb-1" />
                <div className="w-20 h-2.5 bg-surface-hover rounded" />
              </div>
            );
          }

          return (
            <PriceCard
              key={symbol}
              ticker={ticker}
              selected={selectedSymbol === symbol}
              onClick={() => setSelectedSymbol(symbol)}
            />
          );
        })}
      </div>
    </section>
  );
};
