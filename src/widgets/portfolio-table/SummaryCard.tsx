import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";
import { styles } from "./styles";

interface SummaryLine {
  key: string;
  node: ReactNode;
  color?: string;
}

interface SummaryCardProps {
  label: string;
  value: ReactNode;
  color: string;
  loading?: boolean;
  secondary?: SummaryLine[];
}

export const SummaryCard = ({ label, value, color, loading = false, secondary }: Readonly<SummaryCardProps>) => (
  <div className={styles.summaryCard}>
    <p className={styles.summaryLabel}>{label}</p>
    {loading ? (
      <Skeleton className="w-28 h-6" />
    ) : (
      <>
        <p className={cn(styles.summaryValue, color)}>{value}</p>
        {secondary?.map((line) => (
          <p key={line.key} className={cn(styles.summarySecondary, line.color ?? "text-text-secondary")}>
            {line.node}
          </p>
        ))}
      </>
    )}
  </div>
);
