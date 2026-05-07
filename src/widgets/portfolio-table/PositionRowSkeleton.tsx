import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CoinIcon } from "@/shared/ui/coin-icon";
import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";
import type { GroupedPosition } from "./group-positions";

export const PositionRowSkeleton = ({ group }: { group: GroupedPosition }) => {
  const base = group.symbol.slice(0, -group.quote.length);

  return (
    <div className={cn(styles.row, "pointer-events-none cursor-default")}>
      <span className={styles.expandIcon}>
        <ChevronRight size={16} />
      </span>
      <div className="flex items-center gap-3">
        <CoinIcon base={base} size="sm" />
        <div>
          <p className={styles.assetName}>{group.name}</p>
          <p className={styles.assetTicker}>
            {base}/{group.quote} · {group.transactions.length}{" "}
            {group.transactions.length === 1 ? "buy" : "buys"}
          </p>
        </div>
      </div>
      <span className={styles.cellSecondary}>
        <Skeleton className="w-12 h-4" />
      </span>
      <span className={styles.cellSecondary}>
        <Skeleton className="w-16 h-4" />
      </span>
      <span className={styles.cellPrimary}>
        <Skeleton className="w-16 h-4" />
      </span>
      <span className={styles.pnlCell}>
        <Skeleton className="w-24 h-4" />
      </span>
      <span />
    </div>
  );
};
