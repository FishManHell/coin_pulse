import { useTranslations } from "next-intl";
import {
  CandlestickChart as CandlestickIcon,
  BarChart3,
  AreaChart,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CHART_TYPES, type ChartType } from "./chart-config";

const ICONS: Record<ChartType, LucideIcon> = {
  candlestick: CandlestickIcon,
  bar: BarChart3,
  area: AreaChart,
  line: LineChart,
};

interface ChartTypeSwitcherProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSwitcher = ({ value, onChange }: ChartTypeSwitcherProps) => {
  const t = useTranslations("dashboard.chart.types");
  return (
    <div className="flex items-center gap-1 bg-bg rounded-xl p-1">
      {CHART_TYPES.map((type) => {
        const Icon = ICONS[type];
        const label = t(type);
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            title={label}
            aria-label={label}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center",
              value === type
                ? "gradient-accent text-white"
                : "text-text-muted hover:text-text-primary",
            )}
          >
            <Icon size={14} className="sm:hidden" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};
