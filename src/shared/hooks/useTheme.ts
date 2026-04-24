"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/store";

export const useTheme = () => {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved && saved !== theme) apply(saved);
  }, []);

  const apply = (t: "dark" | "light") => {
    const html = document.documentElement;
    if (t === "light") {
      html.classList.add("light");
      html.classList.remove("dark");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
    localStorage.setItem("theme", t);
    setTheme(t);
  };

  const toggle = () => apply(theme === "dark" ? "light" : "dark");

  return { theme, toggle };
};
