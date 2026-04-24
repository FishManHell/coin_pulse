"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { fetchKlines } from "@/shared/api/binance";
import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import { useTheme } from "@/shared/hooks/useTheme";
import type { Kline, TimeRange } from "@/shared/types";
import { ChartCanvas, type ChartType } from "./ChartCanvas";

const TIME_RANGES: TimeRange[] = ["1H", "24H", "1W", "1M", "1Y"];

const CHART_TYPES: { type: ChartType; label: string }[] = [
  { type: "candlestick", label: "Candles" },
  { type: "bar",         label: "Bars" },
  { type: "area",        label: "Area" },
  { type: "line",        label: "Line" },
];

export const CandlestickChart = () => {
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const prices = useAppStore((s) => s.prices);
  const ticker = prices[selectedSymbol];

  const { theme } = useTheme();
  const [range, setRange] = useState<TimeRange>("24H");
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [klines, setKlines] = useState<Kline[]>([]);
  const [loading, setLoading] = useState(true);

  const loadKlines = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchKlines(selectedSymbol, range);
      setKlines(data);
    } finally {
      setLoading(false);
    }
  }, [selectedSymbol, range]);

  useEffect(() => { loadKlines(); }, [loadKlines]);

  const isUp = (ticker?.priceChangePercent ?? 0) >= 0;
  const coinName = selectedSymbol.replace("USDT", "");

  return (
    <section className="bg-surface border border-border-base rounded-2xl p-5">
      {/* Top row: coin info + chart type switcher */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-text-primary">{coinName}/USDT</span>
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

        {/* Chart type switcher */}
        <div className="flex items-center gap-1 bg-bg rounded-xl p-1">
          {CHART_TYPES.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                chartType === type
                  ? "gradient-accent text-white"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Time range selector */}
      <div className="flex items-center gap-1 bg-bg rounded-xl p-1 w-fit mb-4">
        {TIME_RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              range === r
                ? "gradient-accent text-white"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart — key forces remount on type change */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/60 rounded-xl z-10">
            <div className="w-6 h-6 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <ChartCanvas
          key={chartType}
          klines={klines}
          livePrice={ticker?.price}
          theme={theme}
          chartType={chartType}
        />
      </div>
    </section>
  );
};
