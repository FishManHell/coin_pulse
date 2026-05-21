export const styles = {
  overlay:
    "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
  content:
    "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-base bg-surface p-6 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
  title: "text-lg font-semibold text-text-primary",
  description: "mt-2 text-sm text-text-muted leading-relaxed",
  actions: "mt-6 flex justify-end gap-2",
};
