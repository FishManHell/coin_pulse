import type { CoinAssetDTO, CoinAssetLean } from "@/shared/types/coin-asset";

export interface PortfolioPosition extends CoinAssetDTO {
  quantity: number;
  buyPrice: number;
  createdAt: string;
}

export interface PortfolioPositionLean extends CoinAssetLean {
  quantity: number;
  buyPrice: number;
  createdAt: Date | string;
}
