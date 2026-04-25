import { Header } from "@/widgets/header";
import { MarketOverview } from "@/widgets/market-overview";
import { CandlestickChart } from "@/widgets/candlestick-chart";
import { CoinDetailsPanel } from "@/widgets/coin-details-panel";
import { fetchTopSymbols } from "@/shared/api/binance";
import { QuoteSelector } from "@/features/select-quote";
import { SelectedSymbolStream } from "@/shared/ui/selected-symbol-stream";

const DashboardPage = async () => {
  const initialSymbols = await fetchTopSymbols(6, "USDT");

  return (
    <>
      <Header title="Dashboard" actions={<QuoteSelector />} />
      <SelectedSymbolStream />
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <MarketOverview initialSymbols={initialSymbols} />
          <CandlestickChart />
        </div>
        <CoinDetailsPanel />
      </div>
    </>
  );
};

export default DashboardPage;
