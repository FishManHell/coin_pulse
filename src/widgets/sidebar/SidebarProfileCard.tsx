"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";
import { styles, type SidebarVariant } from "./styles";

interface SidebarProfileCardProps {
  name?: string | null;
  email?: string | null;
  active: boolean;
  variant: SidebarVariant;
}

export const SidebarProfileCard = ({
  name,
  email,
  active,
  variant,
}: SidebarProfileCardProps) => {
  const t = useTranslations("nav");
  const s = styles[variant];
  return (
    <Link
      href={ROUTES.profile}
      title={t("profile")}
      className={cn(
        s.profileLinkBase,
        active ? s.profileLinkActive : s.profileLinkInactive,
      )}
    >
      <div className={s.profileAvatar}>
        {name?.[0]?.toUpperCase() ?? "U"}
      </div>
      <div className={s.profileInfo}>
        <p className={s.profileName}>{name}</p>
        <p className={s.profileEmail}>{email}</p>
      </div>
    </Link>
  );
};
