"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePricesStore } from "@/entities/coin";
import { usePortfolio } from "@/entities/portfolio";
import { usePriceStream } from "@/entities/coin";
import { Button } from "@/shared/ui/button";
import { AddPositionForm } from "@/features/add-to-portfolio";
import { groupPositions } from "./group-positions";
import { SummaryCards } from "./SummaryCards";
import { PositionRow } from "./PositionRow";
import { TableHeader } from "./TableHeader";
import { EmptyState } from "./EmptyState";
import { styles } from "./styles";

export const PortfolioTable = () => {
  const { data: portfolio = [] } = usePortfolio();
  // Boolean selector flips false → true on the very first tick then stays true,
  // so Zustand skips re-renders on every subsequent tick.
  const hasAnyPrice = usePricesStore((s) => Object.keys(s.prices).length > 0);
  const [showForm, setShowForm] = useState(false);
  const t = useTranslations("portfolio.table");

  const onToggleShowForm = () => setShowForm((prev) => !prev);
  const onCloseForm = () => setShowForm(false);

  const grouped = useMemo(() => groupPositions(portfolio), [portfolio]);
  const symbols = useMemo(() => grouped.map((g) => g.symbol), [grouped]);
  usePriceStream(symbols);

  const initialLoad = grouped.length > 0 && !hasAnyPrice;

  return (
    <div className={styles.wrap}>
      {portfolio.length > 0 && <SummaryCards grouped={grouped} loading={initialLoad} />}

      <div className={styles.table}>
        <div className={styles.tableHead}>
          <h3 className={styles.tableTitle}>{t("title")}</h3>
          <Button variant="gradient" size="xs" onClick={onToggleShowForm}>
            <Plus /> {t("addPosition")}
          </Button>
        </div>

        {showForm && <AddPositionForm onCloseAction={onCloseForm} />}

        {portfolio.length === 0 ? <EmptyState /> : (
          <div className={styles.tableScroll}>
            <div className={styles.tableInner}>
              <TableHeader />
              {grouped.map((group) => <PositionRow key={group.symbol} group={group} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
