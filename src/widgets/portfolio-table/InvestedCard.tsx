"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { GroupedPosition } from "./group-positions";
import { computePortfolioPnl } from "./compute-portfolio-pnl";
import { SummaryCard } from "./SummaryCard";
import { QuotedAmount } from "./QuotedAmount";

interface InvestedCardProps {
  grouped: GroupedPosition[];
}

const noPrices: Record<string, number | undefined> = {};

export const InvestedCard = ({ grouped }: Readonly<InvestedCardProps>) => {
  const t = useTranslations("portfolio.summary");
  const { byQuote } = useMemo(() => computePortfolioPnl(grouped, noPrices), [grouped]);
  const [primary, ...rest] = byQuote;

  return (
    <SummaryCard
      label={t("invested")}
      value={<QuotedAmount value={primary.invested} quote={primary.quote} />}
      color="text-text-primary"
      secondary={rest.map((q) => ({
        key: q.quote,
        node: <>+ <QuotedAmount value={q.invested} quote={q.quote} /></>,
      }))}
    />
  );
};
