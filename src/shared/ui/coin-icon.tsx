"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { getCoinIconUrl } from "@/shared/lib/coin-icon";
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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [base]);

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
      {!failed && (
        <img
          src={getCoinIconUrl(base)}
          alt={base}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 w-full h-full rounded-full bg-white transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  );
};
