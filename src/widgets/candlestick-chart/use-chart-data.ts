"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppStore } from "@/shared/store";
import { fetchKlines } from "@/shared/api/binance";
import type { Kline, TimeRange } from "@/shared/types";
import type { ChartType } from "./chart-config";

export const useChartData = () => {
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);

  const [range, setRange] = useState<TimeRange>("24H");
  const [chartType, setChartType] = useState<ChartType>("candlestick");
  const [klines, setKlines] = useState<Kline[]>([]);
  const [loading, setLoading] = useState(true);

  const loadKlines = useCallback(async () => {
    setLoading(true);
    setKlines([]);
    try {
      const data = await fetchKlines(selectedSymbol, range);
      setKlines(data);
    } finally {
      setLoading(false);
    }
  }, [selectedSymbol, range]);

  useEffect(() => { loadKlines(); }, [loadKlines]);

  return { range, setRange, chartType, setChartType, klines, loading };
};
