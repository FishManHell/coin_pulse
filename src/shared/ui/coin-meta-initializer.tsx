"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/store";

export const CoinMetaInitializer = () => {
  const setCoinMeta = useAppStore((s) => s.setCoinMeta);

  useEffect(() => {
    fetch("/api/coin-meta")
      .then((r) => r.json())
      .then(setCoinMeta);
  }, []);

  return null;
};
