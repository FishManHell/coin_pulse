import type { CoinMeta } from "@/entities/coin";

export const deriveEffectiveSymbol = (userSymbol: string, pairs: CoinMeta[]): string => {
  if (pairs.length === 0) return "";
  if (userSymbol && pairs.some((p) => p.symbol === userSymbol)) return userSymbol;
  return pairs[0].symbol;
};
