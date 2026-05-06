export const ROW_GRID = "grid-cols-[1fr_140px_140px_120px_52px]";

export const styles = {
  wrap: "flex-1 min-h-0 flex flex-col gap-4",

  table: "bg-surface border border-border-base rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0",
  tableScroll: "overflow-auto flex-1 min-h-0",
  tableInner: "min-w-[720px]",

  empty: "flex-1 flex flex-col items-center justify-center py-20 text-center",
  emptyIcon: "text-text-muted mb-4",
  emptyTitle: "text-text-primary font-medium mb-1",
  emptyText: "text-text-muted text-sm",

  headerRow: `grid ${ROW_GRID} px-5 py-3 border-b border-border-base sticky top-0 z-10 bg-surface`,
  headerCell: "text-xs font-medium text-text-muted uppercase tracking-wider",

  row: `grid ${ROW_GRID} items-center px-5 py-4 border-b border-border-base last:border-0 hover:bg-surface-hover transition-colors`,
  asset: "flex items-center gap-3",
  avatar: "w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white text-sm font-bold shrink-0",
  assetName: "text-sm font-semibold text-text-primary",
  assetTicker: "text-xs text-text-muted",

  pricePrimary: "text-sm font-medium text-text-primary",
  changeCell: "flex items-center gap-1 text-sm font-medium",
  changeMuted: "text-text-muted",
  volumeCell: "text-sm text-text-secondary",

  trashBtn: "text-text-muted hover:text-price-down hover:bg-price-down/10",
};
