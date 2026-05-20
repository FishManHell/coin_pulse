"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  deleteWatchlistItem,
  watchlistKeys,
  type WatchlistItem,
} from "@/entities/watchlist";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("toasts.watchlist");
  const translateError = useApiErrorTranslator();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: deleteWatchlistItem,
    onSuccess: (_, symbol) => {
      queryClient.setQueryData<WatchlistItem[]>(
        watchlistKeys.list(),
        (prev) => (prev ?? []).filter((w) => w.symbol !== symbol),
      );
      toast.success(t("removed"));
    },
    onError: (err) => {
      toast.error(t("removeFailed"), { description: translateError(err.message) });
    },
  });

  const remove = (symbol: string) => {
    if (loading) return;
    mutate(symbol);
  };

  return { remove, loading };
};
