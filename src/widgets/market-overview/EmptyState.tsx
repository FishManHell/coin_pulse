import { useTranslations } from "next-intl";
import { styles } from "./styles";

export const EmptyState = () => {
  const t = useTranslations("dashboard.marketOverview");
  return (
    <div className={styles.emptyState}>
      <p className={styles.emptyTitle}>{t("emptyTitle")}</p>
      <p className={styles.emptyDescription}>{t("emptyDescription")}</p>
    </div>
  );
};
