"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config/routes";
import { styles, type SidebarVariant } from "./styles";

export const SidebarLogoutButton = ({ variant }: { variant: SidebarVariant }) => {
  const t = useTranslations("nav");
  const s = styles[variant];
  return (
    <Button
      variant="ghost"
      onClick={() => signOut({ callbackUrl: ROUTES.login })}
      title={t("signOut")}
      className={s.logoutButton}
    >
      <LogOut size={16} className="shrink-0" />
      <span className={s.navLinkLabel}>{t("signOut")}</span>
    </Button>
  );
};
