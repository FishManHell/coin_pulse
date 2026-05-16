import { LayoutDashboard, Star, Briefcase, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.watchlist, label: "Watchlist", icon: Star },
  { href: ROUTES.portfolio, label: "Portfolio", icon: Briefcase },
];
