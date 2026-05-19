"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config/routes";
import { styles } from "./styles";

export const SidebarLogoutButton = () => {
  const t = useTranslations("nav");
  return (
    <Button
      variant="ghost"
      onClick={() => signOut({ callbackUrl: ROUTES.login })}
      title={t("signOut")}
      className={styles.logoutButton}
    >
      <LogOut size={16} className="shrink-0" />
      <span className={styles.navLinkLabel}>{t("signOut")}</span>
    </Button>
  );
};
