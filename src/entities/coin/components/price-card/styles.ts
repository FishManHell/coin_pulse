export const styles = {
  card: "w-full cursor-pointer text-left bg-surface border rounded-2xl p-5 transition-all duration-200 hover:bg-surface-hover hover:scale-[1.01]",
  cardSelected: "border-accent-indigo shadow-[0_0_0_1px_#4F46E5]",
  cardDefault: "border-border-base",
  flashUp: "flash-up",
  flashDown: "flash-down",

  topRow: "flex items-center justify-between gap-2 mb-4",
  headerInfo: "flex items-center gap-2.5 min-w-0 flex-1",
  headerText: "min-w-0",
  coinName: "text-sm font-semibold text-text-primary leading-none mb-0.5 truncate",
  coinTicker: "text-xs text-text-muted truncate",

  topRight: "flex items-center gap-1.5 shrink-0",

  badgeBase: "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
  badgeUp: "text-price-up bg-price-up/10",
  badgeDown: "text-price-down bg-price-down/10",

  starButton: "rounded-lg hover:bg-transparent",
  starButtonActive: "text-accent-cyan",
  starButtonInactive: "text-text-muted hover:text-accent-cyan",

  priceText: "text-2xl font-bold text-text-primary",
  changeText: "text-xs mt-1",
  changeUp: "text-price-up",
  changeDown: "text-price-down",
};
