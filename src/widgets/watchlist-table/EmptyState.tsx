import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { styles } from "./styles";

export const EmptyState = () => {
  const t = useTranslations("watchlist.empty");
  return (
    <div className={styles.empty}>
      <Star size={40} className={styles.emptyIcon} />
      <p className={styles.emptyTitle}>{t("title")}</p>
      <p className={styles.emptyText}>{t("description")}</p>
    </div>
  );
};
