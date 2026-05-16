import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";

interface SummaryCardProps {
  label: string;
  value: string;
  color: string;
  loading?: boolean;
}

export const SummaryCard = ({ label, value, color, loading = false }: Readonly<SummaryCardProps>) => (
  <div className={styles.summaryCard}>
    <p className={styles.summaryLabel}>{label}</p>
    {loading
      ? <Skeleton className="w-28 h-6" />
      : <p className={cn(styles.summaryValue, color)}>{value}</p>}
  </div>
);
