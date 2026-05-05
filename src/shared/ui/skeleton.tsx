import { cn } from "@/shared/lib/utils";

type Props = Readonly<{ className?: string }>;

export const Skeleton = ({ className }: Props) => (
  <span
    aria-hidden
    className={cn("inline-block animate-pulse bg-surface-hover rounded", className)}
  />
);
