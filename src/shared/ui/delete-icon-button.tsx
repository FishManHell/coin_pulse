"use client";

import type { MouseEvent } from "react";
import { Popover } from "radix-ui";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface ConfirmCopy {
  title: string;
  confirm: string;
  cancel: string;
}

interface DeleteIconButtonProps {
  onConfirm: () => void;
  ariaLabel: string;
  confirm: ConfirmCopy;
  disabled?: boolean;
  className?: string;
}

const triggerStyle = "text-text-muted hover:text-price-down hover:bg-price-down/10";
const popoverContent =
  "z-50 w-56 rounded-xl border border-border-base bg-surface p-3 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95";

const stopBubble = (e: MouseEvent) => e.stopPropagation();

export const DeleteIconButton = ({
  onConfirm,
  ariaLabel,
  confirm,
  disabled,
  className,
}: DeleteIconButtonProps) => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        aria-label={ariaLabel}
        onClick={stopBubble}
        className={cn(triggerStyle, className)}
      >
        <Trash2 />
      </Button>
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        side="top"
        align="end"
        sideOffset={6}
        onClick={stopBubble}
        className={popoverContent}
      >
        <p className="text-sm text-text-primary mb-3">{confirm.title}</p>
        <div className="flex justify-end gap-2">
          <Popover.Close asChild>
            <Button variant="outline" size="xs">
              {confirm.cancel}
            </Button>
          </Popover.Close>
          <Popover.Close asChild>
            <Button variant="destructive" size="xs" onClick={onConfirm}>
              {confirm.confirm}
            </Button>
          </Popover.Close>
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);
