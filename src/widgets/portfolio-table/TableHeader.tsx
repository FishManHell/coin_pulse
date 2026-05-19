import { useTranslations } from "next-intl";
import { styles } from "./styles";

export const TableHeader = () => {
  const t = useTranslations("portfolio.columns");
  const columns = ["", t("asset"), t("qty"), t("avgBuy"), t("current"), t("pnl"), ""];

  return (
    <div className={styles.headerRow}>
      {columns.map((h, i) => <span key={i} className={styles.headerCell}>{h}</span>)}
    </div>
  );
};
