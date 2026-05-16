"use client";

import type { Kline } from "@/shared/types";
import { useCandlestickChart } from "./use-candlestick-chart";
import type { ChartTheme } from "./chart-theme";
import type { ChartType } from "./chart-config";

export type { ChartType };

interface ChartCanvasProps {
  klines: Kline[];
  livePrice?: number;
  theme: ChartTheme;
  chartType: ChartType;
}

export const ChartCanvas = (props: Readonly<ChartCanvasProps>) => {
  const containerRef = useCandlestickChart(props);
  return <div ref={containerRef} className="w-full" />;
};
