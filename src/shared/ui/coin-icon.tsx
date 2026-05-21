"use client";

import { useEffect, useRef, useState } from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);

  if (prevBase !== base) {
    setPrevBase(base);
    setLoaded(false);
    setCdnIdx(0);
  }

  const exhausted = cdnIdx >= COIN_ICON_CDN_COUNT;

  const advanceCdn = () => {
    setCdnIdx((i) => (i < COIN_ICON_CDN_COUNT - 1 ? i + 1 : COIN_ICON_CDN_COUNT));
  }

  const onLoad = () => setLoaded(true)

  // If the SSR-rendered <img> finished loading before hydration, onLoad never
  // fires — inspect complete/naturalWidth on mount so we don't stay at opacity-0.
  useEffect(() => {
    const img = imgRef.current;
    if (!img?.complete) return;
    if (img.naturalWidth > 0) setLoaded(true);
    else advanceCdn();
  }, [cdnIdx]);

  return (
    <div className={cn("relative rounded-full shrink-0", sizeClasses[size], className)}>
      <div
        className={cn(
          "absolute inset-0 rounded-full flex items-center justify-center text-white font-bold",
          "bg-gradient-to-br",
          getCoinGradient(base),
        )}
      >
        {exhausted && base[0]}
      </div>
      {!exhausted && (
        <img
          ref={imgRef}
          key={cdnIdx}
          src={getCoinIconUrl(base, cdnIdx)}
          alt={base}
          onLoad={onLoad}
          onError={advanceCdn}
          className={cn(
            "absolute inset-0 w-full h-full rounded-full bg-white transition-opacity duration-150",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
};
