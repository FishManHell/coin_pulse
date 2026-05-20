import { formatPrice } from "@/shared/lib/utils";

export const QuotedAmount = ({ value, quote }: { value: number; quote: string }) => (
  <>
    {formatPrice(value)}
    <span className="ml-1 text-xs opacity-60">{quote}</span>
  </>
);
