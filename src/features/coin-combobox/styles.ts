export const styles = {
  dropdown:
    "bg-surface border border-border-base rounded-2xl shadow-xl max-h-72 overflow-y-auto",
  dropdownItem: [
    "w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-hover transition-colors",
    "border-b border-border-base last:border-0",
  ].join(" "),
  dropdownItemActive: "bg-surface-hover",
  itemSymbol: "font-semibold text-sm text-text-primary",
  itemName: "text-xs text-text-muted truncate",
  empty: "text-sm text-text-muted px-3 py-2",
};
