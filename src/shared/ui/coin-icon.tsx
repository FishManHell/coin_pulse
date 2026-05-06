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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [base]);

  if (failed) {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center text-white font-bold shrink-0",
          sizeClasses[size],
          getCoinGradient(base),
          className
        )}
      >
        {base[0]}
      </div>
    );
  }

  return (
    <img
      src={getCoinIconUrl(base)}
      alt={base}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("rounded-full shrink-0 bg-white", sizeClasses[size], className)}
    />
  );
};
