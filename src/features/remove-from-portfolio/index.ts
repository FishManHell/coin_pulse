"use client";

import { useState } from "react";
import { useAppStore } from "@/shared/store";

export const useRemoveFromPortfolio = () => {
  const [loading, setLoading] = useState(false);
  const setPortfolio = useAppStore((s) => s.setPortfolio);
  const portfolio = useAppStore((s) => s.portfolio);

  const remove = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setPortfolio(portfolio.filter((p) => p.id !== id));
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading };
};
