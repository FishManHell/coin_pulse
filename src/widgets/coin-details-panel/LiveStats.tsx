"use client";

import { useTranslations } from "next-intl";
import { usePricesStore } from "@/entities/coin";
import { StatRow } from "./StatRow";
import { StatsBlockSkeleton } from "./StatsBlockSkeleton";
import { getStatRows } from "./get-stat-rows";

export const LiveStats = ({ symbol }: { symbol: string }) => {
  const ticker = usePricesStore((s) => s.prices[symbol]);
  const t = useTranslations("dashboard.coinDetails.stats");
  if (!ticker) return <StatsBlockSkeleton />;
  return (
    <div>
      {getStatRows(ticker).map((row) => (
        <StatRow
          key={row.labelKey}
          label={t(row.labelKey)}
          value={row.value}
          valueClass={row.valueClass}
        />
      ))}
    </div>
  );
};
