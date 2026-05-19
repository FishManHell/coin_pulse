"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { deletePortfolioPosition, usePortfolioStore } from "@/entities/portfolio";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

export const useRemoveFromPortfolio = () => {
  const setPositions = usePortfolioStore((s) => s.setPositions);
  const t = useTranslations("toasts.portfolio");
  const translateError = useApiErrorTranslator();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: deletePortfolioPosition,
    onSuccess: (_, id) => {
      const current = usePortfolioStore.getState().positions;
      setPositions(current.filter((p) => p.id !== id));
      toast.success(t("removed"));
    },
    onError: (err) => {
      toast.error(t("removeFailed"), { description: translateError(err.message) });
    },
  });

  const remove = (id: string) => {
    if (loading) return;
    mutate(id);
  };

  return { remove, loading };
};
