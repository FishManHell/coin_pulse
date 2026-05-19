"use client";

import { AlertDialog } from "radix-ui";
import { Button } from "@/shared/ui/button";
import { styles } from "./confirm-dialog.styles";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) => (
  <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.overlay} />
      <AlertDialog.Content className={styles.content}>
        <AlertDialog.Title className={styles.title}>{title}</AlertDialog.Title>
        {description && (
          <AlertDialog.Description className={styles.description}>
            {description}
          </AlertDialog.Description>
        )}
        <div className={styles.actions}>
          <AlertDialog.Cancel asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button
              variant={destructive ? "destructive" : "default"}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
