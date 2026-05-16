"use client";

import { useAppStore } from "@/shared/store";
import { StatRow } from "./StatRow";
import { StatsBlockSkeleton } from "./StatsBlockSkeleton";
import { getStatRows } from "./get-stat-rows";

export const LiveStats = ({ symbol }: { symbol: string }) => {
  const ticker = useAppStore((s) => s.prices[symbol]);
  if (!ticker) return <StatsBlockSkeleton />;
  return (
    <div>
      {getStatRows(ticker).map((row) => <StatRow key={row.label} {...row} />)}
    </div>
  );
};
