"use client";

import { useState } from "react";
import { useAppStore } from "@/shared/store";
import type { PortfolioPosition } from "@/shared/types";

type AddInput = {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
};

export const useAddToPortfolio = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setPortfolio = useAppStore((s) => s.setPortfolio);
  const portfolio = useAppStore((s) => s.portfolio);

  const add = async (input: AddInput) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed"); return false; }

      const position: PortfolioPosition = {
        id: data._id,
        symbol: data.symbol,
        name: data.name,
        quantity: data.quantity,
        buyPrice: data.buyPrice,
        createdAt: data.createdAt,
      };
      setPortfolio([position, ...portfolio]);
      return true;
    } finally {
      setLoading(false);
    }
  };

  return { add, loading, error };
};
