"use client";

import { MouseEvent } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { styles } from "./styles";

type Props = {
  isWatched: boolean;
  onToggle: () => void;
};

export const WatchlistStarButton = ({ isWatched, onToggle }: Readonly<Props>) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleClick}
      className={cn(styles.starButton, isWatched ? styles.starButtonActive : styles.starButtonInactive)}
    >
      <Star size={14} fill={isWatched ? "currentColor" : "none"} />
    </Button>
  );
};
