import { useTranslations } from "next-intl";
import { styles } from "./styles";

export const TableHeader = () => {
  const t = useTranslations("watchlist.columns");
  const columns = [t("asset"), t("price"), t("change24h"), t("volume"), ""];

  return (
    <div className={styles.headerRow}>
      {columns.map((h, i) => (
        <span key={i} className={styles.headerCell}>{h}</span>
      ))}
    </div>
  );
};
