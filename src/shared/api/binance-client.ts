const BASE = "https://data-api.binance.vision/api/v3";

/**
 * Check whether a symbol pair is currently tradeable on Binance.
 * Uses the public ticker/price endpoint (200 if valid, 400 if unknown).
 * Throws on network errors — caller should `.catch(() => false)` for fallback flow.
 */
export const symbolExists = async (symbol: string): Promise<boolean> => {
  const res = await fetch(`${BASE}/ticker/price?symbol=${symbol}`);
  return res.ok;
};
