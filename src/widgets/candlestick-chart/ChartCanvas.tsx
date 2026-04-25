"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  type IChartApi,
  type ISeriesApi,
  type SeriesType,
  type CandlestickData,
  type LineData,
  type AreaData,
  type BarData,
  type Time,
  ColorType,
} from "lightweight-charts";
import type { Kline } from "@/shared/types";

import type { ChartType } from "./chart-config";
export type { ChartType };
type Theme = "dark" | "light";

type ChartColors = { bg: string; text: string; grid: string };

const COLORS: Record<Theme, ChartColors> = {
  dark:  { bg: "#13131F", text: "#94A3B8", grid: "#1E1E30" },
  light: { bg: "#FFFFFF", text: "#475569", grid: "#E2E8F0" },
};

type Props = {
  klines: Kline[];
  livePrice?: number;
  theme: Theme;
  chartType: ChartType;
};

export const ChartCanvas = ({ klines, livePrice, theme, chartType }: Readonly<Props>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<SeriesType> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { bg, text, grid } = COLORS[theme];

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: bg }, textColor: text },
      grid: { vertLines: { color: grid }, horzLines: { color: grid } },
      crosshair: {
        vertLine: { color: "#4F46E5", labelBackgroundColor: "#4F46E5" },
        horzLine: { color: "#4F46E5", labelBackgroundColor: "#4F46E5" },
      },
      rightPriceScale: { borderColor: grid },
      timeScale: { borderColor: grid, timeVisible: true, secondsVisible: false },
      width: containerRef.current.clientWidth,
      height: 340,
    });

    let series: ISeriesApi<SeriesType>;

    if (chartType === "candlestick") {
      series = chart.addSeries(CandlestickSeries, {
        upColor: "#10B981", downColor: "#EF4444",
        borderUpColor: "#10B981", borderDownColor: "#EF4444",
        wickUpColor: "#10B981", wickDownColor: "#EF4444",
      });
    } else if (chartType === "bar") {
      series = chart.addSeries(BarSeries, {
        upColor: "#10B981", downColor: "#EF4444",
      });
    } else if (chartType === "area") {
      series = chart.addSeries(AreaSeries, {
        lineColor: "#00D4FF",
        topColor: "rgba(0, 212, 255, 0.3)",
        bottomColor: "rgba(0, 212, 255, 0.0)",
        lineWidth: 2,
      });
    } else {
      series = chart.addSeries(LineSeries, {
        color: "#00D4FF",
        lineWidth: 2,
      });
    }

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [chartType]);

  // Update theme colors
  useEffect(() => {
    if (!chartRef.current) return;
    const { bg, text, grid } = COLORS[theme];
    chartRef.current.applyOptions({
      layout: { background: { type: ColorType.Solid, color: bg }, textColor: text },
      grid: { vertLines: { color: grid }, horzLines: { color: grid } },
      rightPriceScale: { borderColor: grid },
      timeScale: { borderColor: grid },
    });
  }, [theme]);

  // Set kline data
  useEffect(() => {
    if (!seriesRef.current || !klines.length) return;

    if (chartType === "candlestick") {
      const data: CandlestickData<Time>[] = klines.map((k) => ({
        time: k.time as Time, open: k.open, high: k.high, low: k.low, close: k.close,
      }));
      (seriesRef.current as ISeriesApi<"Candlestick">).setData(data);
    } else if (chartType === "bar") {
      const data: BarData<Time>[] = klines.map((k) => ({
        time: k.time as Time, open: k.open, high: k.high, low: k.low, close: k.close,
      }));
      (seriesRef.current as ISeriesApi<"Bar">).setData(data);
    } else if (chartType === "area") {
      const data: AreaData<Time>[] = klines.map((k) => ({
        time: k.time as Time, value: k.close,
      }));
      (seriesRef.current as ISeriesApi<"Area">).setData(data);
    } else {
      const data: LineData<Time>[] = klines.map((k) => ({
        time: k.time as Time, value: k.close,
      }));
      (seriesRef.current as ISeriesApi<"Line">).setData(data);
    }

    chartRef.current?.timeScale().fitContent();
  }, [klines, chartType]);

  // Live price update
  useEffect(() => {
    if (!seriesRef.current || !livePrice || !klines.length) return;
    const last = klines[klines.length - 1];

    if (chartType === "candlestick") {
      (seriesRef.current as ISeriesApi<"Candlestick">).update({
        time: last.time as Time,
        open: last.open,
        high: Math.max(last.high, livePrice),
        low: Math.min(last.low, livePrice),
        close: livePrice,
      });
    } else if (chartType === "bar") {
      (seriesRef.current as ISeriesApi<"Bar">).update({
        time: last.time as Time,
        open: last.open,
        high: Math.max(last.high, livePrice),
        low: Math.min(last.low, livePrice),
        close: livePrice,
      });
    } else {
      (seriesRef.current as ISeriesApi<"Line" | "Area">).update({
        time: last.time as Time,
        value: livePrice,
      });
    }
  }, [livePrice, chartType]);

  return <div ref={containerRef} className="w-full" />;
};
