import { styles } from "./styles";

const COLUMNS = ["User", "Email", "Role", "Joined", ""];

export const TableHeader = () => (
  <div className={styles.headerRow}>
    {COLUMNS.map((h, i) => <span key={i} className={styles.headerCell}>{h}</span>)}
  </div>
);
