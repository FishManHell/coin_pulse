import { useTranslations } from "next-intl";
import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";
import type { StatLabelKey } from "./get-stat-rows";

const LABEL_KEYS: readonly StatLabelKey[] = ["high24h", "low24h", "volume24h", "priceChange"];

export const StatsBlockSkeleton = () => {
  const t = useTranslations("dashboard.coinDetails.stats");
  return (
    <div>
      {LABEL_KEYS.map((key) => (
        <div key={key} className={styles.statRow}>
          <span className={styles.statLabel}>{t(key)}</span>
          <Skeleton className="w-20 h-4" />
        </div>
      ))}
    </div>
  );
};
