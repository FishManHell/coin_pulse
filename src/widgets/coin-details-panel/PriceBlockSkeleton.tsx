import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";

export const PriceBlockSkeleton = () => (
  <>
    <Skeleton className="w-40 h-9" />
    <div className={styles.trendRow}>
      <Skeleton className="w-16 h-5 rounded-lg" />
      <Skeleton className="w-20 h-3" />
    </div>
  </>
);
