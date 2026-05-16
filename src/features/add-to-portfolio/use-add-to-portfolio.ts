"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/shared/store";
import { createPortfolioPosition, type CreatePortfolioInput } from "@/entities/portfolio";

export const useAddToPortfolio = () => {
  const setPortfolio = useAppStore((s) => s.setPortfolio);

  const mutation = useMutation({
    mutationFn: createPortfolioPosition,
    onSuccess: (position, input) => {
      const current = useAppStore.getState().portfolio;
      setPortfolio([position, ...current]);
      toast.success(`${input.name} added to portfolio`);
    },
    onError: (err) => {
      toast.error("Couldn't add position", { description: err.message });
    },
  });

  const add = async (input: CreatePortfolioInput): Promise<boolean> => {
    try {
      await mutation.mutateAsync(input);
      return true;
    } catch {
      return false;
    }
  };

  return { add, loading: mutation.isPending };
};
