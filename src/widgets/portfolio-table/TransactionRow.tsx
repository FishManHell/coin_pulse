"use client";

import { MouseEvent } from "react";
import { Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useRemoveFromPortfolio } from "@/features/remove-from-portfolio";
import { formatPrice } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { styles } from "./styles";
import type { PortfolioPosition } from "@/entities/portfolio";

export const TransactionRow = ({ tx }: { tx: PortfolioPosition }) => {
  const { remove, loading } = useRemoveFromPortfolio();
  const format = useFormatter();
  const t = useTranslations("portfolio.actions");

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    remove(tx.id);
  };

  const formattedDate = format.dateTime(new Date(tx.createdAt), {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className={styles.txRow}>
      <span />
      <span className={styles.txDate}>{formattedDate}</span>
      <span className={styles.txValue}>{tx.quantity}</span>
      <span className={styles.txValue}>${formatPrice(tx.buyPrice)}</span>
      <span />
      <span />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleDelete}
        disabled={loading}
        aria-label={t("deleteTransaction")}
        className="text-text-muted hover:text-price-down hover:bg-price-down/10"
      >
        <Trash2 />
      </Button>
    </div>
  );
};
