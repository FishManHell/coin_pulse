"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { deleteWatchlistItem } from "@/entities/watchlist";

export const useRemoveFromWatchlist = () => {
  const setWatchlist = useAppStore((s) => s.setWatchlist);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: deleteWatchlistItem,
    onSuccess: (_, symbol) => {
      const current = useAppStore.getState().watchlist;
      setWatchlist(current.filter((w) => w.symbol !== symbol));
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
