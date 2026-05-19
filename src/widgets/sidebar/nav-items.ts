import { LayoutDashboard, Star, Briefcase, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";

export type NavItemKey = "dashboard" | "watchlist" | "portfolio";

export interface NavItem {
  href: string;
  key: NavItemKey;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.dashboard, key: "dashboard", icon: LayoutDashboard },
  { href: ROUTES.watchlist, key: "watchlist", icon: Star },
  { href: ROUTES.portfolio, key: "portfolio", icon: Briefcase },
];
