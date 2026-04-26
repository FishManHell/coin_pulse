"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/shared/store";
import { usePriceStream } from "@/shared/hooks/usePriceStream";
import { Button } from "@/shared/ui/button";
import type { PortfolioPosition } from "@/shared/types";
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
  const prices = useAppStore((s) => s.prices);
  const [showForm, setShowForm] = useState(false);

  const onToggleShowForm = () => setShowForm(prev => !prev);
  const onCloseForm = () => setShowForm(false);

  const grouped = useMemo(() => groupPositions(portfolio), [portfolio]);
  const symbols = useMemo(() => grouped.map((g) => g.symbol), [grouped]);
  usePriceStream(symbols);

  const totalInvested = grouped.reduce((s, g) => s + g.totalCost, 0);
  const totalCurrent = grouped.reduce((s, g) => {
    const price = prices[g.symbol]?.price ?? g.avgBuyPrice;
    return s + g.totalQty * price;
  }, 0);
  const totalPnl = totalCurrent - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  useEffect(() => { setPortfolio(initialPositions); }, []);

  return (
    <div className={styles.wrap}>
      {portfolio.length > 0 && (
        <SummaryCards
          invested={totalInvested}
          current={totalCurrent}
          pnl={totalPnl}
          pnlPct={totalPnlPct}
        />
      )}

      <div className={styles.table}>
        <div className={styles.tableHead}>
          <h3 className={styles.tableTitle}>Positions</h3>
          <Button variant="gradient" size="xs" onClick={onToggleShowForm}>
            <Plus /> Add position
          </Button>
        </div>

        {showForm && <AddPositionForm onCloseAction={onCloseForm} />}

        {portfolio.length === 0 ? <EmptyState /> : (
          <>
            <TableHeader />
            {grouped.map((group) => <PositionRow key={group.symbol} group={group} />)}
          </>
        )}
      </div>
    </div>
  );
};
