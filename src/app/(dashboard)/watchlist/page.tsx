import { getTranslations } from "next-intl/server";
import { requireUser } from "@/entities/user/lib/require-user";
import { Header } from "@/widgets/header";
import { WatchlistTable } from "@/widgets/watchlist-table";
import { WatchlistCount } from "@/widgets/watchlist-table/WatchlistCount";

const WatchlistPage = async () => {
  await requireUser();
  const t = await getTranslations();

  return (
    <>
      <Header title={t("nav.watchlist")} showSearch={false} />
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("sections.yourWatchlist")}
          </h2>
          <WatchlistCount />
        </div>
        <WatchlistTable />
      </div>
    </>
  );
};

export default WatchlistPage;
