import {
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
  type IChartApi,
  type Time,
} from "lightweight-charts";
import type { Kline } from "@/shared/types";
import type { ChartType } from "./chart-config";

const UP = "#10B981";
const DOWN = "#EF4444";
const PRIMARY = "#00D4FF";

const CANDLE_OPTS = {
  upColor: UP, downColor: DOWN,
  borderUpColor: UP, borderDownColor: DOWN,
  wickUpColor: UP, wickDownColor: DOWN,
} as const;

const BAR_OPTS = { upColor: UP, downColor: DOWN } as const;

const AREA_OPTS = {
  lineColor: PRIMARY,
  topColor: "rgba(0, 212, 255, 0.3)",
  bottomColor: "rgba(0, 212, 255, 0.0)",
  lineWidth: 2,
} as const;

const LINE_OPTS = { color: PRIMARY, lineWidth: 2 } as const;

const toOHLC = (k: Kline) => ({
  time: k.time as Time,
  open: k.open,
  high: k.high,
  low: k.low,
  close: k.close,
});

const toLiveOHLC = (last: Kline, price: number) => ({
  time: last.time as Time,
  open: last.open,
  high: Math.max(last.high, price),
  low: Math.min(last.low, price),
  close: price,
});

const toValue = (k: Kline) => ({ time: k.time as Time, value: k.close });

export interface ChartSeriesController {
  setData: (klines: Kline[]) => void;
  updateLive: (last: Kline, price: number) => void;
  destroy: () => void;
}

export const createSeries = (chart: IChartApi, type: ChartType): ChartSeriesController => {
  switch (type) {
    case "candlestick": {
      const s = chart.addSeries(CandlestickSeries, CANDLE_OPTS);
      return {
        setData: (klines) => s.setData(klines.map(toOHLC)),
        updateLive: (last, price) => s.update(toLiveOHLC(last, price)),
        destroy: () => { try { chart.removeSeries(s); } catch { /* destroyed */ } },
      };
    }
    case "bar": {
      const s = chart.addSeries(BarSeries, BAR_OPTS);
      return {
        setData: (klines) => s.setData(klines.map(toOHLC)),
        updateLive: (last, price) => s.update(toLiveOHLC(last, price)),
        destroy: () => { try { chart.removeSeries(s); } catch { /* destroyed */ } },
      };
    }
    case "area": {
      const s = chart.addSeries(AreaSeries, AREA_OPTS);
      return {
        setData: (klines) => s.setData(klines.map(toValue)),
        updateLive: (last, price) => s.update({ time: last.time as Time, value: price }),
        destroy: () => { try { chart.removeSeries(s); } catch { /* destroyed */ } },
      };
    }
    case "line": {
      const s = chart.addSeries(LineSeries, LINE_OPTS);
      return {
        setData: (klines) => s.setData(klines.map(toValue)),
        updateLive: (last, price) => s.update({ time: last.time as Time, value: price }),
        destroy: () => { try { chart.removeSeries(s); } catch { /* destroyed */ } },
      };
    }
  }
};
