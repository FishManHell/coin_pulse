export const ROW_GRID = "grid-cols-[36px_1fr_110px_110px_110px_130px_52px]";

export const styles = {
  wrap: "flex-1 min-h-0 flex flex-col gap-5",

  summaryGrid: "grid grid-cols-1 sm:grid-cols-3 gap-4",
  summaryCard: "bg-surface border border-border-base rounded-2xl p-4 min-w-0",
  summaryLabel: "text-xs text-text-muted mb-1",
  summaryValue: "text-lg font-bold break-words",

  table: "bg-surface border border-border-base rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0",
  tableScroll: "overflow-auto flex-1 min-h-0",
  tableInner: "min-w-[800px]",
  tableHead: "flex items-center justify-between px-5 py-4 border-b border-border-base",
  tableTitle: "text-sm font-semibold text-text-primary",

  empty: "flex-1 flex flex-col items-center justify-center py-16 text-center",
  emptyTitle: "text-text-primary font-medium mb-1",
  emptyText: "text-text-muted text-sm",

  headerRow: `grid ${ROW_GRID} px-5 py-3 border-b border-border-base sticky top-0 z-10 bg-surface`,
  headerCell: "text-xs font-medium text-text-muted uppercase tracking-wider",

  row: `grid ${ROW_GRID} items-center px-5 py-4 border-b border-border-base last:border-0 hover:bg-surface-hover transition-colors cursor-pointer`,
  expandIcon: "flex items-center justify-center text-text-muted",
  assetName: "text-sm font-semibold text-text-primary",
  assetTicker: "text-xs text-text-muted",
  cellSecondary: "text-sm text-text-secondary",
  cellPrimary: "text-sm text-text-primary",
  pnlCell: "flex items-center gap-1 text-sm font-medium",

  txWrap: "bg-bg border-b border-border-base last:border-0",
  txRow: `grid ${ROW_GRID} items-center px-5 py-2.5 text-xs`,
  txDate: "text-text-muted",
  txValue: "text-text-secondary",
};
