import { formatPrice, formatPercent, cn } from "@/shared/lib/utils";
import { styles } from "./styles";

interface SummaryCardsProps {
  invested: number;
  current: number;
  pnl: number;
  pnlPct: number;
}

export const SummaryCards = ({ invested, current, pnl, pnlPct }: SummaryCardsProps) => {
  const isUp = pnl >= 0;
  const cards = [
    { label: "Invested", value: `$${formatPrice(invested)}`, color: "text-text-primary" },
    { label: "Current value", value: `$${formatPrice(current)}`, color: "text-text-primary" },
    {
      label: "Total P&L",
      value: `${isUp ? "+" : ""}$${formatPrice(Math.abs(pnl))} (${formatPercent(pnlPct)})`,
      color: isUp ? "text-price-up" : "text-price-down",
    },
  ];

  return (
    <div className={styles.summaryGrid}>
      {cards.map(({ label, value, color }) => (
        <div key={label} className={styles.summaryCard}>
          <p className={styles.summaryLabel}>{label}</p>
          <p className={cn(styles.summaryValue, color)}>{value}</p>
        </div>
      ))}
    </div>
  );
};
