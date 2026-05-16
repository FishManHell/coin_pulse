// Icon CDN chain — tried in order on <img onError>. atomiclabs has crisp SVGs
// for the top ~500 coins; CoinCap fills most of the long tail with PNGs.
// Both are public, no auth, no rate limit at our usage level.
const CDN_BUILDERS: ReadonlyArray<(base: string) => string> = [
  (base) => `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530b/svg/color/${base}.svg`,
  (base) => `https://assets.coincap.io/assets/icons/${base}@2x.png`,
];

export const COIN_ICON_CDN_COUNT = CDN_BUILDERS.length;

export const getCoinIconUrl = (base: string, cdnIdx = 0): string => {
  const builder = CDN_BUILDERS[cdnIdx] ?? CDN_BUILDERS[0];
  return builder(base.toLowerCase());
};
