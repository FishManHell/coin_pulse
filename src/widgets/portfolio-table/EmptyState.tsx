import { Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import { styles } from "./styles";

export const EmptyState = () => {
  const t = useTranslations("portfolio.empty");
  return (
    <div className={styles.empty}>
      <Briefcase size={36} className="text-text-muted mb-3" />
      <p className={styles.emptyTitle}>{t("title")}</p>
      <p className={styles.emptyText}>{t("description")}</p>
    </div>
  );
};
