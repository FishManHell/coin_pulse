import { HydrationBoundary } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/entities/user/lib/require-user";
import { dehydratePortfolio } from "@/entities/portfolio";
import { getPortfolioPositions } from "@/entities/portfolio/model/server-queries";
import { Header } from "@/widgets/header";
import { PortfolioTable } from "@/widgets/portfolio-table";
import { PortfolioCount } from "@/widgets/portfolio-table/PortfolioCount";

const PortfolioPage = async () => {
  const user = await requireUser();
  const positions = await getPortfolioPositions(user.id);
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
