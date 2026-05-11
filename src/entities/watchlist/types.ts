import type { CoinAssetDTO, CoinAssetLean } from "@/shared/types/coin-asset";

export interface WatchlistItem extends CoinAssetDTO {
  addedAt: string;
}

export interface WatchlistItemLean extends CoinAssetLean {
  addedAt: Date | string;
}
