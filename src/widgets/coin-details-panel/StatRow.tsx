import { cn } from "@/shared/lib/utils";
import { styles } from "./styles";

export interface StatRowProps {
  label: string;
  value: string;
  valueClass?: string;
}

export const StatRow = ({ label, value, valueClass }: StatRowProps) => (
  <div className={styles.statRow}>
    <span className={styles.statLabel}>{label}</span>
    <span className={cn(styles.statValue, valueClass)}>{value}</span>
  </div>
);
