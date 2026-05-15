"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { apiFetch } from "@/shared/lib/api-fetch";

export const useRemoveFromWatchlist = () => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: async (symbol: string): Promise<void> => {
      const res = await apiFetch(`/api/watchlist/${symbol}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to remove from watchlist");
      }
    },
    onSuccess: (_, symbol) => {
      setWatchlist(watchlist.filter((w) => w.symbol !== symbol));
      toast.success("Removed from watchlist");
    },
    onError: (err) => {
      toast.error("Couldn't remove from watchlist", { description: err.message });
    },
  });

  const remove = (symbol: string) => {
    if (loading) return;
    mutate(symbol);
  };

  return { remove, loading };
};
