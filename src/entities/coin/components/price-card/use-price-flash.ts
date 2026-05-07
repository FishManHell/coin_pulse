import { useEffect, useRef, useState } from "react";

const FLASH_DURATION_MS = 600;

export type FlashDirection = "up" | "down" | null;

export const usePriceFlash = (price: number): FlashDirection => {
  const prevPriceRef = useRef(price);
  const [flash, setFlash] = useState<FlashDirection>(null);

  useEffect(() => {
    if (price === prevPriceRef.current) return;
    setFlash(price > prevPriceRef.current ? "up" : "down");
    prevPriceRef.current = price;
    const timer = setTimeout(() => setFlash(null), FLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [price]);

  return flash;
};
