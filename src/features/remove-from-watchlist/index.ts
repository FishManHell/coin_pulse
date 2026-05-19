"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { deleteWatchlistItem, useWatchlistStore } from "@/entities/watchlist";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

export const useRemoveFromWatchlist = () => {
  const setItems = useWatchlistStore((s) => s.setItems);
  const t = useTranslations("toasts.watchlist");
  const translateError = useApiErrorTranslator();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: deleteWatchlistItem,
    onSuccess: (_, symbol) => {
      const current = useWatchlistStore.getState().items;
      setItems(current.filter((w) => w.symbol !== symbol));
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
