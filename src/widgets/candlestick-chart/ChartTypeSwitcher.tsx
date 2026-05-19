import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { CHART_TYPES, type ChartType } from "./chart-config";

interface ChartTypeSwitcherProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export const ChartTypeSwitcher = ({ value, onChange }: ChartTypeSwitcherProps) => {
  const t = useTranslations("dashboard.chart.types");
  return (
    <div className="flex items-center gap-1 bg-bg rounded-xl p-1">
      {CHART_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
            value === type
              ? "gradient-accent text-white"
              : "text-text-muted hover:text-text-primary"
          )}
        >
          {t(type)}
        </button>
      ))}
    </div>
  );
};
