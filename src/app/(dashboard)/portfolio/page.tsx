import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/entities/user/lib/require-user";
import connectDB from "@/shared/lib/db";
import PortfolioPosition from "@/entities/portfolio/model/portfolio-position";
import { dehydratePortfolio, toPortfolioDTO } from "@/entities/portfolio";
import { Header } from "@/widgets/header";
import { PortfolioTable } from "@/widgets/portfolio-table";
import { PortfolioCount } from "@/widgets/portfolio-table/PortfolioCount";

const PortfolioPage = async () => {
  const user = await requireUser();

  await connectDB();
  const rawPositions = await PortfolioPosition.find({ userId: user.id })
    .sort({ createdAt: -1 })
    .lean();
  const positions = rawPositions.map(toPortfolioDTO);

  const t = await getTranslations();

  return (
    <>
      <Header title={t("nav.portfolio")} showSearch={false} />
      <HydrationBoundary state={dehydratePortfolio(positions)}>
        <div className="flex-1 p-6 flex flex-col min-h-0">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary">{t("sections.yourPortfolio")}</h2>
            <PortfolioCount />
          </div>
          <PortfolioTable />
        </div>
      </HydrationBoundary>
    </>
  );
};

export default PortfolioPage;
