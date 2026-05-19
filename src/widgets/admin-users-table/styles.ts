import type { UserRole } from "@/shared/types/roles";

export const ROW_GRID = "grid-cols-[minmax(200px,1fr)_220px_160px_120px_52px]";

export const ROLE_COLORS: Record<UserRole, string> = {
  superadmin: "text-accent-cyan bg-accent-cyan/10",
  admin: "text-accent-indigo bg-accent-indigo/10",
  developer: "text-price-up bg-price-up/10",
  user: "text-text-secondary bg-surface-hover",
};

export const styles = {
  wrap: "flex-1 min-h-0 flex flex-col",

  table: "bg-surface border border-border-base rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0",
  tableScroll: "overflow-auto flex-1 min-h-0",
  tableInner: "min-w-[800px]",

  headerRow: `grid ${ROW_GRID} px-5 py-3 border-b border-border-base sticky top-0 z-10 bg-surface`,
  headerCell: "text-xs font-medium text-text-muted uppercase tracking-wider",

  row: `grid ${ROW_GRID} items-center px-5 py-4 border-b border-border-base last:border-0 hover:bg-surface-hover transition-colors`,

  avatar: "w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0",
  userBlock: "flex items-center gap-3 min-w-0",
  userName: "text-sm font-medium text-text-primary truncate min-w-0",
  email: "block text-sm text-text-secondary truncate min-w-0",
  joined: "text-xs text-text-muted",

  roleCell: "relative w-36",
  roleBadge: "text-xs font-medium px-3 py-1.5 rounded-lg inline-block",
  roleSelectTrigger: "w-full h-auto text-xs font-medium px-3 py-1.5 rounded-lg border-border-base",

  deleteCell: "flex justify-center",
  shield: "text-text-muted opacity-30",
};
