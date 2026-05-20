import {
  QueryClient,
  dehydrate,
  queryOptions,
  useQuery,
  type DehydratedState,
} from "@tanstack/react-query";
import { fetchPortfolio } from "../api";
import type { PortfolioPosition } from "../types";

export const portfolioKeys = {
  all: ["portfolio"] as const,
  list: () => [...portfolioKeys.all, "list"] as const,
};

export const portfolioListOptions = () =>
  queryOptions({
    queryKey: portfolioKeys.list(),
    queryFn: fetchPortfolio,
    staleTime: Infinity,
  });

export const usePortfolio = <T = PortfolioPosition[]>(
  select?: (data: PortfolioPosition[]) => T,
) => useQuery({ ...portfolioListOptions(), select });

export const dehydratePortfolio = (
  initialData: PortfolioPosition[],
): DehydratedState => {
  const qc = new QueryClient();
  qc.setQueryData(portfolioKeys.list(), initialData);
  return dehydrate(qc);
};
