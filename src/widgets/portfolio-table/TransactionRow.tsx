"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useRemoveFromPortfolio } from "@/features/remove-from-portfolio";
import { formatPrice } from "@/shared/lib/utils";
import { DeleteIconButton } from "@/shared/ui/delete-icon-button";
import { styles } from "./styles";
import type { PortfolioPosition } from "@/entities/portfolio";

export const TransactionRow = ({ tx }: { tx: PortfolioPosition }) => {
  const { remove, loading } = useRemoveFromPortfolio();
  const format = useFormatter();
  const tActions = useTranslations("portfolio.actions");
  const tConfirm = useTranslations("confirms.deleteTransaction");

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
      <DeleteIconButton
        onConfirm={() => remove(tx.id)}
        disabled={loading}
        ariaLabel={tActions("deleteTransaction")}
        confirm={{
          title: tConfirm("title"),
          confirm: tConfirm("confirm"),
          cancel: tConfirm("cancel"),
        }}
      />
    </div>
  );
};
