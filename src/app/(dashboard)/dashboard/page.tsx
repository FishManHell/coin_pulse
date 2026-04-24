import { Header } from "@/widgets/header";
import { MarketOverview } from "@/widgets/market-overview";
import { CandlestickChart } from "@/widgets/candlestick-chart";
import { CoinDetailsPanel } from "@/widgets/coin-details-panel";

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" />
      <div className="flex flex-1 min-h-0">
        {/* Main content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <MarketOverview />
          <CandlestickChart />
        </div>

        {/* Right panel */}
        <CoinDetailsPanel />
      </div>
    </>
  );
}
