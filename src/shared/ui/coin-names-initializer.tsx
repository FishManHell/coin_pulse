"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/store";

export const CoinNamesInitializer = () => {
  const setCoinNames = useAppStore((s) => s.setCoinNames);

  useEffect(() => {
    fetch("/api/coin-names")
      .then((r) => r.json())
      .then(setCoinNames);
  }, []);

  return null;
};
