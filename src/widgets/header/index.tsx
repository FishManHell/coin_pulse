"use client";

import {ReactNode, useState} from "react";
import { Search, Bell, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { SearchCoin } from "@/features/search-coin";

interface HeaderProps { title: string; actions?: ReactNode };

export const Header = ({ title, actions }: Readonly<HeaderProps>) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 lg:px-6 border-b border-border-base bg-surface/80 backdrop-blur-sm sticky top-0 z-30">

      <h1 className={cn(
        "text-base lg:text-lg font-semibold text-text-primary truncate transition-all",
        searchOpen ? "hidden" : "block"
      )}>
        {title}
      </h1>

      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {/* Mobile: expandable search */}
        <div className={cn("relative md:hidden", searchOpen ? "flex-1" : "")}>
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search coins…"
                  className="w-full bg-bg border border-accent-indigo rounded-xl pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg border border-border-base text-text-muted hover:text-text-primary transition-all shrink-0"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg border border-border-base text-text-muted hover:text-text-primary hover:border-accent-indigo transition-all"
            >
              <Search size={16} />
            </button>
          )}
        </div>

        {/* Desktop: full SearchCoin with dropdown */}
        <div className="hidden md:block">
          <SearchCoin />
        </div>

        {actions}

        <ThemeToggle />

        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-bg border border-border-base text-text-muted hover:text-text-primary hover:border-accent-indigo transition-all">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
};
