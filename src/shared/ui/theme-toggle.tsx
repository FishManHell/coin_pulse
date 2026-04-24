"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg border border-border-base text-text-muted hover:text-text-primary hover:border-accent-indigo transition-all"
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};
