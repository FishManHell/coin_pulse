import { ROLE_LABELS, type UserRole } from "@/shared/types/roles";
import { cn } from "@/shared/lib/utils";
import { ROLE_COLORS, styles } from "./styles";

export const RoleBadge = ({ role }: { role: UserRole }) => (
  <span className={cn(styles.roleBadge, ROLE_COLORS[role])}>
    {ROLE_LABELS[role]}
  </span>
);
