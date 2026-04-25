"use client";

import { useEffect } from "react";
import { subscribe } from "@/shared/api/price-stream";

export const usePriceStream = (symbols: string[]) => {
  const key = symbols.join(",");
  useEffect(() => {
    if (!key) return;
    return subscribe(key.split(","));
  }, [key]);
};
