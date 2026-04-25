"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/shared/hooks/useTheme";
import { Button } from "@/shared/ui/button";

export const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      title={mounted ? (theme === "dark" ? "Switch to light" : "Switch to dark") : "Toggle theme"}
      className="rounded-xl bg-bg text-text-muted hover:text-text-primary hover:bg-bg hover:border-accent-indigo"
    >
      {mounted ? (
        theme === "dark" ? <Sun size={16} /> : <Moon size={16} />
      ) : (
        <span className="w-4 h-4" />
      )}
    </Button>
  );
};
