import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/shared/lib/utils";
import type { GroupedPosition } from "./group-positions";
import { SummaryCard } from "./SummaryCard";

interface InvestedCardProps {
  grouped: GroupedPosition[];
}

export const InvestedCard = ({ grouped }: Readonly<InvestedCardProps>) => {
  const t = useTranslations("portfolio.summary");
  const invested = useMemo(
    () => grouped.reduce((s, g) => s + g.totalCost, 0),
    [grouped],
  );
  return (
    <SummaryCard
      label={t("invested")}
      value={`$${formatPrice(invested)}`}
      color="text-text-primary"
    />
  );
};
