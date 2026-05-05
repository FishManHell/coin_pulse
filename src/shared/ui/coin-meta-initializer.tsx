"use client";

import { useEffect } from "react";
import { useAppStore } from "@/shared/store";

export const CoinMetaInitializer = () => {
  const setCoinMeta = useAppStore((s) => s.setCoinMeta);
  const selectedQuote = useAppStore((s) => s.selectedQuote);

  useEffect(() => {
    fetch(`/api/coin-meta?quote=${selectedQuote}`)
      .then((r) => r.json())
      .then(setCoinMeta);
  }, [selectedQuote, setCoinMeta]);

  return null;
};
