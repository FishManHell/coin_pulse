import * as React from "react";
import { cn } from "@/shared/lib/utils";

type Props = React.ComponentProps<"input"> & {
  label: string;
};

export const LabeledField = ({ label, className, id, ...rest }: Props) => {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  return (
    <div>
      <label htmlFor={inputId} className="block text-xs text-text-muted mb-1.5">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "w-full bg-bg border border-border-base rounded-xl px-4 py-3 text-sm",
          "text-text-primary placeholder:text-text-muted outline-none focus:border-accent-indigo transition-colors",
          className,
        )}
        {...rest}
      />
    </div>
  );
};
