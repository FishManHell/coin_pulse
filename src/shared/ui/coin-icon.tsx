"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { getCoinIconUrl, COIN_ICON_CDN_COUNT } from "@/shared/lib/coin-icon";
import { getCoinGradient } from "@/shared/lib/coin-gradient";

type Size = "sm" | "md" | "lg";

const sizeClasses: Record<Size, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-10 h-10 text-base",
};

interface CoinIconProps {
  base: string;
  size?: Size;
  className?: string;
}

export const CoinIcon = ({ base, size = "md", className }: Readonly<CoinIconProps>) => {
  const [loaded, setLoaded] = useState(false);
  const [cdnIdx, setCdnIdx] = useState(0);
  const [prevBase, setPrevBase] = useState(base);

  // Reset load state when base changes — canonical "adjusting state on prop change" pattern.
  if (prevBase !== base) {
    setPrevBase(base);
    setLoaded(false);
    setCdnIdx(0);
  }

  const exhausted = cdnIdx >= COIN_ICON_CDN_COUNT;

  const handleError = () => {
    if (cdnIdx < COIN_ICON_CDN_COUNT - 1) {
      setCdnIdx(cdnIdx + 1);
      setLoaded(false);
      return;
    }
    setCdnIdx(COIN_ICON_CDN_COUNT);
  };

  return (
    <div className={cn("relative rounded-full shrink-0", sizeClasses[size], className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-full flex items-center justify-center text-white font-bold",
          getCoinGradient(base),
        )}
      >
        {base[0]}
      </div>
      {!exhausted && (
        <img
          key={cdnIdx}
          src={getCoinIconUrl(base, cdnIdx)}
          alt={base}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={handleError}
          className={cn(
            "absolute inset-0 w-full h-full rounded-full bg-white transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
};
