"use client";

import { ReactNode, useState } from "react";
import { Bell, Search, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { SearchCoin } from "@/features/search-coin";
import { styles } from "./styles";

interface HeaderProps {
  title: string;
  actions?: ReactNode;
}

export const Header = ({ title, actions }: HeaderProps) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const onOpenMobileSearch = () => setMobileSearchOpen(true);
  const onCloseMobileSearch = () => setMobileSearchOpen(false);

  return (
    <header className={styles.header}>
      <h1 className={cn(styles.title, mobileSearchOpen && "hidden md:block")}>
        {title}
      </h1>

      {mobileSearchOpen && (
        <div className={styles.mobileSearch}>
          <SearchCoin autoFocus className="flex-1 w-auto" />
          <button onClick={onCloseMobileSearch} className={styles.closeButton}>
            <X size={15} />
          </button>
        </div>
      )}

      <div className={cn(styles.rightCluster, mobileSearchOpen && "hidden md:flex")}>
        <button onClick={onOpenMobileSearch} className={cn("md:hidden", styles.iconButton)}>
          <Search size={16} />
        </button>

        <div className="hidden md:block">
          <SearchCoin />
        </div>

        {actions}
        <ThemeToggle />

        <button className={styles.iconButton}>
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
};
