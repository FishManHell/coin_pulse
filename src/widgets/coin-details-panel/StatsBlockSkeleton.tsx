import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";

const LABELS = ["24h High", "24h Low", "24h Volume", "Price change"] as const;

export const StatsBlockSkeleton = () => (
  <div>
    {LABELS.map((label) => (
      <div key={label} className={styles.statRow}>
        <span className={styles.statLabel}>{label}</span>
        <Skeleton className="w-20 h-4" />
      </div>
    ))}
  </div>
);
