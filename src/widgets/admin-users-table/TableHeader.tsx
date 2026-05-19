import { useTranslations } from "next-intl";
import { styles } from "./styles";

export const TableHeader = () => {
  const t = useTranslations("admin.columns");
  const columns = [t("user"), t("email"), t("role"), t("joined"), ""];

  return (
    <div className={styles.headerRow}>
      {columns.map((h, i) => <span key={i} className={styles.headerCell}>{h}</span>)}
    </div>
  );
};
