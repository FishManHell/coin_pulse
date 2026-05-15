"use client";

import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SearchInputProps extends ComponentProps<"input"> {
  icon?: ReactNode;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(({ icon, className, ...props }, ref) => (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10">
        {icon ?? <Search size={15} />}
      </span>
      <input
        ref={ref}
        className={cn(
          "w-full bg-surface border border-border-base rounded-xl pl-9 pr-3 py-2 text-sm",
          "text-text-primary placeholder:text-text-muted outline-none",
          "focus:border-accent-indigo transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    </div>
  )
);

SearchInput.displayName = "SearchInput";
