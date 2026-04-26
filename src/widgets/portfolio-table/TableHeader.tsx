import { styles } from "./styles";

const COLUMNS = ["", "Asset", "Qty", "Avg buy", "Current", "P&L", ""];

export const TableHeader = () => (
  <div className={styles.headerRow}>
    {COLUMNS.map((h, i) => <span key={i} className={styles.headerCell}>{h}</span>)}
  </div>
);
