"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export const ALL_QUOTES = "all";

interface WatchlistQuoteFilterProps {
  value: string;
  onChange: (value: string) => void;
  quotes: string[];
}

export const WatchlistQuoteFilter = ({ value, onChange, quotes }: Readonly<WatchlistQuoteFilterProps>) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-28 h-9 rounded-xl text-xs border-border-base bg-bg">
      <SelectValue />
    </SelectTrigger>
    <SelectContent className="bg-surface border-border-base">
      <SelectItem value={ALL_QUOTES} className="text-xs cursor-pointer">
        All quotes
      </SelectItem>
      {quotes.map((q) => (
        <SelectItem key={q} value={q} className="text-xs cursor-pointer">
          {q}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
