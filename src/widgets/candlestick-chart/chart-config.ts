import type { TimeRange } from "@/entities/coin";

export type ChartType = "candlestick" | "bar" | "area" | "line";

export const TIME_RANGES: TimeRange[] = ["1H", "24H", "1W", "1M", "1Y"];

export const CHART_TYPES: ChartType[] = ["candlestick", "bar", "area", "line"];
