"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn, formatPercent, formatPrice } from "@/shared/lib/utils";
import { styles } from "./styles";
import type { CoinTicker } from "@/entities/coin";

type FlashDir = "up" | "down" | null;

const FLASH_MS = 600;

export const PriceBlock = ({ ticker }: {ticker: CoinTicker}) => {
  const isUp = ticker.priceChangePercent >= 0;
  const prevPriceRef = useRef(ticker.price);
  const [flash, setFlash] = useState<FlashDir>(null);
  const t = useTranslations("dashboard.coinDetails");

  useEffect(() => {
    if (ticker.price === prevPriceRef.current) return;
    setFlash(ticker.price > prevPriceRef.current ? "up" : "down");
    prevPriceRef.current = ticker.price;
    const timer = setTimeout(() => setFlash(null), FLASH_MS);
    return () => clearTimeout(timer);
  }, [ticker.price]);

  return (
    <div className={cn(styles.priceWrap, flash === "up" && "flash-up", flash === "down" && "flash-down")}>
      <p className={styles.priceText}>${formatPrice(ticker.price)}</p>
      <div className={styles.trendRow}>
        <span className={cn(styles.trendBadgeBase, isUp ? styles.trendBadgeUp : styles.trendBadgeDown)}>
          {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {formatPercent(ticker.priceChangePercent)}
        </span>
        <span className={cn(styles.trendChange, isUp ? "text-price-up" : "text-price-down")}>
          {isUp ? "+" : ""}{formatPrice(Math.abs(ticker.priceChange))} {t("todaySuffix")}
        </span>
      </div>
    </div>
  );
};
