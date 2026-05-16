import { useMemo } from "react";
import { formatPrice } from "@/shared/lib/utils";
import type { GroupedPosition } from "./group-positions";
import { SummaryCard } from "./SummaryCard";

interface InvestedCardProps {
  grouped: GroupedPosition[];
}

export const InvestedCard = ({ grouped }: Readonly<InvestedCardProps>) => {
  const invested = useMemo(
    () => grouped.reduce((s, g) => s + g.totalCost, 0),
    [grouped],
  );
  return (
    <SummaryCard
      label="Invested"
      value={`$${formatPrice(invested)}`}
      color="text-text-primary"
    />
  );
};
