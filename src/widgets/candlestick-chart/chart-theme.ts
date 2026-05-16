import { ColorType, type DeepPartial, type ChartOptions } from "lightweight-charts";

export type ChartTheme = "dark" | "light";

interface Palette {
  bg: string;
  text: string;
  grid: string;
}

const PALETTES: Record<ChartTheme, Palette> = {
  dark:  { bg: "#13131F", text: "#94A3B8", grid: "#1E1E30" },
  light: { bg: "#FFFFFF", text: "#475569", grid: "#E2E8F0" },
};

const CROSSHAIR = "#4F46E5";

export const buildChartOptions = (
  theme: ChartTheme,
  width: number,
): DeepPartial<ChartOptions> => {
  const { bg, text, grid } = PALETTES[theme];
  return {
    layout: { background: { type: ColorType.Solid, color: bg }, textColor: text },
    grid: { vertLines: { color: grid }, horzLines: { color: grid } },
    crosshair: {
      vertLine: { color: CROSSHAIR, labelBackgroundColor: CROSSHAIR },
      horzLine: { color: CROSSHAIR, labelBackgroundColor: CROSSHAIR },
    },
    rightPriceScale: { borderColor: grid },
    timeScale: { borderColor: grid, timeVisible: true, secondsVisible: false },
    width,
    height: 340,
  };
};

export const buildThemeOptions = (theme: ChartTheme): DeepPartial<ChartOptions> => {
  const { bg, text, grid } = PALETTES[theme];
  return {
    layout: { background: { type: ColorType.Solid, color: bg }, textColor: text },
    grid: { vertLines: { color: grid }, horzLines: { color: grid } },
    rightPriceScale: { borderColor: grid },
    timeScale: { borderColor: grid },
  };
};
