import { useTranslations } from "next-intl";
import { styles } from "./styles";

export const NoDataCard = () => {
  const t = useTranslations("dashboard.marketOverview");
  return (
    <div className={styles.noDataCard}>
      <p className={styles.noDataText}>{t("noData")}</p>
    </div>
  );
};
