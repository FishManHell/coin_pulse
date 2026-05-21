export const styles = {
  overlay:
    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden " +
    "data-[state=open]:animate-[sheet-overlay-in_200ms_ease-out] " +
    "data-[state=closed]:animate-[sheet-overlay-out_180ms_ease-in_forwards]",
  content:
    "fixed left-0 top-0 h-dvh w-60 z-50 flex flex-col " +
    "bg-surface border-r border-border-base md:hidden focus:outline-none " +
    "data-[state=open]:animate-[drawer-in_280ms_ease-out] " +
    "data-[state=closed]:animate-[drawer-out_240ms_ease-in_forwards]",
};
