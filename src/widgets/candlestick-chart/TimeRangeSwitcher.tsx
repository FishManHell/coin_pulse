import { cn } from "@/shared/lib/utils";
import { TIME_RANGES } from "./chart-config";
import type { TimeRange } from "@/shared/types";

type Props = {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
};

export const TimeRangeSwitcher = ({ value, onChange }: Props) => (
  <div className="flex items-center gap-1 bg-bg rounded-xl p-1 w-fit mb-4">
    {TIME_RANGES.map((r) => (
      <button
        key={r}
        onClick={() => onChange(r)}
        className={cn(
          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          value === r
            ? "gradient-accent text-white"
            : "text-text-muted hover:text-text-primary"
        )}
      >
        {r}
      </button>
    ))}
  </div>
);
