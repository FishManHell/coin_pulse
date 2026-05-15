const ICON_CDN = "https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530b/svg/color";

export const getCoinIconUrl = (base: string): string => `${ICON_CDN}/${base.toLowerCase()}.svg`;
