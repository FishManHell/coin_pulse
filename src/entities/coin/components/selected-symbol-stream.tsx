"use client";

import { useMemo } from "react";
import { useAppStore } from "@/shared/store";
import { usePriceStream } from "@/shared/hooks/usePriceStream";

export const SelectedSymbolStream = () => {
  const selectedSymbol = useAppStore((s) => s.selectedSymbol);
  const symbols = useMemo(() => (selectedSymbol ? [selectedSymbol] : []), [selectedSymbol]);
  usePriceStream(symbols);
  return null;
};
