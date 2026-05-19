"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";
import { styles } from "./styles";

interface SidebarProfileCardProps {
  name?: string | null;
  email?: string | null;
  active: boolean;
}

export const SidebarProfileCard = ({ name, email, active }: SidebarProfileCardProps) => {
  const t = useTranslations("nav");
  return (
    <Link
      href={ROUTES.profile}
      title={t("profile")}
      className={cn(styles.profileLinkBase, active ? styles.profileLinkActive : styles.profileLinkInactive)}
    >
      <div className={styles.profileAvatar}>
        {name?.[0]?.toUpperCase() ?? "U"}
      </div>
      <div className={styles.profileInfo}>
        <p className={styles.profileName}>{name}</p>
        <p className={styles.profileEmail}>{email}</p>
      </div>
    </Link>
  );
};
