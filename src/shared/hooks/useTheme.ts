"use client";

import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
  const { resolvedTheme, setTheme } = useNextTheme();
  const theme = (resolvedTheme ?? "light") as "dark" | "light";
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  return { theme, toggle };
};
