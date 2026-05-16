"use client";

import { MouseEvent } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

const styles = {
  button: "rounded-lg hover:bg-transparent",
  active: "text-accent-cyan",
  inactive: "text-text-muted hover:text-accent-cyan",
};

interface WatchlistStarButtonProps {
  isWatched: boolean;
  onToggle: () => void;
  stopPropagation?: boolean;
  size?: number;
  disabled?: boolean;
}

export const WatchlistStarButton = ({
  isWatched,
  onToggle,
  stopPropagation = false,
  size = 14,
  disabled = false,
}: Readonly<WatchlistStarButtonProps>) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) e.stopPropagation();
    onToggle();
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      disabled={disabled}
      className={cn(styles.button, isWatched ? styles.active : styles.inactive)}
    >
      <Star size={size} fill={isWatched ? "currentColor" : "none"} />
    </Button>
  );
};
