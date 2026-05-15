"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { fetchKlines } from "@/shared/api/binance";
import type { TimeRange } from "@/shared/types";
import type { ChartType } from "./chart-config";

export const useChartData = () => {
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const [range, setRange] = useState<TimeRange>("24H");
  const [chartType, setChartType] = useState<ChartType>("candlestick");

  const { data: klines = [], isLoading: loading } = useQuery({
    queryKey: ["klines", selectedSymbol, range],
    queryFn: () => fetchKlines(selectedSymbol, range),
  });

  return { range, setRange, chartType, setChartType, klines, loading };
};
