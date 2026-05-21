import { getTranslations } from "next-intl/server";
import { Header } from "@/widgets/header";
import { MarketOverview } from "@/widgets/market-overview";
import { CandlestickChart } from "@/widgets/candlestick-chart";
import { CoinDetailsPanel } from "@/widgets/coin-details-panel";
import { fetchTopSymbols } from "@/shared/api/binance";
import { QuoteSelector } from "@/features/select-quote";
import { SelectedSymbolStream } from "@/entities/coin";

const DashboardPage = async () => {
  const [initialSymbols, t] = await Promise.all([
    fetchTopSymbols(6, "USDT"),
    getTranslations("nav"),
  ]);

  return (
    <>
      <Header title={t("dashboard")} actions={<QuoteSelector />} />
      <SelectedSymbolStream />
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 px-3 py-6 sm:p-6 space-y-6 overflow-y-auto">
          <MarketOverview initialSymbols={initialSymbols} />
          <CandlestickChart />
        </div>
        <CoinDetailsPanel />
      </div>
    </>
  );
};

export default DashboardPage;
