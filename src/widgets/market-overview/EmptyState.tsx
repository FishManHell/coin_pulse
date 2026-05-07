import { styles } from "./styles";

export const EmptyState = () => (
  <div className={styles.emptyState}>
    <p className={styles.emptyTitle}>No active pairs</p>
    <p className={styles.emptyDescription}>
      This quote currency has no active trading pairs on Binance.
    </p>
  </div>
);
