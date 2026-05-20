"use client";

import { useTranslations } from "next-intl";
import { usePortfolio } from "@/entities/portfolio";

export const PortfolioCount = () => {
  const { data: count = 0 } = usePortfolio((items) => items.length);
  const t = useTranslations();
  return (
    <p className="text-text-muted text-sm mt-1">
      {t("sections.positionsCount", { count })}
    </p>
  );
};
