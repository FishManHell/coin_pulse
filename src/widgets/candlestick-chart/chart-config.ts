import type { TimeRange } from "@/shared/types";

export type ChartType = "candlestick" | "bar" | "area" | "line";

export interface ChartTypeOption {
  type: ChartType;
  label: string;
}

export const TIME_RANGES: TimeRange[] = ["1H", "24H", "1W", "1M", "1Y"];

export const CHART_TYPES: ChartTypeOption[] = [
  { type: "candlestick", label: "Candles" },
  { type: "bar",         label: "Bars" },
  { type: "area",        label: "Area" },
  { type: "line",        label: "Line" },
];
