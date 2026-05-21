export type SidebarVariant = "rail" | "drawer";

const railStyles = {
  aside:
    "fixed left-0 top-0 h-dvh bg-surface border-r border-border-base flex-col z-40 " +
    "w-16 lg:w-60 transition-all duration-300 hidden md:flex",

  logoSection:
    "h-16 flex items-center justify-center lg:justify-start " +
    "border-b border-border-base px-0 lg:px-6 shrink-0",
  logoLink: "flex items-center gap-2.5 min-w-0",
  logoBadge:
    "w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0",
  logoText: "text-lg font-bold gradient-accent-text hidden lg:block truncate",

  nav: "flex-1 px-2 lg:px-3 py-4 space-y-1",
  bottom: "px-2 lg:px-3 py-4 border-t border-border-base space-y-1",

  navLinkBase:
    "w-full flex items-center justify-center lg:justify-start " +
    "gap-3 lg:px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
  navLinkActive:
    "bg-accent-indigo/10 text-accent-cyan " +
    "lg:border-l-2 lg:border-accent-indigo lg:rounded-l-none",
  navLinkInactive:
    "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
  navLinkLabel: "hidden lg:block",

  profileLinkBase:
    "flex items-center justify-center lg:justify-start " +
    "gap-3 p-2 lg:p-3 rounded-xl transition-all mt-1",
  profileLinkActive: "bg-accent-indigo/10 ring-1 ring-accent-indigo",
  profileLinkInactive: "bg-surface-hover hover:bg-border-base",
  profileAvatar:
    "w-8 h-8 rounded-full gradient-accent flex items-center justify-center " +
    "text-white text-xs font-bold shrink-0",
  profileInfo: "hidden lg:block min-w-0 flex-1",
  profileName: "text-sm font-medium text-text-primary truncate leading-tight",
  profileEmail: "text-xs text-text-muted truncate leading-tight mt-0.5",

  logoutButton:
    "w-full justify-center lg:justify-start gap-3 lg:px-3 py-2 rounded-xl " +
    "text-text-muted hover:text-price-down hover:bg-price-down/10",
};

const drawerStyles: typeof railStyles = {
  aside: railStyles.aside,

  logoSection:
    "h-16 flex items-center justify-start border-b border-border-base px-6 shrink-0",
  logoLink: "flex items-center gap-2.5 min-w-0",
  logoBadge:
    "w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shrink-0",
  logoText: "text-lg font-bold gradient-accent-text block truncate",

  nav: "flex-1 px-3 py-4 space-y-1",
  bottom: "px-3 py-4 border-t border-border-base space-y-1",

  navLinkBase:
    "w-full flex items-center justify-start gap-3 px-3 py-2.5 rounded-xl " +
    "text-sm font-medium transition-all",
  navLinkActive:
    "bg-accent-indigo/10 text-accent-cyan border-l-2 border-accent-indigo rounded-l-none",
  navLinkInactive:
    "text-text-secondary hover:text-text-primary hover:bg-surface-hover",
  navLinkLabel: "block",

  profileLinkBase:
    "flex items-center justify-start gap-3 p-3 rounded-xl transition-all mt-1",
  profileLinkActive: "bg-accent-indigo/10 ring-1 ring-accent-indigo",
  profileLinkInactive: "bg-surface-hover hover:bg-border-base",
  profileAvatar:
    "w-8 h-8 rounded-full gradient-accent flex items-center justify-center " +
    "text-white text-xs font-bold shrink-0",
  profileInfo: "block min-w-0 flex-1",
  profileName: "text-sm font-medium text-text-primary truncate leading-tight",
  profileEmail: "text-xs text-text-muted truncate leading-tight mt-0.5",

  logoutButton:
    "w-full justify-start gap-3 px-3 py-2 rounded-xl " +
    "text-text-muted hover:text-price-down hover:bg-price-down/10",
};

export const styles = {
  rail: railStyles,
  drawer: drawerStyles,
};
