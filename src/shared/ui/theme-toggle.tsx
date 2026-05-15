"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { Button } from "@/shared/ui/button";

const subscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isClient = useIsClient();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      title={isClient ? (theme === "dark" ? "Switch to light" : "Switch to dark") : "Toggle theme"}
      className="rounded-xl bg-bg text-text-muted hover:text-text-primary hover:bg-bg hover:border-accent-indigo"
    >
      {isClient ? (
        theme === "dark" ? <Sun size={16} /> : <Moon size={16} />
      ) : (
        <span className="w-4 h-4" />
      )}
    </Button>
  );
};
