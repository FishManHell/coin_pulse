import { useTranslations } from "next-intl";
import type { UserRole } from "@/shared/types/roles";
import { cn } from "@/shared/lib/utils";
import { ROLE_COLORS, styles } from "./styles";

export const RoleBadge = ({ role }: { role: UserRole }) => {
  const t = useTranslations("admin.roles");
  return (
    <span className={cn(styles.roleBadge, ROLE_COLORS[role])}>
      {t(role)}
    </span>
  );
};
