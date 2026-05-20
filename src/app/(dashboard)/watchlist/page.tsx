import { getTranslations } from "next-intl/server";
import { requireUser } from "@/entities/user/lib/require-user";
import connectDB from "@/shared/lib/db";
import WatchlistItem from "@/entities/watchlist/model/watchlist-item";
import { Header } from "@/widgets/header";
import { WatchlistTable } from "@/widgets/watchlist-table";

const WatchlistPage = async () => {
  const user = await requireUser();

  await connectDB();
  const count = await WatchlistItem.countDocuments({ userId: user.id });

  const t = await getTranslations();

  return (
    <>
      <Header title={t("nav.watchlist")} showSearch={false} />
      <div className="flex-1 p-6 flex flex-col min-h-0">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            {t("sections.yourWatchlist")}
          </h2>
          <p className="text-text-muted text-sm mt-1">
            {t("sections.assetsTracked", { count })}
          </p>
        </div>
        <WatchlistTable />
      </div>
    </>
  );
};

export default WatchlistPage;
