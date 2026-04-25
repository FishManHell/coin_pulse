"use client";

import { useAppStore } from "@/shared/store";
import { useTheme } from "@/shared/hooks/useTheme";
import { ChartCanvas } from "./ChartCanvas";
import { ChartHeader } from "./ChartHeader";
import { ChartTypeSwitcher } from "./ChartTypeSwitcher";
import { TimeRangeSwitcher } from "./TimeRangeSwitcher";
import { useChartData } from "./use-chart-data";

export const CandlestickChart = () => {
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const selectedQuote = useAppStore((s) => s.selectedQuote);
  const ticker = useAppStore((s) => s.prices[selectedSymbol]);
  const { theme } = useTheme();

  const { range, setRange, chartType, setChartType, klines, loading } = useChartData();

  const base = selectedSymbol.slice(0, -selectedQuote.length);

  return (
    <section className="bg-surface border border-border-base rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <ChartHeader base={base} quote={selectedQuote} ticker={ticker} />
        <ChartTypeSwitcher value={chartType} onChange={setChartType} />
      </div>

      <TimeRangeSwitcher value={range} onChange={setRange} />

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
