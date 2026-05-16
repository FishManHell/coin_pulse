"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { usePriceStream } from "@/shared/hooks/usePriceStream";
import { Button } from "@/shared/ui/button";
import type { PortfolioPosition } from "@/entities/portfolio";
import { AddPositionForm } from "@/features/add-to-portfolio";
import { groupPositions } from "./group-positions";
import { SummaryCards } from "./SummaryCards";
import { PositionRow } from "./PositionRow";
import { TableHeader } from "./TableHeader";
import { EmptyState } from "./EmptyState";
import { styles } from "./styles";

interface PortfolioTableProps { initialPositions: PortfolioPosition[] }

export const PortfolioTable = ({ initialPositions }: Readonly<PortfolioTableProps>) => {
  const setPortfolio = useAppStore((s) => s.setPortfolio);
  const portfolio = useAppStore((s) => s.portfolio);
  // Boolean selector flips false → true on the very first tick then stays true,
  // so Zustand skips re-renders on every subsequent tick.
  const hasAnyPrice = useAppStore((s) => Object.keys(s.prices).length > 0);
  const [showForm, setShowForm] = useState(false);

  const onToggleShowForm = () => setShowForm((prev) => !prev);
  const onCloseForm = () => setShowForm(false);

  const grouped = useMemo(() => groupPositions(portfolio), [portfolio]);
  const symbols = useMemo(() => grouped.map((g) => g.symbol), [grouped]);
  usePriceStream(symbols);

  const initialLoad = grouped.length > 0 && !hasAnyPrice;

  useEffect(() => { setPortfolio(initialPositions); }, []);

  return (
    <div className={styles.wrap}>
      {portfolio.length > 0 && <SummaryCards grouped={grouped} loading={initialLoad} />}

      <div className={styles.table}>
        <div className={styles.tableHead}>
          <h3 className={styles.tableTitle}>Positions</h3>
          <Button variant="gradient" size="xs" onClick={onToggleShowForm}>
            <Plus /> Add position
          </Button>
        </div>

        {showForm && <AddPositionForm onCloseAction={onCloseForm} />}

        {portfolio.length === 0 ? <EmptyState /> : (
          <div className={styles.tableScroll}>
            <div className={styles.tableInner}>
              <TableHeader />
              {grouped.map((group) => <PositionRow key={group.symbol} group={group} initialLoad={initialLoad} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
