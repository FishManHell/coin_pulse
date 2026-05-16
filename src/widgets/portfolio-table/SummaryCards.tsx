import type { GroupedPosition } from "./group-positions";
import { InvestedCard } from "./InvestedCard";
import { LiveSummaryCards } from "./LiveSummaryCards";
import { styles } from "./styles";

interface SummaryCardsProps {
  grouped: GroupedPosition[];
  loading: boolean;
}

export const SummaryCards = ({ grouped, loading }: Readonly<SummaryCardsProps>) => (
  <div className={styles.summaryGrid}>
    <InvestedCard grouped={grouped} />
    <LiveSummaryCards grouped={grouped} loading={loading} />
  </div>
);
