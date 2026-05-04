import { styles } from "./styles";

const COLUMNS = ["Asset", "Price", "24h Change", "Volume", ""];

export const TableHeader = () => (
  <div className={styles.headerRow}>
    {COLUMNS.map((h, i) => (
      <span key={i} className={styles.headerCell}>{h}</span>
    ))}
  </div>
);
