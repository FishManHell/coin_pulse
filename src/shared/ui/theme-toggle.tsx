"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { Button } from "@/shared/ui/button";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      className="rounded-xl bg-bg text-text-muted hover:text-text-primary hover:bg-bg hover:border-accent-indigo"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
};
