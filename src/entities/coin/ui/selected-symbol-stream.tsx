"use client";

import { useMemo } from "react";
import { useSelectionStore } from "@/shared/store";
import { usePriceStream } from "../api/use-price-stream";

export const SelectedSymbolStream = () => {
  const selectedSymbol = useSelectionStore((s) => s.selectedSymbol);
  const symbols = useMemo(() => (selectedSymbol ? [selectedSymbol] : []), [selectedSymbol]);
  usePriceStream(symbols);
  return null;
};
