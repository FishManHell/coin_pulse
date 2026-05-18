"use client";

import { useCallback, useEffect, useRef } from "react";
import { createChart, type IChartApi } from "lightweight-charts";
import { useResizeObserver } from "@/shared/hooks/useResizeObserver";
import type { Kline } from "@/entities/coin";
import { buildChartOptions, buildThemeOptions, type ChartTheme } from "./chart-theme";
import { createSeries, type ChartSeriesController } from "./chart-series";
import type { ChartType } from "./chart-config";

interface Args {
  klines: Kline[];
  livePrice?: number;
  theme: ChartTheme;
  chartType: ChartType;
}

export const useCandlestickChart = ({ klines, livePrice, theme, chartType }: Args) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const controllerRef = useRef<ChartSeriesController | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const chart = createChart(container, buildChartOptions(theme, container.clientWidth));
    chartRef.current = chart;
    return () => {
      chart.remove();
      chartRef.current = null;
    };
    // theme handled by separate effect; only the initial value matters here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chartRef.current?.applyOptions(buildThemeOptions(theme));
  }, [theme]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const controller = createSeries(chart, chartType);
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [chartType]);

  useEffect(() => {
    if (!klines.length) return;
    controllerRef.current?.setData(klines);
    chartRef.current?.timeScale().fitContent();
  }, [klines, chartType]);

  useEffect(() => {
    if (!livePrice || !klines.length) return;
    controllerRef.current?.updateLive(klines[klines.length - 1], livePrice);
  }, [livePrice, klines, chartType]);

  const onResize = useCallback((entry: ResizeObserverEntry) => {
    chartRef.current?.applyOptions({ width: entry.contentRect.width });
  }, []);
  useResizeObserver(containerRef, onResize);

  return containerRef;
};
