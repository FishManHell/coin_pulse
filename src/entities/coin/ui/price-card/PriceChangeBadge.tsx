import { TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatPercent } from "@/shared/lib/utils";
import { styles } from "./styles";

export const PriceChangeBadge = ({ changePercent }: Readonly<{changePercent: number}>) => {
  const isUp = changePercent >= 0;

  return (
    <span className={cn(styles.badgeBase, isUp ? styles.badgeUp : styles.badgeDown)}>
      {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {formatPercent(changePercent)}
    </span>
  );
};
