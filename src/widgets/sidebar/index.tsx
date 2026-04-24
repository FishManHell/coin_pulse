"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Star,
  Briefcase,
  Settings,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ROLE_PERMISSIONS, type UserRole } from "@/shared/types/roles";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
] as const;

const navItem = (active: boolean) =>
  cn(
    "w-full flex items-center justify-center lg:justify-start gap-3 lg:px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
    active
      ? "bg-accent-indigo/10 text-accent-cyan lg:border-l-2 lg:border-accent-indigo lg:rounded-l-none"
      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
  );

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: UserRole } | undefined)?.role;

  return (
    <aside className="fixed left-0 top-0 h-screen bg-surface border-r border-border-base flex flex-col z-40 w-16 lg:w-60 transition-all duration-300">

      {/* Logo */}
      <div className="h-16 flex items-center justify-center lg:justify-start border-b border-border-base px-0 lg:px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0">
            <TrendingUp size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-accent-text hidden lg:block truncate">
            CoinPulse
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 lg:px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} title={label} className={navItem(pathname === href)}>
            <Icon size={18} className="shrink-0" />
            <span className="hidden lg:block">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 lg:px-3 py-4 border-t border-border-base space-y-1">

        {/* Settings */}
        {role && ROLE_PERMISSIONS.canAccessSettings(role) && (
          <Link href="/settings" title="Settings" className={navItem(pathname === "/settings")}>
            <Settings size={18} className="shrink-0" />
            <span className="hidden lg:block">Settings</span>
          </Link>
        )}

        {/* Profile card */}
        {session?.user && (
          <Link
            href="/profile"
            title="Profile"
            className={cn(
              "flex items-center justify-center lg:justify-start gap-3 p-2 lg:p-3 rounded-xl transition-all mt-1",
              pathname === "/profile"
                ? "bg-accent-indigo/10 ring-1 ring-accent-indigo"
                : "bg-surface-hover hover:bg-border-base"
            )}
          >
            <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
              {session.user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="hidden lg:block min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary truncate leading-tight">
                {session.user.name}
              </p>
              <p className="text-xs text-text-muted truncate leading-tight mt-0.5">
                {session.user.email}
              </p>
            </div>
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Sign out"
          className="w-full flex items-center justify-center lg:justify-start gap-3 lg:px-3 py-2 rounded-xl text-sm text-text-muted hover:text-price-down hover:bg-price-down/10 transition-all"
        >
          <LogOut size={16} className="shrink-0" />
          <span className="hidden lg:block">Sign out</span>
        </button>
      </div>
    </aside>
  );
};
