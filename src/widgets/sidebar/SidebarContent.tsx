"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";
import { ROLE_PERMISSIONS, type UserRole } from "@/shared/types/roles";
import { ROUTES } from "@/shared/config/routes";
import { NAV_ITEMS } from "./nav-items";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavLink } from "./SidebarNavLink";
import { SidebarProfileCard } from "./SidebarProfileCard";
import { SidebarLogoutButton } from "./SidebarLogoutButton";
import { styles, type SidebarVariant } from "./styles";

export const SidebarContent = ({ variant }: { variant: SidebarVariant }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const role = (session?.user as { role?: UserRole } | undefined)?.role;
  const s = styles[variant];

  return (
    <>
      <SidebarLogo variant={variant} />

      <nav className={s.nav}>
        {NAV_ITEMS.map(({ href, key, icon }) => (
          <SidebarNavLink
            key={href}
            href={href}
            label={t(key)}
            icon={icon}
            active={pathname === href}
            variant={variant}
          />
        ))}
      </nav>

      <div className={s.bottom}>
        {role && ROLE_PERMISSIONS.canAccessSettings(role) && (
          <SidebarNavLink
            href={ROUTES.settings}
            label={t("settings")}
            icon={Settings}
            active={pathname === ROUTES.settings}
            variant={variant}
          />
        )}

        {session?.user && (
          <SidebarProfileCard
            name={session.user.name}
            email={session.user.email}
            active={pathname === ROUTES.profile}
            variant={variant}
          />
        )}

        <SidebarLogoutButton variant={variant} />
      </div>
    </>
  );
};
