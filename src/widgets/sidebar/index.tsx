"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Settings } from "lucide-react";
import { ROLE_PERMISSIONS, type UserRole } from "@/shared/types/roles";
import { ROUTES } from "@/shared/config/routes";
import { NAV_ITEMS } from "./nav-items";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarNavLink } from "./SidebarNavLink";
import { SidebarProfileCard } from "./SidebarProfileCard";
import { SidebarLogoutButton } from "./SidebarLogoutButton";
import { styles } from "./styles";

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: UserRole } | undefined)?.role;

  return (
    <aside className={styles.aside}>
      <SidebarLogo />

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ href, label, icon }) => (
          <SidebarNavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href}
          />
        ))}
      </nav>

      <div className={styles.bottom}>
        {role && ROLE_PERMISSIONS.canAccessSettings(role) && (
          <SidebarNavLink
            href={ROUTES.settings}
            label="Settings"
            icon={Settings}
            active={pathname === ROUTES.settings}
          />
        )}

        {session?.user && (
          <SidebarProfileCard
            name={session.user.name}
            email={session.user.email}
            active={pathname === ROUTES.profile}
          />
        )}

        <SidebarLogoutButton />
      </div>
    </aside>
  );
};
