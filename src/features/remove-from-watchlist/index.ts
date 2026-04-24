"use client";

import { useState } from "react";
import { useAppStore } from "@/shared/store";

export const useRemoveFromWatchlist = () => {
  const [loading, setLoading] = useState(false);
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);

  const remove = async (symbol: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" });
      if (!res.ok) return;
      setWatchlist(watchlist.filter((w) => w.symbol !== symbol));
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};
