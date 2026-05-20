"use client";

import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  deletePortfolioPosition,
  portfolioKeys,
  type PortfolioPosition,
} from "@/entities/portfolio";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

export const useRemoveFromPortfolio = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("toasts.portfolio");
  const translateError = useApiErrorTranslator();

  const { mutate, isPending: loading } = useMutation({
    mutationFn: deletePortfolioPosition,
    onSuccess: (_, id) => {
      queryClient.setQueryData<PortfolioPosition[]>(
        portfolioKeys.list(),
        (prev) => (prev ?? []).filter((p) => p.id !== id),
      );
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
