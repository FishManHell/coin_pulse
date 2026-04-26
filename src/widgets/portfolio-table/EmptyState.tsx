import { Briefcase } from "lucide-react";
import { styles } from "./styles";

export const EmptyState = () => (
  <div className={styles.empty}>
    <Briefcase size={36} className="text-text-muted mb-3" />
    <p className={styles.emptyTitle}>No positions yet</p>
    <p className={styles.emptyText}>Click &quot;Add position&quot; to start tracking.</p>
  </div>
);
