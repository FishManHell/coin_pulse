"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { deletePortfolioPosition } from "@/entities/portfolio";

export const useRemoveFromPortfolio = () => {
  const setPortfolio = useAppStore((s) => s.setPortfolio);
  const portfolio = useAppStore((s) => s.portfolio);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: deletePortfolioPosition,
    onSuccess: (_, id) => {
      setPortfolio(portfolio.filter((p) => p.id !== id));
      toast.success("Position removed");
    },
    onError: (err) => {
      toast.error("Couldn't remove position", { description: err.message });
    },
  });

  const remove = (id: string) => {
    if (loading) return;
    mutate(id);
  };

  return { remove, loading };
};
