import { formatPercent } from "@/shared/lib/utils";
import { QuotedAmount } from "./QuotedAmount";
import type { QuotePnl } from "./compute-portfolio-pnl";

export const PnlNode = ({ q }: { q: QuotePnl }) => (
  <>
    {q.isUp ? "+" : "-"}
    <QuotedAmount value={Math.abs(q.pnl)} quote={q.quote} />
    <span className="ml-1 text-xs opacity-70">({formatPercent(q.pnlPct)})</span>
  </>
);

export const pnlColor = (q: QuotePnl) => (q.isUp ? "text-price-up" : "text-price-down");
