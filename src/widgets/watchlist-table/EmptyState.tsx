import { Star } from "lucide-react";
import { styles } from "./styles";

export const EmptyState = () => (
  <div className={styles.empty}>
    <Star size={40} className={styles.emptyIcon} />
    <p className={styles.emptyTitle}>Watchlist is empty</p>
    <p className={styles.emptyText}>
      Go to Dashboard and click ★ on any coin to add it here.
    </p>
  </div>
);
